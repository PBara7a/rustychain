import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import client from "../utils/client";
import Block from "./Block";

const Blocks = () => {
  const [blocksData, setBlocksData] = useState(null);
  const [page, setPage] = useState(1);
  const [chainLength, setChainLength] = useState(0);

  useEffect(() => {
    client
      .get("/chain/length")
      .then((res) => setChainLength(res.data))
      .catch((err) => console.error(err));
  });

  useEffect(() => {
    client
      .get(`/chain/${page}`)
      .then((res) => setBlocksData(res.data))
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <>
      <br />
      <h3>Blocks</h3>

      <div className="page-btns-container">
        <span className="spacer"></span>
        <ButtonGroup size="sm">
          {[...Array(Math.ceil(chainLength / 5)).keys()].map((key) => {
            const pageNr = key + 1;
            return (
              <Button
                className="page-btn"
                key={key}
                onClick={() => setPage(pageNr)}
              >
                {pageNr}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>

      {blocksData &&
        blocksData.map((block) => <Block key={block.hash} {...block} />)}
    </>
  );
};

export default Blocks;
