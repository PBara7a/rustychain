const { blockchain, pubsub } = require("../initializeObjs");

const addBlock = (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect("/chain");
};

module.exports = {
  addBlock,
};
