import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import chain from "../assets/chain.png";

const Header = () => {
  const [selected, setSelected] = useState("home");

  return (
    <Navbar
      fixed="top"
      variant="dark"
      bg="dark"
      expand="lg"
      collapseOnSelect={true}
    >
      <Container>
        <Navbar.Brand>
          <img src={chain} alt="logo" className="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto"
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
