const { ec } = require("../utils/ellipticCurve");

class Wallet {
  // default for testing/development purposes
  constructor(balance = 1000) {
    const keyPair = ec.genKeyPair();
    this.publicKey = keyPair.getPublic().encode("hex");

    this.balance = balance;
  }
}

module.exports = Wallet;
