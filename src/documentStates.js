import {
  FaFileSignature,
  FaSave,
  FaFileInvoiceDollar,
  FaFile,
} from "react-icons/fa";
import { isDocumentOverdue } from "./documentPaid";
import { INVOICE, QUOTE } from "./documentTypes";
import { success, secondary, primary, warning } from "./variables.module.scss";

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

export const colorByState = {
  [INVOICE]: success,
  [QUOTE]: primary,
  [DRAFT]: secondary,
  [NEW]: FaFile,
  [OVERDUE]: warning,
};

export const iconByState = {
  [INVOICE]: FaFileInvoiceDollar,
  [QUOTE]: FaFileSignature,
  [DRAFT]: FaSave,
  [NEW]: secondary,
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

export function getDocumentColor(document) {
  return colorByState[getDocumentState(document)];
}

export function getDocumentVariant(document) {
  return variantByState[getDocumentState(document)];
}
