const Blockchain = require("../blockchain");
const PubSub = require("../pubsub");

const blockchain = new Blockchain();
const pubsub = new PubSub(blockchain);

setTimeout(() => pubsub.broadcastChain(), 1000);

const getChain = (req, res) => {
  res.json({ chain: blockchain.chain });
};

const addBlock = (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect("/blockchain");
};

module.exports = { getChain, addBlock, blockchain };
