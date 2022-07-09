import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import chain from "../assets/chain.png";

const Header = () => {
  return (
    <Navbar fixed="top" variant="dark" bg="dark">
      <Container>
        <Navbar.Brand>
          <img src={chain} alt="logo" className="logo" />
        </Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/blocks">
            Blocks
          </Nav.Link>
          <Nav.Link as={Link} to="/conduct-transaction">
            Conduct a Transaction
          </Nav.Link>
          <Nav.Link as={Link} to="/transaction-pool">
            Transaction Pool
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
