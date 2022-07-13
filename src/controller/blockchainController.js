const {
  blockchain,
  transactionPool,
  wallet,
  pubsub,
  transactionMiner,
} = require("../initializeObjs");
const Wallet = require("../wallet");
const path = require("path");

const chain = (req, res) => {
  res.json({ chain: blockchain.chain });
};

const chainLength = (req, res) => {
  res.json(blockchain.chain.length);
};

const chainOnPage = (req, res) => {
  const { page } = req.params;
  const { length } = blockchain.chain;
  const numOfBlocksPerPage = 5;

  const chainReversed = [...blockchain.chain].reverse();

  let startIndex = (page - 1) * numOfBlocksPerPage;
  let endIndex = page * numOfBlocksPerPage;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(chainReversed.slice(startIndex, endIndex));
};

const addBlock = (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect("/blockchain");
};

const addTransactionToPool = (req, res) => {
  const { amount, recipientKey } = req.body;

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipientKey, amount });
    } else {
      transaction = wallet.createTransaction({
        recipientKey,
        amount,
        chain: blockchain.chain,
      });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ data: transaction });
};

const getTransactionPool = (req, res) => {
  res.json(transactionPool.transactionMap);
};

const mineTransactions = (req, res) => {
  try {
    transactionMiner.mineTransactions();

    res.redirect("/api/chain");
  } catch (err) {
    res.status(406).json({ error: err.message });
  }
};

const walletInfo = (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
  });
};

const serveFrontEnd = (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
};

const knownAddresses = (req, res) => {
  const addressMap = {};

  for (let i = 1; i < blockchain.chain.length; i++) {
    const block = blockchain.chain[i];

    for (const transaction of block.data) {
      const recipient = Object.keys(transaction.outputMap);

      recipient.forEach((recipient) => (addressMap[recipient] = recipient));
    }
  }

  res.json(Object.keys(addressMap));
};

module.exports = {
  chain,
  addBlock,
  addTransactionToPool,
  getTransactionPool,
  mineTransactions,
  walletInfo,
  serveFrontEnd,
  knownAddresses,
  chainLength,
  chainOnPage,
};
