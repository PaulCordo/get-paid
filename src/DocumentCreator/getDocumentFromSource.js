import { format, add } from "date-fns";
import { INVOICE, QUOTE } from "../documentTypes";

export function getDocumentFromSource(source, user) {
  const emptyDocument = {
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    client: null,
    sections: [
      { name: "", rows: [{ name: "", price: 0, quantity: 0 }], total: 0 },
    ],
    total: 0,
    type: INVOICE,
    draft: true,
    validUntil: format(add(new Date(), { months: 1 }), "yyyy-MM-dd"),
  };

  if (!source) {
    // no document to source from, default
    return { ...emptyDocument, user };
  }

  console.debug("Document source:", source);
  if (source.draft) {
    // draft, take it has it is
    return { ...emptyDocument, ...source, user };
  }

  const document = {
    ...emptyDocument,
    title: source.title,
    description: source.description,
    client: source.client,
    sections: source.sections?.map((section) => ({
      ...section,
    })),
    user,
  };

  if (source.type === QUOTE) {
    // duplicated quote means it is billed
    return {
      ...document,
      fromQuote: { _id: source._id, publicId: source.publicId },
    };
  }

  if (source.canceled) {
    // source invoice needs to be canceled by a new one
    return {
      ...document,
      fromQuote: source.fromQuote,
      cancelInvoice: {
        publicId: source.publicId,
        _id: source._id,
      },
    };
  }

  if (source.credited) {
    // source invoice will be transformed in a credit note, negative copy
    return {
      ...document,
      sections: source.sections?.map(({ rows, total, ...section }) => ({
        ...section,
        total: -total,
        rows: rows?.map(({ price, ...row }) => ({ ...row, price: -price })),
      })),
      total: -source.total,
      creditForInvoice: { _id: source._id, publicId: source.publicId },
    };
  }

  return document;
}
