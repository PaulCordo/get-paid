import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useAsyncDebounce } from "react-table";
import { FaSearch } from "react-icons/fa";

export function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <InputGroup>
      <InputGroup.Text>
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={`Rechercher parmis ${count} documents`}
        value={value ?? ""}
        onChange={({ target: { value } }) => {
          setValue(value);
          onChange(value);
        }}
      />
    </InputGroup>
  );
}
