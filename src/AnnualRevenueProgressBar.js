import React, { useContext, useMemo, useRef, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import getYear from "date-fns/getYear";

import { SessionContext } from "./SessionContext";
import { isDocumentINVOICE } from "./documentTypes";
import { currency } from "./numberFormat";
import { useEffectOnMount } from "./useEffectOnMount";
import { isDocumentOverdue, isDocumentPaid } from "./documentPaid";

export function AnnualRevenueProgressBar({ year }) {
  const { documents } = useContext(SessionContext);
  const {
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
    paidInvoicesCount,
    unpaidInvoicesCount,
    overdueInvoicesCount,
  } = useMemo(() => {
    return documents
      .filter(
        ({ draft, date }) => !draft && getYear(new Date(date)) === Number(year)
      )
      .reduce(
        (sums, document) => {
          if (isDocumentINVOICE(document)) {
            if (isDocumentPaid(document)) {
              sums.paidInvoices += document.total;
              sums.paidInvoicesCount++;
            } else if (isDocumentOverdue(document)) {
              sums.overdueInvoices += document.total;
              sums.overdueInvoicesCount++;
            } else {
              sums.unpaidInvoices += document.total;
              sums.unpaidInvoicesCount++;
            }
          }
          return sums;
        },
        {
          paidInvoices: 0,
          unpaidInvoices: 0,
          overdueInvoices: 0,
          paidInvoicesCount: 0,
          unpaidInvoicesCount: 0,
          overdueInvoicesCount: 0,
        }
      );
  }, [documents, year]);
  const grandTotal = paidInvoices + unpaidInvoices + overdueInvoices;
  const grandTotalCount =
    paidInvoicesCount + unpaidInvoicesCount + overdueInvoicesCount;

  const tooltipContentRef = useRef();
  const progressBarRef = useRef();
  const [showTooltip, setShowTooltip] = useState(false);
  useEffectOnMount(() => {
    const handleClick = (event) => {
      !progressBarRef.current?.contains(event.target) &&
        !tooltipContentRef.current?.contains(event.target) &&
        setShowTooltip(false);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  return (
    <OverlayTrigger
      placement="bottom-start"
      trigger="click"
      show={showTooltip}
      onToggle={setShowTooltip}
      overlay={
        <Tooltip id="tooltip-annual-revenues">
          <div className="text-start p-2" ref={tooltipContentRef}>
            <h5>Année {year}</h5>
            {Boolean(unpaidInvoices) && (
              <>
                <Badge bg="secondary">{unpaidInvoicesCount}</Badge> Factures en
                cours de paiment : {currency.format(unpaidInvoices)}
                <br />
              </>
            )}
            {Boolean(paidInvoices) && (
              <>
                <Badge bg="success">{paidInvoicesCount}</Badge> Factures payées
                : {currency.format(paidInvoices)}
                <br />
              </>
            )}
            {Boolean(overdueInvoices) && (
              <>
                <Badge bg="warning">{overdueInvoicesCount}</Badge> Factures
                impayées : {currency.format(overdueInvoices)}
                <br />
              </>
            )}
            <Badge bg="secondary">{grandTotalCount}</Badge> Total :{" "}
            {currency.format(grandTotal)}
          </div>
        </Tooltip>
      }
    >
      <ProgressBar min={0} max={grandTotal} role="button" ref={progressBarRef}>
        <ProgressBar variant="success" now={paidInvoices} key={1} />
        <ProgressBar variant="warning" now={overdueInvoices} key={2} />
      </ProgressBar>
    </OverlayTrigger>
  );
}
