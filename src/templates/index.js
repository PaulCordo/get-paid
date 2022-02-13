import { useContext } from "react";

import { SessionContext } from "../SessionContext";
import { INVOICE, QUOTE } from "../documentTypes";

import template from "./default";
export const defaultTemplate = template;
// import custom templates here and add them to the templates list

export const templates = [defaultTemplate];

const documentViewKeysByDocumentType = {
  [INVOICE]: "Invoice",
  [QUOTE]: "Quote",
};

const getDocumentView = (template, type) =>
  template[documentViewKeysByDocumentType[type]];
const getTemplate = (templateName) =>
  templates.find(({ name }) => (templateName ?? defaultTemplate.name) === name);

export function useDocumentView(document) {
  const { user } = useContext(SessionContext);
  if (!document || !user) {
    return () => null;
  }
  const DocumentView = getDocumentView(
    getTemplate(user.template),
    document.type
  );
  return DocumentView;
}
