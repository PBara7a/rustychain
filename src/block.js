const { GENESIS_DATA } = require("./utils/config");
const cryptographicHash = require("./utils/cryptographicHash");

class Block {
  constructor({ timestamp, previousBlockHash, data, hash }) {
    this.timestamp = timestamp;
    this.previousBlockHash = previousBlockHash;
    this.data = data;
    this.hash = hash;
  }

  static genesis() {
    const genesisBlock = new Block(GENESIS_DATA);
    return genesisBlock;
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const previousBlockHash = lastBlock.hash;

    const minedBlock = new Block({
      timestamp,
      previousBlockHash,
      data,
      hash: cryptographicHash(timestamp, previousBlockHash, data),
    });

    return minedBlock;
  }
}

module.exports = Block;
