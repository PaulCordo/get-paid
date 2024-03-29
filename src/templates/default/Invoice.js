import React, { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Table from "react-bootstrap/Table";
import ReactMarkdown from "react-markdown";

import { AccountDisplay } from "../../AccountDisplay";
import { INVOICE, isDocumentINVOICE, QUOTE } from "../../documentTypes";
import { currency } from "../../numberFormat";

import { SectionViewer } from "./SectionViewer";
import "./default.scss";

export function Invoice({ document }) {
  const {
    publicId,
    user,
    type = INVOICE,
    date,
    validUntil,
    title,
    description,
    client,
    details, // deprecated
    sections,
    total,
    creditForInvoice,
    cancelInvoice,
  } = document;
  const documentDate = useMemo(() => new Date(date), [date]);
  const documentvalidUntil = useMemo(() => new Date(validUntil), [validUntil]);
  const documentValidUntil = useMemo(() => new Date(validUntil), [validUntil]);
  const tax = isNaN(Number(user.tax)) ? 0 : Number(user.tax);
  return (
    <div className="default-template page py-5 px-5">
      <header className="mb-4">
        <h4 className="info">
          <label>{type} </label>
          <span className="fw-bold ms-2">
            {isDocumentINVOICE(document) && "#"}
            {publicId}
          </span>
        </h4>
        {creditForInvoice && (
          <h5 className="info fw-bold">
            Avoir pour #{creditForInvoice.publicId}
          </h5>
        )}
        {cancelInvoice && (
          <h5 className="info fw-bold">
            Annule et remplace #{cancelInvoice.publicId}
          </h5>
        )}
        <div className="w-100 d-flex align-items-start justify-content-between mt-3">
          <div>
            {user && <AccountDisplay account={user} />}
            <div className="info mt-3">
              <div>
                <label>Le </label>
                <span className="fw-bold ms-1">
                  {format(documentDate, "PPP", { locale: fr })}
                </span>
              </div>
              <div>
                <label>Pour </label>
                <span className="fw-bold ms-1">{title}</span>
              </div>
              {description && (
                <div>
                  <label>Description </label>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              )}
              {type === QUOTE && (
                <div>
                  <label>Devis valable jusqu&#39;au </label>
                  <span className="fw-bold ms-1">
                    {format(documentValidUntil, "PPP", { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4>À</h4>
            <AccountDisplay account={client} />
          </div>
        </div>
      </header>

      {sections &&
        sections.map((section, index) => (
          <SectionViewer key={index} section={section} />
        ))}
      {
        // deprectated
        details && <SectionViewer section={{ rows: details }} />
      }

      <Table borderless className="float-end totals" size="sm">
        <tbody>
          <tr>
            <th scope="row" className="text-end fixed-col-width">
              Total H.T
            </th>
            <td className="text-end fixed-col-width">
              {currency.format(total)}
            </td>
          </tr>
          {tax && (
            <tr>
              <th scope="row" className="text-end fixed-col-width">
                TVA {tax}%
              </th>
              <td className="text-end fixed-col-width">
                {currency.format((total * tax) / 100)}
              </td>
            </tr>
          )}
          <tr>
            <th scope="row" className="text-end fixed-col-width">
              Total T.T.C
            </th>
            <td className="text-end fixed-col-width">
              {currency.format(total + (total * tax) / 100)}
            </td>
          </tr>
        </tbody>
      </Table>
      <footer className="position-absolute bottom-0">
        <p className="fst-italic">
          Dispensé d&lsquo;immatriculation au registre du commerce et des
          sociétés (RCS) et au répertoire des métiers (RM)
          <br />
          {!tax && "TVA non applicable, art. 293B du CGI"}
          {isDocumentINVOICE(document) && (
            <>
              <br />
              En cas de retard de paiement, indemnité forfaitaire légale pour
              frais de recouvrement : {currency.format(40)}
              <br />
              Pas d&#39;escompte pour règlement anticipé
              <span className="float-end">
                Date limite de paiement :{" "}
                {format(documentvalidUntil, "PPP", {
                  locale: fr,
                })}
              </span>
            </>
          )}
        </p>
      </footer>
    </div>
  );
}
