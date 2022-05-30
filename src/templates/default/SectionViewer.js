import React from "react";
import Table from "react-bootstrap/Table";
import { currency } from "../../numberFormat";

export function SectionViewer({ section: { title, rows } }) {
  const total = rows.reduce(
    (total, { quantity, price }) => total + price * quantity,
    0
  );
  return (
    <section className="my-3">
      {title && <h3>{title}</h3>}
      <Table striped>
        <thead>
          <tr>
            <th scope="col" className="border-top-0">
              Dénomination
            </th>
            <th scope="col" className="border-top-0 fixed-col-width">
              Prix unitaire
            </th>
            <th scope="col" className="border-top-0 fixed-col-width">
              Quantité
            </th>
            <th scope="col" className="border-top-0 fixed-col-width">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, price, quantity }) => (
            <tr key={name + price + quantity}>
              <td>{name}</td>
              <td className="text-end">{price}€</td>
              <td className="text-end">{quantity}</td>
              <td className="text-end">{currency.format(price * quantity)}</td>
            </tr>
          ))}
          <tr>
            <th
              colSpan="3"
              scope="row"
              className="text-end border-bottom-0 pt-3"
            >
              Total section H.T
            </th>
            <td
              colSpan="2"
              className="border-bottom-0 pt-3 text-end fixed-col-width"
            >
              {currency.format(total)}
            </td>
          </tr>
        </tbody>
      </Table>
    </section>
  );
}
