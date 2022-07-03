const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const blockchainRouter = require("./router/blockchainRouter");

app.use("/", blockchainRouter);

module.exports = app;
