const Block = require("../src/block");

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
});
