const Block = require("./block");
const cryptographicHash = require("./utils/cryptographicHash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock({ lastBlock, data });

    this.chain.push(newBlock);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;
    if (!Blockchain.isValidChain(chain)) return;

    this.chain = chain;
  }

  static isValidChain(chain) {
    // compared the string version of the object instead of references
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, previousBlockHash, data, hash } = chain[i];
      const actualPreviousBlockHash = chain[i - 1].hash;
      const validHash = cryptographicHash(timestamp, previousBlockHash, data);

      if (previousBlockHash !== actualPreviousBlockHash) return false;
      if (hash !== validHash) return false;
    }

    return true;
  }
}

module.exports = Blockchain;
