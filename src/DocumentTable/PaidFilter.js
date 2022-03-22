import React, { useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { FaEuroSign, FaSlash } from "react-icons/fa";

import { stateFilter } from "./StateFilter";
import { documentStates } from "../documentStates";
import { usePrevious } from "../usePrevious";
const { INVOICE } = documentStates;

export function paidFilter(rows, id, value) {
  if (value === "paid") {
    return rows.filter(
      ({ original: document }) => document.type !== INVOICE || document.paid
    );
  } else if (value === "unpaid") {
    return rows.filter(
      ({ original: document }) => document.type !== INVOICE || !document.paid
    );
  } else {
    return rows;
  }
}

paidFilter.autoRemove = (value) => !value;

export function PaidFilter({ column: { setFilter, filterValue }, columns }) {
  const stateFilterValue = columns.find(
    ({ filter }) => filter === stateFilter
  )?.filterValue;
  const hasInvoices = ["default", INVOICE].includes(stateFilterValue);
  const prevHasInvoices = usePrevious(hasInvoices);
  useEffect(() => {
    if (!hasInvoices && prevHasInvoices !== hasInvoices) {
      setFilter();
    }
  }, [hasInvoices, prevHasInvoices, setFilter]);

  return (
    <ButtonGroup name="paid-filter">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-paid-filter-paid">
            {filterValue === "paid" ? (
              "Afficher toutes les factures"
            ) : (
              <>
                N&lsquo;afficher dans les factures seulement celles marquées{" "}
                <b>payées</b>
              </>
            )}
          </Tooltip>
        }
      >
        <ToggleButton
          id="paid-filter-paid"
          name="paid-filter-paid"
          type="checkbox"
          variant="outline-success"
          checked={filterValue === "paid"}
          value="paid"
          onChange={({ currentTarget: { value } }) =>
            setFilter(filterValue === value ? null : value)
          }
          disabled={!hasInvoices}
        >
          <FaEuroSign />
        </ToggleButton>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-paid-filter-unpaid">
            {filterValue === "unpaid" ? (
              "Afficher toutes les factures"
            ) : (
              <>
                N&lsquo;afficher dans les factures seulement celles marquées{" "}
                <b>impayées</b>
              </>
            )}
          </Tooltip>
        }
      >
        <ToggleButton
          id="paid-filter-unpaid"
          name="paid-filter-unpaid"
          type="checkbox"
          variant="outline-danger"
          checked={filterValue === "unpaid"}
          value="unpaid"
          onChange={({ currentTarget: { value } }) =>
            setFilter(filterValue === value ? null : value)
          }
          disabled={!hasInvoices}
        >
          <FaEuroSign />
          <FaSlash style={{ marginLeft: "-1em" }} />
        </ToggleButton>
      </OverlayTrigger>
    </ButtonGroup>
  );
}

export function DocumentTablePaidFilter({ documentTable }) {
  return documentTable?.headerGroups
    ?.flatMap(({ headers }) => headers)
    ?.filter(({ Filter }) => Filter)
    ?.find((header) => header.id === "total" && header.Filter)
    ?.render("Filter");
}
