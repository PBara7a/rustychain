const Wallet = require("../index");
const { verifySignature } = require("../../utils");
const Transaction = require("../transaction");
const Blockchain = require("../../blockchain");
const { STARTING_BALANCE } = require("../../../configs/config");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a balance", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a public key", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "Some data";

    it("verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it("does not verify an invalid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe("and the amount exceeds the balance", () => {
      it("throws an error", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 999999,
            recipient: "foo-recipient",
          })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount is valid", () => {
      let transaction, amount, recipientKey;

      beforeEach(() => {
        amount = 50;
        recipientKey = "foo-recipient";
        transaction = wallet.createTransaction({ amount, recipientKey });
      });

      it("creates an instance of Transaction", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("matches the transaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("outputs the amount to the recipientKey", () => {
        expect(transaction.outputMap[recipientKey]).toEqual(amount);
      });
    });

    describe("and a chain is passed", () => {
      it("calls Wallet.calculateBalance", () => {
        const calculateBalanceMock = jest.fn();

        const originalCalculateBalance = Wallet.calculateBalance;

        Wallet.calculateBalance = calculateBalanceMock;

        wallet.createTransaction({
          recipientKey: "foo-recipient",
          amount: 20,
          chain: new Blockchain().chain,
        });

        expect(calculateBalanceMock).toHaveBeenCalled();

        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe("calculateBalance()", () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe("and there are no outputs for the walet", () => {
      it("returns the startting balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(STARTING_BALANCE);
      });
    });

    describe("and there are outputs for the wallet", () => {
      let transactionOne, transactionTwo;

      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({
          recipientKey: wallet.publicKey,
          amount: 50,
        });

        transactionTwo = new Wallet().createTransaction({
          recipientKey: wallet.publicKey,
          amount: 100,
        });

        blockchain.addBlock({ data: [transactionOne, transactionTwo] });
      });

      it("adds the sum of all outputs to the wallet balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          STARTING_BALANCE +
            transactionOne.outputMap[wallet.publicKey] +
            transactionTwo.outputMap[wallet.publicKey]
        );
      });

      describe("and the wallet has made a transaction", () => {
        let recentTransaction;

        beforeEach(() => {
          recentTransaction = wallet.createTransaction({
            recipientKey: "foo-recipient",
            amount: 15,
          });

          blockchain.addBlock({ data: [recentTransaction] });
        });

        it("returns the output amount of the recent transaction", () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
        });

        describe("and there are outputs next to and after the recent transaction", () => {
          let sameBlockTransaction, nextBlockTransaction;

          beforeEach(() => {
            recentTransaction = wallet.createTransaction({
              recipientKey: "laterFooRecipient",
              amount: 50,
            });

            sameBlockTransaction = Transaction.rewardTransaction({
              minerWallet: wallet,
            });

            blockchain.addBlock({
              data: [recentTransaction, sameBlockTransaction],
            });

            nextBlockTransaction = new Wallet().createTransaction({
              recipientKey: wallet.publicKey,
              amount: 60,
            });

            blockchain.addBlock({ data: [nextBlockTransaction] });
          });

          it("includes the output amount in the returned balance", () => {
            expect(
              Wallet.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey,
              })
            ).toEqual(
              recentTransaction.outputMap[wallet.publicKey] +
                sameBlockTransaction.outputMap[wallet.publicKey] +
                nextBlockTransaction.outputMap[wallet.publicKey]
            );
          });
        });
      });
    });
  });
});
