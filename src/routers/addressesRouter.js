const express = require("express");
const router = express.Router();
const addressesController = require("../controllers/addressesController");

router.get("/", addressesController.knownAddresses);

module.exports = router;
