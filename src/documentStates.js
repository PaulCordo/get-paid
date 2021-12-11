import { INVOICE, QUOTE } from "./documentTypes";
import { success, secondary, primary } from "./variables.module.scss";

const DRAFT = "Brouillon";
const NEW = "Nouveau";

export const documentStates = { INVOICE, QUOTE, DRAFT, NEW };

export const variantByState = {
  [INVOICE]: "success",
  [QUOTE]: "primary",
  [DRAFT]: "secondary",
  [NEW]: "secondary",
};

export const colorByState = {
  [INVOICE]: success,
  [QUOTE]: primary,
  [DRAFT]: secondary,
  [NEW]: secondary,
};

export function getDocumentState({ draft, type } = {}) {
  if (draft) {
    return DRAFT;
  }
  return type;
}

export function getDocumentColor(document) {
  return colorByState[getDocumentState(document)];
}

export function getDocumentVariant(document) {
  return variantByState[getDocumentState(document)];
}
