const Blockchain = require("../index");
const Block = require("../block");
const cryptographicHash = require("../../utils/cryptographicHash");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
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

  describe("isValidChain()", () => {
    beforeEach(() => {
      blockchain.addBlock({ data: "foo" });
      blockchain.addBlock({ data: "bar" });
      blockchain.addBlock({ data: "baz" });
    });

    describe("When the first block is not the genesis", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "foo" };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the previousBlockHash has changed", () => {
      it("returns false", () => {
        blockchain.chain[2].previousBlockHash = "tampered hash";

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When there is a block with an invalid field", () => {
      it("returns false", () => {
        blockchain.chain[2].data = "tampered data";

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When there is a block with a jumped difficulty", () => {
      it("returns false", () => {
        const lastBlock = blockchain.chain[blockchain.chain.length - 1];
        const lastBLockHash = lastBlock.hash;
        const timestamp = Date.now();
        const nonce = 0;
        const data = {};
        const difficulty = lastBlock.difficulty - 3;
        const hash = cryptographicHash(
          timestamp,
          lastBLockHash,
          data,
          nonce,
          difficulty
        );
        const invalidBlock = new Block({
          timestamp,
          lastBLockHash,
          data,
          hash,
          nonce,
          difficulty,
        });

        blockchain.chain.push(invalidBlock);
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When all blocks in the chain are valid", () => {
      it("returns true", () => {
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
      });
    });
  });

  describe("replaceChain()", () => {
    describe("When the new chain is shorter", () => {
      it("does not replace the chain", () => {
        // To make newChain different from blockchain
        newChain.chain[0] = { data: "Different block" };

        blockchain.replaceChain(newChain.chain);

        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe("When the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "foo" });
        newChain.addBlock({ data: "bar" });
        newChain.addBlock({ data: "baz" });
      });

      describe("and the chain is invalid", () => {
        it("does not replace the chain", () => {
          newChain.chain[2].hash = "Tampered hash";

          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe("and the chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
