const Wallet = require("../src/wallet");
const {
  blockchain,
  transactionPool,
  wallet,
  transactionMiner,
} = require("../src/initializeObjs");

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ recipientKey, amount }) => {
  const transaction = wallet.createTransaction({
    recipientKey,
    amount,
    chain: blockchain.chain,
  });

  transactionPool.setTransaction(transaction);
};

const walletAction = () =>
  generateWalletTransaction({
    wallet,
    recipientKey: walletFoo.publicKey,
    amount: 10,
  });

const walletFooAction = () =>
  generateWalletTransaction({
    wallet: walletFoo,
    recipientKey: walletBar.publicKey,
    amount: 15,
  });

const walletBarAction = () =>
  generateWalletTransaction({
    wallet: walletBar,
    recipientKey: wallet.publicKey,
    amount: 25,
  });

const seedBackend = () => {
  for (let i = 0; i < 10; i++) {
    if (i % 3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i % 3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
};

module.exports = seedBackend;
