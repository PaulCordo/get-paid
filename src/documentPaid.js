import isBefore from "date-fns/isBefore";

import { isDocumentINVOICE } from "./documentTypes";

export function isDocumentPaid(document) {
  return document?.paid;
}

export function isDocumentOverdue(document) {
  return (
    isDocumentINVOICE(document) &&
    !isDocumentPaid(document) &&
    isBefore(new Date(document.payUntil), new Date())
  );
}
