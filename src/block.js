class Block {
  constructor({ timestamp, previousBlockHash, data, hash }) {
    this.timestamp = timestamp;
    this.previousBlockHash = previousBlockHash;
    this.data = data;
    this.hash = hash;
  }
}

module.exports = Block;
