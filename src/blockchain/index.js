const Block = require("./block");
const { cryptographicHash } = require("../utils");
const { REWARD_INPUT, MINING_REWARD } = require("../../configs/config");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock({ lastBlock, data });

    this.chain.push(newBlock);
  }

  replaceChain(chain, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (onSuccess) {
      onSuccess();
    }

    this.chain = chain;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (const transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceed limit");
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.isValidTransaction(transaction)) {
            console.error("Invalid transaction");
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });

          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }

  static isValidChain(chain) {
    // compared the string version of the object instead of references
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      // console.error("Bad genesis");
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, previousBlockHash, data, hash, nonce, difficulty } =
        chain[i];

      const actualPreviousBlockHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      const validHash = cryptographicHash(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );

      if (previousBlockHash !== actualPreviousBlockHash) return false;

      if (hash !== validHash) return false;

      //Makes sure the difficulty does not jump more than 1, up or down
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }
}

module.exports = Blockchain;
