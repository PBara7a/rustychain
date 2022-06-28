const express = require("express");
const router = express.Router();
const blockchainController = require("../controller/blockchainController");

router.get("/", blockchainController.getChain);
router.get("/transaction-pool", blockchainController.getTransactionPool);
router.get("/mine-transactions", blockchainController.mineTransactions);
router.get("/wallet-info", blockchainController.walletInfo);

router.post("/mine", blockchainController.addBlock);
router.post("/transact", blockchainController.addTransactionToPool);

module.exports = router;
