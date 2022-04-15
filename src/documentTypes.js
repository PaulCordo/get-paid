const INVOICE = "Facture",
  QUOTE = "Devis";

function isDocumentINVOICE(document) {
  return document?.type === INVOICE;
}

module.exports = { INVOICE, QUOTE, isDocumentINVOICE };
