import {
  FaFileSignature,
  FaSave,
  FaFileInvoiceDollar,
  FaFile,
} from "react-icons/fa";
import { isDocumentOverdue } from "./documentPaid";
import { INVOICE, QUOTE } from "./documentTypes";

const DRAFT = "Brouillon";
const NEW = "Nouveau";
const OVERDUE = "Impayée";

export const documentStates = { INVOICE, QUOTE, DRAFT, NEW, OVERDUE };

export const variantByState = {
  [INVOICE]: "success",
  [QUOTE]: "primary",
  [DRAFT]: "secondary",
  [NEW]: "secondary",
  [OVERDUE]: "warning",
};

let init = false;
const colorByState = {};

export const iconByState = {
  [INVOICE]: FaFileInvoiceDollar,
  [QUOTE]: FaFileSignature,
  [DRAFT]: FaSave,
  [NEW]: FaFile,
  [OVERDUE]: FaFileInvoiceDollar,
};

export function getDocumentState(document) {
  if (document?.draft) {
    return DRAFT;
  } else if (isDocumentOverdue(document)) {
    return OVERDUE;
  }
  return document?.type;
}

export function getDocumentColor(doc) {
  if (!init) {
    const success = getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-success"
    );
    const secondary = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--bs-secondary");
    const primary = getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-primary"
    );
    const warning = getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-warning"
    );
    colorByState[INVOICE] = success;
    colorByState[QUOTE] = primary;
    colorByState[DRAFT] = secondary;
    colorByState[NEW] = secondary;
    colorByState[OVERDUE] = warning;
    init = true;
  }
  return colorByState[getDocumentState(doc)];
}

export function getDocumentVariant(document) {
  return variantByState[getDocumentState(document)];
}
