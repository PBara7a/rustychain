const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

router.get("/", walletController.walletInfo);

module.exports = router;
