import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import {
  FaCheck,
  FaTimes,
  FaPencilAlt,
  FaTrashAlt,
  FaPlus,
} from "react-icons/fa";

const emptyDetail = { name: "", price: 0, quantity: 0 };
export function DetailRow({
  detail,
  onDelete = () => {},
  onSave = () => {},
  onTotalChange = () => {},
}) {
  const [edit, setEdit] = useState(!detail);
  const [{ name, price, quantity }, setEditedDetail] = useState(
    detail ? { ...emptyDetail, ...detail } : emptyDetail
  );
  if (detail && !edit) {
    const { name, price, quantity } = detail;
    return (
      <tr>
        <td className="align-middle">{name}</td>
        <td className="text-end pe-4 align-middle">{price}€</td>
        <td className="text-end pe-4 align-middle">{quantity}</td>
        <td className="align-middle">{price * quantity}€</td>
        <td className="px-0">
          <Button variant="warning" onClick={() => setEdit(true)}>
            <FaPencilAlt />
          </Button>
          <Button variant="danger" onClick={onDelete} className="ms-2">
            <FaTrashAlt />
          </Button>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td className="ps-0">
        <Form.Control
          type="text"
          required
          value={name}
          onChange={({ target: { value } }) =>
            setEditedDetail((detail) => ({ ...detail, name: value }))
          }
        />
      </td>
      <td className="align-middle" style={{ minWidth: 125 }}>
        <InputGroup>
          <Form.Control
            className="text-end"
            type="number"
            min="0"
            required
            value={price}
            onChange={({ target: { value } }) => {
              setEditedDetail((detail) => ({ ...detail, price: value }));
              onTotalChange(value * quantity);
            }}
          />
          <InputGroup.Append>
            <InputGroup.Text>€</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </td>
      <td>
        <Form.Control
          className="text-end"
          type="number"
          min="0"
          required
          value={quantity}
          onChange={({ target: { value } }) => {
            setEditedDetail((detail) => ({ ...detail, quantity: value }));
            onTotalChange(price * value);
          }}
        />
      </td>
      <td className="align-middle">{price * quantity}</td>
      <td className="px-0">
        {detail ? (
          <>
            <Button
              variant="primary"
              onClick={() => onSave({ name, price, quantity })}
            >
              <FaCheck />
            </Button>
            <Button
              variant="warning"
              className="ms-2"
              onClick={() => {
                setEdit(false);
                setEditedDetail({ ...emptyDetail, ...detail });
              }}
            >
              <FaTimes />
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            disabled={!name || quantity < 0}
            onClick={() => {
              onSave({ name, price, quantity });
              setEditedDetail(
                detail ? { ...emptyDetail, ...detail } : emptyDetail
              );
            }}
          >
            <FaPlus />
          </Button>
        )}
      </td>
    </tr>
  );
}
