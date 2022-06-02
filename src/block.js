const { GENESIS_DATA } = require("./config");

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
}

module.exports = Block;
