import React, { useContext, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Table from "react-bootstrap/Table";

import { AccountDisplay } from "./AccountDisplay";
import { SessionContext } from "./SessionContext";
import { INVOICE, QUOTE } from "./documentTypes";

export function DocumentViewer({
  document: {
    number,
    type = INVOICE,
    date,
    payUntil,
    validUntil,
    title,
    client,
    details,
    total,
  },
}) {
  const { user } = useContext(SessionContext);
  const documentDate = useMemo(() => new Date(date), [date]);
  const documentPayUntil = useMemo(() => new Date(payUntil), [payUntil]);
  const documentValidUntil = useMemo(() => new Date(validUntil), [validUntil]);
  return (
    <div className="w-100 h-100">
      <header>
        <h4 className="info">
          <label>{type} </label>
          <span className="font-weight-bold ms-2">
            {type === INVOICE && "#"}
            {number}
          </span>
        </h4>
        <div className="w-100 d-flex align-items-start justify-content-between">
          <div>
            {user && <AccountDisplay client={user} />}
            <div className="info">
              <div>
                <label>Le </label>
                <span className="font-weight-bold ms-1">
                  {format(documentDate, "PPP", { locale: fr })}
                </span>
              </div>
              <div>
                <label>Pour </label>
                <span className="font-weight-bold ms-1">{title}</span>
              </div>
              {type === QUOTE && (
                <div>
                  <label>Devis valable jusqu&#39;au </label>
                  <span className="font-weight-bold ms-1">
                    {format(documentValidUntil, "PPP", { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4>À</h4>
            <AccountDisplay client={client} />
          </div>
        </div>
      </header>
      <Table striped className="mt-5">
        <thead>
          <tr>
            <th scope="col" className="w-50 border-top-0">
              Dénomination
            </th>
            <th scope="col" className="border-top-0 text-end">
              Prix unitaire
            </th>
            <th scope="col" className="border-top-0 text-end">
              Quantité
            </th>
            <th scope="col" className="border-top-0 text-end">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {details.map(({ name, price, quantity }) => (
            <tr key={name + price + quantity}>
              <td>{name}</td>
              <td className="text-end">{price}€</td>
              <td className="text-end">{quantity}</td>
              <td className="text-end">{price * quantity}€</td>
            </tr>
          ))}
          <tr>
            <th colSpan="3" scope="row" className="text-end">
              Total HT
            </th>
            <td className="text-end">{total}€</td>
          </tr>
          <tr>
            <th colSpan="3" scope="row" className="text-end">
              Total TTC
            </th>
            <td className="text-end">{total}€</td>
          </tr>
        </tbody>
      </Table>
      <footer className="fixed-bottom d-none d-print-block">
        <p className="font-italic">
          Dispensé d’immatriculation au registre du commerce et des sociétés
          (RCS) et au répertoire des métiers (RM)
          <br />
          TVA non applicable, art. 293B du CGI
          {type === INVOICE && (
            <>
              <br />
              En cas de retard de paiement, indemnité forfaitaire légale pour
              frais de recouvrement : 40,00 €
              <br />
              Pas d&#39;escompte pour règlement anticipé
              <span className="float-end">
                Date limite de paiement :{" "}
                {format(documentPayUntil, "PPP", {
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
