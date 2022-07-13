import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const Transaction = ({ transaction: { input, outputMap } }) => {
  let recipients;
  if (outputMap) {
    recipients = Object.keys(outputMap);
  }

  return (
    <Card className="Transaction">
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">From:</Card.Subtitle>
        <Card.Text>
          {console.log(input.address.length)}
          {`${input.address.substring(0, 10)}...${input.address.substring(
            120
          )}`}{" "}
          | Balance: {input.amount}
        </Card.Text>

        <hr />
        <Card.Subtitle className="mb-2 text-muted">To:</Card.Subtitle>
        <ListGroup variant="flush">
          {recipients.map((recipient) => (
            <ListGroup.Item key={recipient} className="TransactionItem">
              {`${recipient.substring(0, 10)}...${recipient.substring(120)}`} |
              Sent: {outputMap[recipient]}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Transaction;
