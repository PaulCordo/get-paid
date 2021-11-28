import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import { FaUserAlt, FaMoneyBillWave, FaPowerOff } from "react-icons/fa";

import { SessionContext } from "./SessionContext";

export function Header({ onBrandClick = () => {} }) {
  const { user, close } = useContext(SessionContext);
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      as="header"
      bg="dark"
      variant="dark"
      className="d-print-none"
    >
      <Container fluid>
        <Navbar.Brand onClick={onBrandClick} role="button" className="ps-2">
          Get <FaMoneyBillWave className="text-success" /> Paid
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              id="user-menu"
              variant="link"
              className="text-white text-decoration-none"
            >
              <>
                <FaUserAlt className="me-1 mb-1" /> {user.name}
              </>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={close}>
                Log out <FaPowerOff className="ms-1 mb-1" />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
