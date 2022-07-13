import React, { useEffect, useState } from "react";
import client from "../utils/client";
import { Card } from "react-bootstrap";

const WalletInfo = () => {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    client
      .get("/wallet")
      .then((res) => setWalletInfo(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Card className="WalletInfo">
      <Card.Body>
        <Card.Title>My Wallet</Card.Title>
        <hr />
        <Card.Subtitle className="mb-2 text-muted">Address:</Card.Subtitle>
        <Card.Text>{walletInfo.address}</Card.Text>
        <Card.Subtitle className="mb-2 text-muted">Balance:</Card.Subtitle>
        <Card.Text>{walletInfo.balance}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default WalletInfo;
