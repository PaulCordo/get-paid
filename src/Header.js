import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUserAlt, FaMoneyBillWave, FaPowerOff, FaCog } from "react-icons/fa";

import { SessionContext } from "./SessionContext";

export function Header({ setActiveTab = () => {}, activeTab }) {
  const { user, close } = useContext(SessionContext);
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      as="header"
      bg="dark"
      variant="dark"
      className="d-print-none sticky-top w-100"
    >
      <Container fluid>
        <Navbar.Brand
          onClick={() => setActiveTab("documents")}
          role="button"
          className="ps-2"
        >
          Get <FaMoneyBillWave className="text-success" /> Paid
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link
              key="documents"
              role="button"
              onClick={() => setActiveTab("documents")}
              className={activeTab === "documents" && "text-white"}
            >
              Documents
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown
              id="user-menu"
              align="end"
              title={
                <>
                  <FaUserAlt className="me-1 mb-1" /> {user.name}
                </>
              }
              menuVariant="dark"
              role="button"
            >
              <NavDropdown.Item
                onClick={() => setActiveTab("configuration")}
                className={activeTab === "configuration" && "text-white"}
              >
                <FaCog className="me-1 mb-1" /> Configuration
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={close}>
                <FaPowerOff className="me-1 mb-1" /> Se déconnecter
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
