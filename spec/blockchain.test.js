const Blockchain = require("../src/blockchain");
const Block = require("../src/block");

describe("Blockchain", () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it("has a chain array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("has a genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "Some data";
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain", () => {
    beforeEach(() => {
      blockchain.addBlock({ data: "foo" });
      blockchain.addBlock({ data: "bar" });
      blockchain.addBlock({ data: "baz" });
    });

    it("returns false when the genesis block is missing", () => {
      blockchain.chain[0] = { data: "foo" };

      expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
    });

    it("returns false when a previousBlockHash has changed", () => {
      blockchain.chain[2].previousBlockHash = "tampered hash";

      expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
    });

    it("returns false when there is a block with an invalid field", () => {
      blockchain.chain[2].data = "tampered data";

      expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
    });

    it("returns true when all blocks are valid", () => {
      expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
    });
  });
});
