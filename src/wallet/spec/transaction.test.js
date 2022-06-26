const Wallet = require("..");
const { verifySignature } = require("../../utils");
const Transaction = require("../transaction");
const { REWARD_INPUT, MINING_REWARD } = require("../../../configs/config");

describe("Transaction", () => {
  let transaction, senderWallet, recipientKey, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipientKey = "0xRecipientPublicKey";
    amount = 100;

    transaction = new Transaction({ senderWallet, recipientKey, amount });
  });

  it("has an id", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has an outputMap", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipientKey]).toEqual(amount);
    });

    it("outputs the remaining balance to the sender wallet", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has an input", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has a timestamp in the input", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("sets the amount to the senderWallet balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the address to the senderWallet public key", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signs the input", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("isValidTransaction()", () => {
    let erroMock;

    beforeEach(() => {
      erroMock = jest.fn();

      global.console.error = erroMock;
    });

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.isValidTransaction(transaction)).toBe(true);
      });
    });
    describe("when the transaction is invalid", () => {
      describe("and a transaction outputMap is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[senderWallet.publicKey] = 123456; // wrong amount

          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(erroMock).toHaveBeenCalled();
        });
      });
      describe("and a transaction input signature is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("data");

          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(erroMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", () => {
    let originalSignature, originalSenderOutput, nextRecipientKey, nextAmount;

    describe("and the amount is invalid", () => {
      it("throws an error", () => {
        expect(() => {
          transaction.update({
            senderWallet,
            recipientKey,
            amount: 999999,
          });
        }).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount is valid", () => {
      beforeEach(() => {
        originalSignature = transaction.input.signature;
        originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
        nextRecipientKey = "fooNExtRecipientKey";
        nextAmount = 20;

        transaction.update({
          senderWallet,
          recipientKey: nextRecipientKey,
          amount: nextAmount,
        });
      });

      it("outputs the amount to the next recipient", () => {
        expect(transaction.outputMap[nextRecipientKey]).toEqual(nextAmount);
      });

      it("subtracts the amount from the original sender output amount", () => {
        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
          originalSenderOutput - nextAmount
        );
      });

      it("maintains a total output that matches the input amount", () => {
        expect(
          Object.values(transaction.outputMap).reduce(
            (total, outputAmount) => total + outputAmount
          )
        ).toEqual(transaction.input.amount);
      });

      it("resigns the transaction", () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });

      describe("and another update for the same recipient", () => {
        let addedAmount;

        beforeEach(() => {
          addedAmount = 35;
          transaction.update({
            senderWallet,
            recipientKey: nextRecipientKey,
            amount: addedAmount,
          });
        });

        it("adds to the recipient amount", () => {
          expect(transaction.outputMap[nextRecipientKey]).toEqual(
            nextAmount + addedAmount
          );
        });

        it("should subtract from the original sender output amount", () => {
          expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          );
        });
      });
    });
  });

  describe("rewardTransaction()", () => {
    let rewardTransaction, minerWallet;

    beforeEach(() => {
      minerWallet = new Wallet();
      rewardTransaction = Transaction.rewardTransaction({ minerWallet });
    });

    it("creates a transaction with the reward input", () => {
      expect(rewardTransaction.input).toEqual(REWARD_INPUT);
    });

    it("creates one transaction for the miner with the MINING_REWARD", () => {
      expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(
        MINING_REWARD
      );
    });
  });
});
