const { GENESIS_DATA, MINE_RATE } = require("../configs/config");
const cryptographicHash = require("./utils/cryptographicHash");
const hexToBinary = require("hex-to-binary");

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
    const previousBlockHash = lastBlock.hash;
    let hash, timestamp;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = cryptographicHash(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (
      // Using the binary representation of the hash makes the difficulty
      // adjustments more precise and brings the average time of mining a
      // block closer to the set mining rate.
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

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

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    // Without this the difficulty can go negative and crash the app
    if (difficulty < 1) return 1;

    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}

module.exports = Block;
