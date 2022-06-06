const Block = require("../block");
const { GENESIS_DATA, MINE_RATE } = require("../../../configs/config");
const { cryptographicHash } = require("../../utils");
const hexToBinary = require("hex-to-binary");

describe("Block", () => {
  const timestamp = 2000;
  const previousBlockHash = "last-hash";
  const data = ["genesis", "2nd block"];
  const hash = "hash";
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    previousBlockHash,
    data,
    hash,
    nonce,
    difficulty,
  });

  it("has a timestamp property", () => {
    expect(block.timestamp).toEqual(timestamp);
  });

  it("has a previousBlockHash property", () => {
    expect(block.previousBlockHash).toEqual(previousBlockHash);
  });

  it("has a data property", () => {
    expect(block.data).toEqual(data);
  });

  it("has a hash property", () => {
    expect(block.hash).toEqual(hash);
  });

  it("has a nonce property", () => {
    expect(block.nonce).toEqual(nonce);
  });

  it("has a difficulty property", () => {
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets the previousBlockHash to be the hash of lastBlock", () => {
      expect(minedBlock.previousBlockHash).toEqual(lastBlock.hash);
    });

    it("stores the data", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("stores a timestamp", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("sets hash to a SHA-256 hash of its timestamp, data and last block's hash", () => {
      expect(minedBlock.hash).toEqual(
        cryptographicHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("has a hash meeting the difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });

    it("adjusts the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("increases the difficulty if a block is mined quickly", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("decreases difficulty if a block is mined slowly", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1", () => {
      block.difficulty = -1;

      expect(
        Block.adjustDifficulty({ originalBlock: block, timestamp })
      ).toEqual(1);
    });
  });
});
