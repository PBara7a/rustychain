const Blockchain = require("../blockchain");
const blockchain = new Blockchain();

const getChain = (req, res) => {
  res.json({ chain: blockchain.chain });
};

const addBlock = (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });

  res.redirect("/blockchain");
};

module.exports = { getChain, addBlock };
