const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));
app.use(cors());

const blockchainRouter = require("./router/blockchainRouter");

app.use("/", blockchainRouter);

module.exports = app;
