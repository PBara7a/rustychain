const express = require("express");
// const morgan = require("morgan");

const app = express();

// app.use(morgan("dev"));
app.use(express.json());

const blockchainRouter = require("./router/blockchainRouter");

app.use("/blockchain", blockchainRouter);

module.exports = app;
