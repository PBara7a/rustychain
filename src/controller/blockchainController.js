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
  transactionMiner.mineTransactions();

  res.redirect("/api/chain");
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

module.exports = {
  chain,
  addBlock,
  addTransactionToPool,
  getTransactionPool,
  mineTransactions,
  walletInfo,
  serveFrontEnd,
};
