import React, { useEffect, useState } from "react";
import client from "../utils/client";
import Transaction from "./Transaction";
import { Button } from "react-bootstrap";

const refreshTransactionPoolIntervalTime = 5000;

const TransactionPool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  useEffect(() => {
    client
      .get("/transactions/pool")
      .then((res) => setTransactionPoolMap(res.data))
      .catch((err) => console.error(err));

    const refreshInterval = setInterval(() => {
      client
        .get("/transactions/pool")
        .then((res) => setTransactionPoolMap(res.data))
        .catch((err) => console.error(err));
    }, refreshTransactionPoolIntervalTime);

    return () => clearInterval(refreshInterval);
  }, []);

  const mineTransactions = () => {
    client
      .get("/transactions/mine")
      .then(() => alert("Success!"))
      .catch((err) => console.error(err));
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
