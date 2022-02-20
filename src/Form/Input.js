import React from "react";
import Form from "react-bootstrap/Form";

export const Input = ({
  register,
  name,
  label,
  placeHolder,
  required,
  disabled,
  type = "text",
  ...props
}) => (
  <Form.Group {...props}>
    {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
    <Form.Control
      type={type}
      {...register(name, { required })}
      id={label && name}
      placeholder={placeHolder}
      disabled={disabled}
      readOnly={disabled}
    />
  </Form.Group>
);
