const Blockchain = require("./blockchain");
const TransactionPool = require("./wallet/transactionPool");
const Wallet = require("./wallet");
const PubSub = require("./pubsub");
const TransactionMiner = require("./TransactionMiner");

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

module.exports = {
  blockchain,
  transactionPool,
  wallet,
  pubsub,
  transactionMiner,
};
