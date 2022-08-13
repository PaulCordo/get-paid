import React from "react";
import Col from "react-bootstrap/Col";

import { Select } from "../Form";

const idTypes = ["SIREN", "SIRET", "RNA"];

export function IdTypeSelect({
  control,
  required,
  className,
  disabled,
  ...props
}) {
  return (
    <Select
      as={Col}
      {...props}
      className={className}
      name="idType"
      disabled={disabled}
      required={required}
      defaultValue=""
      options={[
        <option value="" key="default" disabled>
          Type
        </option>,
        ...idTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        )),
      ]}
      control={control}
    />
  );
}
