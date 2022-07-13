const { blockchain } = require("../initializeObjs");

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
  knownAddresses,
};
