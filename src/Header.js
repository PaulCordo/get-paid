import React, { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { FaUserAlt, FaMoneyBillWave, FaPowerOff } from "react-icons/fa";

import { SessionContext } from "./SessionContext";

export function Header({ onBrandClick = () => {} }) {
  const { user, close } = useContext(SessionContext);
  return (
    <Navbar as="header" bg="dark" variant="dark" className="d-print-none">
      <Navbar.Brand onClick={onBrandClick} className="mr-auto" role="button">
        Get <FaMoneyBillWave className="text-success" /> Paid
      </Navbar.Brand>
      <Dropdown>
        <Dropdown.Toggle
          id="user-menu"
          variant="link"
          className="text-white text-decoration-none"
        >
          <>
            <FaUserAlt className="mr-1 mb-1" /> {user.name}
          </>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={close}>
            Log out <FaPowerOff className="ml-1 mb-1" />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  );
}
