const express = require("express");
const router = express.Router();
const blockchainController = require("../controller/blockchainController");

router.get("/", blockchainController.getChain);

router.post("/mine", blockchainController.addBlock);
router.post("/transact", blockchainController.addTransactionToPool);

module.exports = router;
