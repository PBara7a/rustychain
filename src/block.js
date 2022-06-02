const { GENESIS_DATA } = require("./utils/config");
const cryptographicHash = require("./utils/cryptographicHash");

class Block {
  constructor({ timestamp, previousBlockHash, data, hash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.previousBlockHash = previousBlockHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    const genesisBlock = new Block(GENESIS_DATA);
    return genesisBlock;
  }

  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const previousBlockHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptographicHash(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    const minedBlock = new Block({
      timestamp,
      previousBlockHash,
      data,
      nonce,
      difficulty,
      hash,
    });

    return minedBlock;
  }
}

module.exports = Block;
