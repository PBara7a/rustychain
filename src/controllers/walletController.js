const { blockchain, wallet } = require("../initializeObjs");
const Wallet = require("../wallet");

const walletInfo = (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
  });
};

module.exports = {
  walletInfo,
};
