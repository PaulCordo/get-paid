import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { useFieldArray } from "react-hook-form";

import { currency } from "../numberFormat";

export function SectionRows({ sectionIndex, control, register, getValues }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.rows`,
  });
  return (
    <>
      {fields.map((field, index) => (
        <tr key={field.id}>
          <td className="ps-3">
            <Form.Control
              type="text"
              {...register(`sections.${sectionIndex}.rows.${index}.name`, {
                required: true,
              })}
            />
          </td>
          <td className="align-middle" style={{ minWidth: 125 }}>
            <InputGroup>
              <Form.Control
                className="text-end"
                type="number"
                {...register(`sections.${sectionIndex}.rows.${index}.price`, {
                  required: true,
                  min: 0,
                })}
              />
              <InputGroup.Text>€</InputGroup.Text>
            </InputGroup>
          </td>
          <td>
            <Form.Control
              className="text-end"
              type="number"
              {...register(`sections.${sectionIndex}.rows.${index}.quantity`, {
                required: true,
                min: 0,
              })}
            />
          </td>
          <td className="align-middle">
            {currency.format(
              getValues([
                `sections.${sectionIndex}.rows.${index}.price`,
                `sections.${sectionIndex}.rows.${index}.quantity`,
              ])?.reduce((price, quantity) => price * quantity)
            )}
          </td>
          <td className="px-0">
            {fields.length > 1 && (
              <Button
                variant="danger"
                className="ms-2"
                onClick={() => remove(index)}
              >
                <FaTrashAlt />
              </Button>
            )}
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan="5" className="text-end">
          <Button
            variant="primary"
            className="ms-2"
            onClick={() => append({ name: "", price: 0, quantity: 0 })}
          >
            <FaPlus />
          </Button>
        </td>
      </tr>
    </>
  );
}
