import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import {
  documentStates,
  variantByState,
  getDocumentState,
} from "../documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

//TODO: filter out quotes that already created an invoice
export function stateFilter(rows, id, value) {
  const defaultView = value === "default";
  return rows.filter(({ original: document }) =>
    defaultView ? true : getDocumentState(document) === value
  );
}

export function StateFilter({ column: { setFilter, filterValue } }) {
  return (
    <ToggleButtonGroup
      name="document-state-filter"
      value={filterValue}
      onChange={setFilter}
    >
      <ToggleButton
        type="radio"
        variant={
          (filterValue && filterValue !== "tous" ? "outline-" : "") + "dark"
        }
        value="default"
        id="document-state-filter-tous"
      >
        Tous
      </ToggleButton>
      {[INVOICE, QUOTE, DRAFT].map((state) => (
        <ToggleButton
          key={state}
          id={"document-state-filter-" + state}
          type="radio"
          variant={
            (filterValue !== state ? "outline-" : "") + variantByState[state]
          }
          value={state}
        >
          {state}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export function DocumentTableStateFilter({ documentTable }) {
  return documentTable?.headerGroups
    ?.flatMap(({ headers }) => headers)
    ?.filter(({ Filter }) => Filter)
    ?.find((header) => header.id === "publicId" && header.Filter)
    ?.render("Filter");
}
