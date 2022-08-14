export function getDocumentTotalWithoutExpense(document) {
  return document.total - (document.expense ?? 0);
}
