const { blockchain } = require("../initializeObjs");

const chain = (req, res) => {
  res.json({ chain: blockchain.chain });
};

const chainLength = (req, res) => {
  res.json(blockchain.chain.length);
};

const chainPage = (req, res) => {
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

module.exports = {
  chain,
  chainLength,
  chainPage,
};
