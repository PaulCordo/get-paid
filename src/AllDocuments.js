import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaPlus } from "react-icons/fa";
import getYear from "date-fns/getYear";

import { DocumentActionsContext } from "./DocumentActionsContext";
import { DocumentTable } from "./DocumentTable";
import { AnnualRevenueProgressBar } from "./AnnualRevenueProgressBar";

export function AllDocuments() {
  const { add } = useContext(DocumentActionsContext);
  const currentYear = getYear(new Date());
  return (
    <>
      <Row className="mb-4">
        <Col className="align-self-center">
          <h2>CA {currentYear}</h2>
          <AnnualRevenueProgressBar year={currentYear} />
        </Col>
        <Col className="text-end align-self-end">
          <Button
            variant="dark"
            title="Créer un nouveau document"
            size="lg"
            className="float-end"
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
