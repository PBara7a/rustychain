const express = require("express");
const router = express.Router();
const blockchainController = require("../controller/blockchainController");
const path = require("path");

router.get("/api/chain", blockchainController.chain);
router.get("/api/chain/length", blockchainController.chainLength);
router.get("/api/chain/:page", blockchainController.chainOnPage);
router.get("/api/transaction-pool", blockchainController.getTransactionPool);
router.get("/api/mine-transactions", blockchainController.mineTransactions);
router.get("/api/wallet-info", blockchainController.walletInfo);
router.get("/api/known-addresses", blockchainController.knownAddresses);

router.post("/api/mine", blockchainController.addBlock);
router.post("/api/transact", blockchainController.addTransactionToPool);

router.get("*", blockchainController.serveFrontEnd);

module.exports = router;
