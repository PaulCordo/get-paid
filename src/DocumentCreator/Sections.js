import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FaPlus } from "react-icons/fa";
import { useFieldArray } from "react-hook-form";
import { Section } from "./Section";

export function Sections({ control, register, setValue, getValues }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const canRemove = fields.length > 1;
  return (
    <div className="document-detail">
      {fields.map((field, index) => (
        <Section
          key={field.id}
          {...{
            control,
            register,
            setValue,
            getValues,
            index,
            remove,
            canRemove,
          }}
        />
      ))}
      <Row>
        <Col className="mt-3 text-end">
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              append({
                title: "",
                rows: [{ name: "", price: 0, quantity: 0 }],
                total: 0,
              })
            }
            title="Ajouter une nouvelle section à la suite"
          >
            <FaPlus />
          </Button>
        </Col>
      </Row>
    </div>
  );
}
