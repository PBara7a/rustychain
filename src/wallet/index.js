// https://github.com/indutny/elliptic
const { ec } = require("../utils/ellipticCurve");
const cryptographicHash = require("../utils/cryptographicHash");

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
}

module.exports = Wallet;