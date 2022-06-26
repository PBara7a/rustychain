// https://github.com/indutny/elliptic
const { ec, cryptographicHash } = require("../utils");
const Transaction = require("./transaction");
const { STARTING_BALANCE } = require("../../configs/config");

class Wallet {
  // default for testing/development purposes
  constructor(balance = STARTING_BALANCE) {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");

    this.balance = balance;
  }

  sign(data) {
    const hashedData = cryptographicHash(data);
    return this.keyPair.sign(hashedData);
  }

  createTransaction({ amount, recipientKey, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipientKey, amount });
  }

  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (const transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal += addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction
      ? outputsTotal
      : STARTING_BALANCE + outputsTotal;
  }
}

module.exports = Wallet;
