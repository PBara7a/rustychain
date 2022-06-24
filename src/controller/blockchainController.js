const Blockchain = require("../blockchain");
const PubSub = require("../pubsub");
const Wallet = require("../wallet");
const TransactionPool = require("../wallet/transactionPool");

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({ blockchain, transactionPool });

const getChain = (req, res) => {
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
      transaction = wallet.createTransaction({ recipientKey, amount });
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

module.exports = {
  getChain,
  addBlock,
  addTransactionToPool,
  getTransactionPool,
  blockchain,
};
