import React from "react";
import { useEffect, useState } from "react";
import client from "../utils/client";

const WalletInfo = () => {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    client
      .get("/api/wallet-info")
      .then((res) => setWalletInfo(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="WalletInfo">
      <div>Address: {walletInfo.address}</div>
      <div>Balance: {walletInfo.balance}</div>
    </div>
  );
};

export default WalletInfo;
