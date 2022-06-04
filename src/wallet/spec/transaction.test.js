const Wallet = require("..");
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
});
