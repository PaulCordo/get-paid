import React, { useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { FaEuroSign, FaSlash } from "react-icons/fa";
import isBefore from "date-fns/isBefore";

import { stateFilter } from "./StateFilter";
import { documentStates } from "../documentStates";
import { usePrevious } from "../usePrevious";
import { isDocumentOverdue, isDocumentPaid } from "../documentPaid";
import { isDocumentINVOICE } from "../documentTypes";
const { INVOICE } = documentStates;

export function paidFilter(rows, id, value) {
  if (value === "paid") {
    return rows.filter(
      ({ original: document }) =>
        !isDocumentINVOICE(document) || isDocumentPaid(document)
    );
  } else if (value === "overdue") {
    return rows.filter(
      ({ original: document }) =>
        !isDocumentINVOICE(document) || isDocumentOverdue(document)
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
          <Tooltip id="tooltip-paid-filter-overdue">
            {filterValue === "overdue" ? (
              "Afficher toutes les factures"
            ) : (
              <>
                N&lsquo;afficher dans les factures seulement celles{" "}
                <b>impayées</b> dont la date de paiement est dépassée
              </>
            )}
          </Tooltip>
        }
      >
        <ToggleButton
          id="paid-filter-overdue"
          name="paid-filter-overdue"
          type="checkbox"
          variant="outline-warning"
          checked={filterValue === "overdue"}
          value="overdue"
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
