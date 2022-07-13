const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");

router.get("/pool", transactionsController.getTransactionPool);
router.get("/mine", transactionsController.mineTransactions);

router.post("/transact", transactionsController.transact);

module.exports = router;
