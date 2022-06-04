const { v1: uuidv1 } = require("uuid");

class Transaction {
  constructor({ senderWallet, recipientKey, amount }) {
    this.id = uuidv1();
    this.outputMap = this.createOutputMap({
      senderWallet,
      recipientKey,
      amount,
    });
  }

  createOutputMap({ senderWallet, recipientKey, amount }) {
    const outputMap = {};

    outputMap[recipientKey] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }
}

module.exports = Transaction;
