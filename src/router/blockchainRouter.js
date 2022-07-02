const express = require("express");
const router = express.Router();
const blockchainController = require("../controller/blockchainController");

router.get("/api/chain", blockchainController.chain);
router.get("/api/transaction-pool", blockchainController.getTransactionPool);
router.get("/api/mine-transactions", blockchainController.mineTransactions);
router.get("/api/wallet-info", blockchainController.walletInfo);

router.post("/api/mine", blockchainController.addBlock);
router.post("/api/transact", blockchainController.addTransactionToPool);

router.get("*", blockchainController.page)

module.exports = router;
