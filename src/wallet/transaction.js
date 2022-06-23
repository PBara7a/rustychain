const { v1: uuidv1 } = require("uuid");
const { verifySignature } = require("../utils");

class Transaction {
  constructor({ senderWallet, recipientKey, amount }) {
    this.id = uuidv1();
    this.outputMap = this.createOutputMap({
      senderWallet,
      recipientKey,
      amount,
    });
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipientKey, amount }) {
    const outputMap = {};

    outputMap[recipientKey] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    };
  }

  update({ senderWallet, recipientKey, amount }) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error("Amount exceeds balance");
    }

    if (!this.outputMap.hasOwnProperty(recipientKey)) {
      this.outputMap[recipientKey] = amount;
    } else {
      const previousAmount = this.outputMap[recipientKey];
      console.log(previousAmount);
      this.outputMap[recipientKey] = previousAmount + amount;
    }

    this.outputMap[recipientKey] = amount;

    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  update({ senderWallet, recipientKey, amount }) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error("Amount exceeds balance");
    }

    if (!this.outputMap[recipientKey]) {
      this.outputMap[recipientKey] = amount;
    } else {
      this.outputMap[recipientKey] = this.outputMap[recipientKey] + amount;
    }

    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static isValidTransaction(transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount
    );

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }
}

module.exports = Transaction;
