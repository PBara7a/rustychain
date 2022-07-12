import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
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
        <hr />
        <Card.Subtitle className="mb-2 text-muted">Data:</Card.Subtitle>

        <div>{dataDisplay}</div>
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
    <Card className="Block">
      <Card.Body>
        <Card.Title>Hash</Card.Title>
        <Card.Text>{hashDisplay}</Card.Text>
        <hr />

        <Card.Subtitle className="mb-2 text-muted">Timestamp:</Card.Subtitle>
        <Card.Text>{new Date(timestamp).toLocaleString()}</Card.Text>

        <Card.Text>{getDisplayTransaction()}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Block;
