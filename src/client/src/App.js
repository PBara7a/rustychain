import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import "./index.css";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/conduct-transaction" element={<ConductTransaction />} />
        <Route path="/transaction-pool" element={<TransactionPool />} />
      </Routes>
    </div>
  );
};

export default App;
