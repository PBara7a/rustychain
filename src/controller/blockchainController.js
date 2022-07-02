const Blockchain = require("../blockchain");
const PubSub = require("../pubsub");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transactionPool");
const TransactionMiner = require("../TransactionMiner");
const path = require("path");

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

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

  res.redirect("/blockchain");
};

const walletInfo = (req, res) => {
  const address = wallet.publicKey

  res.json({ 
    address, 
    balance: Wallet.calculateBalance({ chain: blockchain.chain , address })
  })
}

const page = (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
}

module.exports = {
  chain,
  addBlock,
  addTransactionToPool,
  getTransactionPool,
  mineTransactions,
  walletInfo,
  page,
  blockchain,
  transactionPool,
};
