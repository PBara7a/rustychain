const express = require("express");
const router = express.Router();
const blockchainController = require("../controller/blockchainController");

router.get("/", blockchainController.getChain);

router.post("/mine", blockchainController.addBlock);

module.exports = router;
