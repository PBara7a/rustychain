const Blockchain = require("../src/blockchain");
const Block = require("../src/block");

describe("Blockchain", () => {
  const blockchain = new Blockchain();

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
});
