import React from "react";
import { useEffect, useState } from "react";
import client from "../utils/client";
import Block from "./Block";

const Blocks = () => {
  const [blocksData, setBlocksData] = useState(null);

  useEffect(() => {
    client
      .get("/api/chain")
      .then((res) => setBlocksData(res.data.chain))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <br />
      <h3>Blocks</h3>
      {blocksData &&
        blocksData.map((block) => <Block key={block.hash} {...block} />)}
    </>
  );
};

export default Blocks;
