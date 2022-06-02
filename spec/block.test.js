const Block = require("../src/block");
const { GENESIS_DATA } = require("../src/utils/config");
const cryptographicHash = require("../src/utils/cryptographicHash");

describe("Block", () => {
  const timestamp = "aTimestamp";
  const previousBlockHash = "last-hash";
  const data = ["genesis", "2nd block"];
  const hash = "hash";
  const block = new Block({ timestamp, previousBlockHash, data, hash });

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
        cryptographicHash(minedBlock.timestamp, lastBlock.hash, data)
      );
    });
  });
});
