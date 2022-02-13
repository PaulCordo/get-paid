import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaTrashAlt, FaPlus } from "react-icons/fa";

import { DetailRow } from "./DetailRow";
import { usePrevious } from "../usePrevious";
import { ConfirmModal } from "../Modals";

export function DetailSection({
  section: { title, rows },
  onChange,
  onTotalChange,
  canDelete,
  onDelete,
  onAddNewSection,
}) {
  const [totals, setTotals] = useState([0]);
  const total = totals.reduce((total, t) => total + t, 0);
  const prevTotal = usePrevious(total);
  useEffect(() => {
    !isNaN(prevTotal) && total !== prevTotal && onTotalChange(total);
  }, [onTotalChange, prevTotal, total]);

  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);
  return (
    <Card className="mt-5">
      <Card.Header>
        <Row className="justify-content-md-between">
          <Col>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Titre de la section (optionnel)"
              value={title}
              onChange={({ target: { value } }) =>
                onChange({ rows, title: value })
              }
            />
          </Col>
          <Col md="auto">
            {canDelete && (
              <Button
                variant="danger"
                onClick={() => setShowDeleteSectionModal(true)}
                size="lg"
                className="ms-2"
                title="Supprimer cette section"
              >
                <FaTrashAlt />
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              className="ms-2"
              onClick={onAddNewSection}
              title="Ajouter une nouvelle section à la suite"
            >
              <FaPlus />
            </Button>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <Table striped>
          <thead>
            <tr>
              <th scope="col" className="w-50 border-top-0">
                Dénomination
              </th>
              <th scope="col" className="border-top-0">
                Prix unitaire
              </th>
              <th scope="col" className="border-top-0">
                Quantité
              </th>
              <th scope="col" className="border-top-0">
                Total
              </th>
              <th
                scope="col"
                className="border-top-0"
                style={{ width: "7.5rem" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((detail, index) => (
              <DetailRow
                key={detail.name + detail.price + detail.quantity}
                detail={detail}
                onDelete={() => {
                  setTotals((totals) =>
                    totals.filter((total, i) => i !== index)
                  );
                  onChange({ title, rows: rows.filter((d) => d !== detail) });
                }}
                onSave={(updatedDetail) => {
                  onChange({
                    title,
                    rows: rows.map((detail, i) =>
                      i === index ? updatedDetail : detail
                    ),
                  });
                  setTotals((totals) =>
                    totals.map((total, i) =>
                      i === index
                        ? updatedDetail.price * updatedDetail.quantity
                        : total
                    )
                  );
                }}
                onTotalChange={(total) =>
                  setTotals((totals) =>
                    totals.map((t, i) => (i === index ? total : t))
                  )
                }
              />
            ))}
            <DetailRow
              onSave={(detail) => {
                onChange({ title, rows: rows.concat([detail]) });
                setTotals((totals) => totals.concat([0]));
              }}
              onTotalChange={(total) =>
                setTotals((totals) =>
                  totals.map((t, i) => (i === totals.length - 1 ? total : t))
                )
              }
            />
            <tr>
              <th
                colSpan="3"
                scope="row"
                className="text-end border-bottom-0 pt-3"
              >
                Total section H.T
              </th>
              <td colSpan="2" className="border-bottom-0 pt-3">
                {total}€
              </td>
            </tr>
          </tbody>
        </Table>
        <ConfirmModal
          show={showDeleteSectionModal}
          onConfirm={onDelete}
          onCancel={() => setShowDeleteSectionModal(false)}
        >
          <p>Êtes-vous certains de vouloir supprimer cette section ?</p>
        </ConfirmModal>
      </Card.Body>
    </Card>
  );
}
