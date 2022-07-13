const express = require("express");
const router = express.Router();
const chainController = require("../controllers/chainController");

router.get("/", chainController.chain);
router.get("/length", chainController.chainLength);
router.get("/:page", chainController.chainPage);

module.exports = router;
