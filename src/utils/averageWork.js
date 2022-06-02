// This script is used to monitor average time of mining
// and current difficulty

const Blockchain = require("../blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({ data: "start" });

let prevTimestamp, nextTimestamp, nextBlock, timeDifference, average;

const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({ data: `Block ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  timeDifference = nextTimestamp - prevTimestamp;
  times.push(timeDifference);

  average = times.reduce((acc, cur) => acc + cur) / times.length;

  console.log(
    `Time to mine block: ${String(timeDifference).padStart(
      4,
      " "
    )}ms. Difficulty: ${String(nextBlock.difficulty).padStart(
      2,
      " "
    )}. Average time: ${average}ms.`
  );
}
