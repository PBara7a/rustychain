const express = require("express");
const router = express.Router();
const blocksController = require("../controllers/blocksController");

router.post("/mine", blocksController.addBlock);

module.exports = router;
