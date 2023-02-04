export const INVOICE = "Facture",
  QUOTE = "Devis";

export function isDocumentINVOICE(document) {
  return document?.type === INVOICE;
}

const documentTypes = [INVOICE, QUOTE];
export default documentTypes;
