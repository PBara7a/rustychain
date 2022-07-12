import React, { useEffect, useState } from "react";
import client from "../utils/client";
import Transaction from "./Transaction";
import { Button } from "react-bootstrap";

const refreshTransactionPoolIntervalTime = 5000;

const TransactionPool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  useEffect(() => {
    client
      .get("/api/transaction-pool")
      .then((res) => setTransactionPoolMap(res.data))
      .catch((err) => console.error(err));

    const refreshInterval = setInterval(() => {
      client
        .get("/api/transaction-pool")
        .then((res) => setTransactionPoolMap(res.data))
        .catch((err) => console.error(err));
    }, refreshTransactionPoolIntervalTime);

    return () => clearInterval(refreshInterval);
  }, []);

  const mineTransactions = () => {
    client.get("/api/mine-transactions").then((res) => {
      if (res.status === 200) {
        alert("Success!");
      }
    });
  };

  return (
    <div className="ConductTransaction">
      <br />
      <h3>Transaction Pool</h3>
      <br />
      <Button variant="danger" size="sm" onClick={mineTransactions}>
        Mine Transactions
      </Button>
      <ul>
        {Object.values(transactionPoolMap).map((transaction) => (
          <li key={transaction.id}>
            <hr />
            <Transaction transaction={transaction} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionPool;
