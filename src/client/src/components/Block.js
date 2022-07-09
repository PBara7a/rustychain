import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

const Block = ({ timestamp, hash, data }) => {
  const [displayTransaction, setDisplayTransaction] = useState(false);

  const toggleDisplayTransaction = () => {
    setDisplayTransaction(!displayTransaction);
  };

  const getDisplayTransaction = () => {
    const stringifiedData = JSON.stringify(data);

    const dataDisplay =
      stringifiedData.length > 35
        ? `${stringifiedData.substring(0, 35)}...`
        : stringifiedData;

    if (displayTransaction) {
      return (
        <div>
          {data.map((transaction) => (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button variant="danger" size="sm" onClick={toggleDisplayTransaction}>
            Show Less
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Data: {dataDisplay}</div>
        {hash !== "hash" && (
          <Button variant="danger" size="sm" onClick={toggleDisplayTransaction}>
            Show More
          </Button>
        )}
      </div>
    );
  };

  const hashDisplay = `${hash.substring(0, 15)}...`;

  return (
    <div className="Block">
      <div>Hash: {hashDisplay}</div>
      <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
      {getDisplayTransaction()}
    </div>
  );
};

export default Block;
