import React, { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaTrashAlt } from "react-icons/fa";
import { useWatch, Controller } from "react-hook-form";

import { ConfirmModal } from "../Modals";
import { currency } from "../numberFormat";
import { SectionRows } from "./SectionRows";
import { usePrevious } from "../usePrevious";

export function Section({
  control,
  register,
  setValue,
  getValues,
  index,
  remove,
  canRemove,
}) {
  // update section total when rows are touched
  const sectionRows = useWatch({ name: `sections.${index}.rows`, control });
  const sectionTotal = useMemo(
    () =>
      sectionRows.reduce(
        (total, { price, quantity }) => total + price * quantity,
        0
      ),
    [sectionRows]
  );
  const prevSectionTotal = usePrevious(sectionTotal);
  const allSections = useWatch({ name: "sections", control });
  useEffect(() => {
    if (prevSectionTotal !== sectionTotal) {
      setValue(`sections.${index}.total`, sectionTotal);
      setValue(
        "total",
        allSections
          .map(({ total }, i) => (i === index ? sectionTotal : total))
          .reduce((total, t) => total + t, 0)
      );
    }
  }, [sectionTotal, prevSectionTotal, setValue, index, allSections]);

  const [showRemoveSectionModal, setShowRemoveSectionModal] = useState(false);

  // expense section
  const isExpenseSection = useWatch({
    name: `sections.${index}.expense`,
    control,
  });

  return (
    <Card className="mt-5">
      <Card.Header>
        <Row className="justify-content-md-between">
          <Col>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Titre de la section (optionnel)"
              {...register(`sections.${index}.name`)}
            />
          </Col>
          <Col md="auto" className="text-center">
            <Form.Group controlId={`sections.${index}.expense`}>
              <Form.Label className="fw-bold mb-0">Frais</Form.Label>
              <Form.Switch
                className="mb-0"
                {...register(`sections.${index}.expense`)}
              />
            </Form.Group>
          </Col>
          <Col md="auto">
            {canRemove && (
              <Button
                variant="danger"
                onClick={() => setShowRemoveSectionModal(true)}
                size="lg"
                className="ms-2"
                title="Supprimer cette section"
              >
                <FaTrashAlt />
              </Button>
            )}
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
              <th scope="col" className="border-top-0">
                Frais
              </th>
              <th scope="col" className="border-top-0"></th>
            </tr>
          </thead>
          <tbody>
            <SectionRows
              {...{ control, register, setValue, getValues }}
              sectionIndex={index}
              isExpenseSection={isExpenseSection}
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
                <Controller
                  name={`sections.${index}.total`}
                  control={control}
                  render={({ field: { value } }) => currency.format(value)}
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <ConfirmModal
          show={showRemoveSectionModal}
          onConfirm={() => remove(index)}
          onCancel={() => setShowRemoveSectionModal(false)}
        >
          <p>Êtes-vous certains de vouloir supprimer cette section ?</p>
        </ConfirmModal>
      </Card.Body>
    </Card>
  );
}
