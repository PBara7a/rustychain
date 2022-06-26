const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
  timestamp: "02/06/2022",
  previousBlockHash: "*****",
  data: ["Big Bang"],
  hash: "hash",
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY,
};

const REWARD_INPUT = { address: "authorized-reward" };

const MINING_REWARD = 5;

module.exports = { GENESIS_DATA, MINE_RATE, REWARD_INPUT, MINING_REWARD };
