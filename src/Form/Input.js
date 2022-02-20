import React from "react";
import Form from "react-bootstrap/Form";

export const Input = ({
  register,
  name,
  type = "text",
  label,
  placeholder,
  required,
  disabled,
  readOnly,
  ...props
}) => (
  <Form.Group {...props}>
    {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
    <Form.Control
      {...register(name, { required })}
      id={label && name}
      {...{ type, placeholder, disabled, readOnly }}
    />
  </Form.Group>
);
