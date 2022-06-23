// https://github.com/indutny/elliptic
const { ec, cryptographicHash } = require("../utils");
const Transaction = require("./transaction");

class Wallet {
  // default for testing/development purposes
  constructor(balance = 1000) {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");

    this.balance = balance;
  }

  sign(data) {
    const hashedData = cryptographicHash(data);
    return this.keyPair.sign(hashedData);
  }

  createTransaction({ amount, recipientKey }) {
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipientKey, amount });
  }
}

module.exports = Wallet;
