const Block = require("../src/block");
const { GENESIS_DATA } = require("../src/config");

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
    console.log("Genesis :", genesisBlock);

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
});
