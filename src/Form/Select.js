import React from "react";
import Form from "react-bootstrap/Form";
import { Controller } from "react-hook-form";

export const Select = ({
  control,
  name,
  options,
  label,
  required,
  disabled,
  defaultValue,
  ...props
}) => (
  <Form.Group {...props}>
    {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Form.Select
          {...field}
          id={label && name}
          disabled={disabled}
          readOnly={disabled}
        >
          {options.map((option) => option)}
        </Form.Select>
      )}
    />
  </Form.Group>
);
