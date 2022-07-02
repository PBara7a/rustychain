const app = require("./server");
const request = require("request");
const {
  blockchain,
  transactionPool,
} = require("./controller/blockchainController");
const TransactionPool = require("./wallet/transactionPool");

const DEFAULT_PORT = 3030;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/chain` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body).chain;

      console.log("Replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool` },
    (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const rootTransactionPool = JSON.parse(body);

        console.log(
          "replace transaction pool map on a sync with",
          rootTransactionPool
        );
        transactionPool.setMap(rootTransactionPool);
      }
    }
  );
};

let peer_port;

if (process.env.GENERATE_PEER_PORT === "true") {
  peer_port = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const port = peer_port || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`[SERVER] Running on http://localhost:${port}/`);

  syncChains();
});
