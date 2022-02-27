import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaQuestionCircle } from "react-icons/fa";

export const Input = ({
  register,
  name,
  type = "text",
  label,
  placeholder,
  required,
  disabled,
  readOnly,
  tooltip,
  ...props
}) => (
  <Form.Group {...props}>
    {label && (
      <Form.Label htmlFor={name}>
        {label}
        {tooltip && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{tooltip}</Tooltip>}
          >
            <Button variant="transparent" className="py-0">
              <FaQuestionCircle className="mb-1" />
            </Button>
          </OverlayTrigger>
        )}
      </Form.Label>
    )}
    <Form.Control
      {...register(name, { required })}
      id={label && name}
      {...{ type, placeholder, disabled, readOnly }}
    />
  </Form.Group>
);
