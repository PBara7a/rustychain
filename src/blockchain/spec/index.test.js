const Blockchain = require("../index");
const Block = require("../block");
const { cryptographicHash } = require("../../utils");
const Wallet = require("../../wallet");
const Transaction = require("../../wallet/transaction");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain, errorMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;

    // Stop printing in the terminal,
    // need to create new tests to make sure the mocks
    // were called
    errorMock = jest.fn();

    global.console.error = errorMock;
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
    describe("When the new chain is not longer", () => {
      beforeEach(() => {
        // To make newChain different from blockchain
        newChain.chain[0] = { data: "Different block" };

        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("When the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "foo" });
        newChain.addBlock({ data: "bar" });
        newChain.addBlock({ data: "baz" });
      });

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "Tampered hash";

          blockchain.replaceChain(newChain.chain);
        });

        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });

    describe("and the validateTransactions flag is true", () => {
      it("calls validTransactionData()", () => {
        const validTransactionDataMock = jest.fn();

        blockchain.validTransactionData = validTransactionDataMock;

        newChain.addBlock({ data: ["foo"] });
        blockchain.replaceChain(newChain.chain, true);

        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  describe("validTransactionData()", () => {
    let transaction, rewardTransaction, wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipientKey: "foo-recipient",
        amount: 50,
      });
      rewardTransaction = Transaction.rewardTransaction({
        minerWallet: wallet,
      });
    });

    describe("and the transaction data is valid", () => {
      it("returns true", () => {
        newChain.addBlock({ data: [transaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          true
        );

        expect(errorMock).not.toHaveBeenCalled();
      });
    });

    describe("and the transaction data has multiple rewards", () => {
      it("returns false and logs an error", () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction, rewardTransaction],
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );

        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("and the transaction data has at least one malformed outputMap", () => {
      describe("and the transaction is not a reward transaction", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({
            data: [transaction, rewardTransaction],
          });

          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);

          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the transaction is a reward transaction", () => {
        it("returns false and logs an error", () => {
          rewardTransaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] });

          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);

          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe("and the transaction data has at least one malformed input", () => {
      it("returns false and logs an error", () => {
        wallet.balance = 9000;

        const evilOutputMap = {
          [wallet.publicKey]: 8900,
          fooRecipientKey: 100,
        };

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap),
          },
          outputMap: evilOutputMap,
        };

        newChain.addBlock({ data: [evilTransaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );

        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("and a block contains multiple identical transactions", () => {
      it("returns false and logs an error", () => {
        newChain.addBlock({
          data: [transaction, transaction, transaction, rewardTransaction],
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );

        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
