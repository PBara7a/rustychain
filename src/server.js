const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));
app.use(cors());

const chainRouter = require("./routers/chainRouter");
const transactionsRouter = require("./routers/transactionsRouter");
const blocksRouter = require("./routers/blocksRouter");
const addressesRouter = require("./routers/addressesRouter");
const walletRouter = require("./routers/walletRouter");
const frontEndRouter = require("./routers/frontEndRouter");

app.use("/chain", chainRouter);
app.use("/transactions", transactionsRouter);
app.use("/blocks", blocksRouter);
app.use("/addresses", addressesRouter);
app.use("/wallet", walletRouter);
app.use("/", frontEndRouter);

module.exports = app;
