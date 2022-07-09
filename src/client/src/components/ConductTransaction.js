import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import client from "../utils/client";

const ConductTransaction = () => {
  const [transactionData, setTransactionData] = useState({
    recipient: "",
    amount: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...transactionData };

    if (name === "amount") {
      updatedData[name] = Number(value);
    } else {
      updatedData[name] = value;
    }

    setTransactionData(updatedData);
  };

  const conductTransaction = () => {
    const data = {
      recipientKey: transactionData.recipient,
      amount: transactionData.amount,
    };

    client
      .post("/api/transact", data)
      .then(() => navigate("/transaction-pool"))
      .catch((err) => alert(err.message));
  };

  return (
    <div className="ConductTransaction">
      <br />
      <h3>Conduct Transaction</h3>
      <br />
      <FormGroup style={{ marginBottom: "0.5rem" }}>
        <FormControl
          input="text"
          placeholder="recipient"
          name="recipient"
          value={transactionData.recipient}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <FormControl
          input="number"
          placeholder="amount"
          name="amount"
          value={transactionData.amount}
          onChange={handleChange}
        />
      </FormGroup>
      <Button variant="danger" size="sm" onClick={conductTransaction}>
        Submit
      </Button>
    </div>
  );
};

export default ConductTransaction;
