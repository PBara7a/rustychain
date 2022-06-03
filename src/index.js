const app = require("./server");
const request = require("request");
const { blockchain } = require("./controller/blockchainController");

const DEFAULT_PORT = 3030;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/blockchain/` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body).chain;

      console.log("Replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
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
