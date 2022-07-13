const {
  blockchain,
  transactionPool,
  wallet,
  pubsub,
  transactionMiner,
} = require("../initializeObjs");

const transact = (req, res) => {
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
  try {
    transactionMiner.mineTransactions();

    res.redirect("/chain");
  } catch (err) {
    res.status(406).json({ error: err.message });
  }
};

module.exports = {
  transact,
  getTransactionPool,
  mineTransactions,
};
