const express = require("express");

const app = express();

app.use(express.json());

const blockchainRouter = require("./router/blockchainRouter");

app.use("/", blockchainRouter);

module.exports = app;
