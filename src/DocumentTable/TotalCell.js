import React from "react";

import { currency } from "../numberFormat";

export function TotalCell({ value: total }) {
  return <div className="text-end">{currency.format(total)}</div>;
}
