import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaPlus } from "react-icons/fa";

import { DocumentActionsContext } from "./DocumentActionsContext";
import { DocumentTable } from "./DocumentTable";

export function Home() {
  const { add } = useContext(DocumentActionsContext);
  return (
    <>
      <Row>
        <Col className="text-end">
          <Button
            variant="dark"
            title="Créer un nouveau document"
            size="lg"
            className="float-end mb-3"
            onClick={add}
          >
            Créer <FaPlus />
          </Button>
        </Col>
      </Row>
      <DocumentTable />
    </>
  );
}
