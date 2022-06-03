const app = require("./server");

const DEFAULT_PORT = 3030;
let peer_port;

if (process.env.GENERATE_PEER_PORT === "true") {
  peer_port = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const port = peer_port || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`[SERVER] Running on http://localhost:${port}/`);
});
