const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
  timestamp: "02/06/2022",
  previousBlockHash: "*****",
  data: ["Big Bang"],
  hash: "hash",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
};

module.exports = { GENESIS_DATA, MINE_RATE };
