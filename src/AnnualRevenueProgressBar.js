import React, { useContext, useMemo, useRef, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Badge from "react-bootstrap/Badge";
import getYear from "date-fns/getYear";
import isBefore from "date-fns/isBefore";

import { SessionContext } from "./SessionContext";
import { INVOICE, QUOTE } from "./documentTypes";
import { currency } from "./numberFormat";
import { useEffectOnMount } from "./useEffectOnMount";

export function AnnualRevenueProgressBar({ year }) {
  const { documents } = useContext(SessionContext);
  const {
    quotes,
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
    quotesCount,
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
          if (document.type === QUOTE && !document.invoiceId) {
            sums.quotes += document.total;
            sums.quotesCount++;
          } else if (document.type === INVOICE) {
            if (document.paid) {
              sums.paidInvoices += document.total;
              sums.paidInvoicesCount++;
            } else if (isBefore(new Date(document.payUntil), new Date())) {
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
          quotes: 0,
          paidInvoices: 0,
          unpaidInvoices: 0,
          overdueInvoices: 0,
          quotesCount: 0,
          paidInvoicesCount: 0,
          unpaidInvoicesCount: 0,
          overdueInvoicesCount: 0,
        }
      );
  }, [documents, year]);
  const grandTotal = quotes + paidInvoices + unpaidInvoices + overdueInvoices;
  const grandTotalCount =
    quotesCount +
    paidInvoicesCount +
    unpaidInvoicesCount +
    overdueInvoicesCount;

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
            {Boolean(quotesCount) && (
              <>
                <Badge bg="primary">{quotesCount}</Badge> Devis en cours :{" "}
                {currency.format(quotes)}
                <br />
              </>
            )}
            {Boolean(unpaidInvoices) && (
              <>
                <Badge bg="warning">{unpaidInvoicesCount}</Badge> Factures en
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
                <Badge bg="danger">{overdueInvoicesCount}</Badge> Factures
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
        <ProgressBar variant="primary" now={quotes} key={1} />
        <ProgressBar variant="warning" now={unpaidInvoices} key={3} />
        <ProgressBar variant="success" now={paidInvoices} key={2} />
        <ProgressBar variant="danger" now={overdueInvoices} key={4} />
      </ProgressBar>
    </OverlayTrigger>
  );
}
