import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { AccountDisplay } from "./AccountDisplay";

export function AccountSelector({ onSelect = () => {}, accounts = [] }) {
  return (
    <div
      className="client-selector border rounded overflow-auto"
      style={{ maxHeight: "15rem" }}
    >
      <ListGroup variant="flush">
        {accounts.map((account, index) => (
          <OverlayTrigger
            placement="right"
            key={index}
            overlay={
              <Tooltip id="tooltip-client-display">
                <AccountDisplay account={account} className="text-start px-2" />
              </Tooltip>
            }
          >
            <ListGroup.Item action onClick={() => onSelect(account)}>
              <Row>
                <Col xs={5} className="font-weight-bold">
                  {account.name}
                </Col>
                <Col xs={7} className="text-uppercase">
                  {account.idType} {account.idNumber}
                </Col>
              </Row>
            </ListGroup.Item>
          </OverlayTrigger>
        ))}
      </ListGroup>
    </div>
  );
}
