import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import {
  documentStates,
  variantByState,
  getDocumentState,
} from "../documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

export function stateFilter(rows, id, value) {
  return rows.filter(
    ({ original: document }) => getDocumentState(document) === value
  );
}

stateFilter.autoRemove = (val) => !val || val === "tous";

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
        value="tous"
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
