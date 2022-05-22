import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import {
  documentStates,
  variantByState,
  getDocumentState,
  iconByState,
} from "../documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

export function stateFilter(rows, id, value) {
  return rows.filter(
    ({ original: document }) => getDocumentState(document) === value
  );
}

stateFilter.autoRemove = (value) => !value;

export function StateFilter({ column: { setFilter, filterValue } }) {
  return (
    <ButtonGroup name="document-state-filter">
      {[INVOICE, QUOTE, DRAFT].map((state) => {
        const Icon = iconByState[state];
        return (
          <ToggleButton
            key={state}
            id={"document-state-filter-" + state}
            type="checkbox"
            checked={filterValue === state}
            variant={
              (filterValue !== state ? "outline-" : "") + variantByState[state]
            }
            value={state}
            title={state}
            onChange={({ currentTarget: { value } }) =>
              setFilter(filterValue === value ? null : value)
            }
          >
            <Icon />
          </ToggleButton>
        );
      })}
    </ButtonGroup>
  );
}

export function DocumentTableStateFilter({ documentTable }) {
  return documentTable?.headerGroups
    ?.flatMap(({ headers }) => headers)
    ?.filter(({ Filter }) => Filter)
    ?.find((header) => header.id === "publicId" && header.Filter)
    ?.render("Filter");
}
