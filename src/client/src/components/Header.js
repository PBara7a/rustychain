import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import chain from "../assets/chain.png";

const Header = () => {
  const [selected, setSelected] = useState("home");

  return (
    <Navbar fixed="top" variant="dark" bg="dark">
      <Container>
        <Navbar.Brand>
          <img src={chain} alt="logo" className="logo" />
        </Navbar.Brand>
        <Nav
          activeKey={selected}
          onSelect={(selectedLink) => setSelected(selectedLink)}
        >
          <Nav.Link as={Link} to="/" eventKey="home">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/blocks" eventKey="blocks">
            Blocks
          </Nav.Link>
          <Nav.Link as={Link} to="/conduct-transaction" eventKey="transact">
            Transact
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/transaction-pool"
            eventKey="transaction-pool"
          >
            Transaction-Pool
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
