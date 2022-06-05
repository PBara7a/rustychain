const Wallet = require("..");
const { verifySignature } = require("../../utils/ellipticCurve");
const Transaction = require("../transaction");

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
});
