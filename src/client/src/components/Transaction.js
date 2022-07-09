import React from "react";

const Transaction = ({ transaction: { input, outputMap } }) => {
  let recipients;
  if (outputMap) {
    recipients = Object.keys(outputMap);
  }

  return (
    <div className="Transaction">
      <div>
        From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}
      </div>

      {recipients.map((recipient) => (
        <div key={recipient}>
          To: {`${recipient.substring(0, 20)}...`} | Sent:{" "}
          {outputMap[recipient]}
        </div>
      ))}
    </div>
  );
};

export default Transaction;
