import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import { format, add } from "date-fns";

import { SessionContext } from "../SessionContext";

import { DocumentCreatorForm } from "./DocumentCreatorForm";
import { DocumentCreatorPreview } from "./DocumentCreatorPreview";
import { INVOICE } from "../documentTypes";

function getCreditFromCreditedSource({
  title,
  description,
  user,
  client,
  sections,
  total,
  _id,
  publicId,
}) {
  return {
    title,
    description,
    user,
    client,
    type: INVOICE,
    draft: false,
    date: format(new Date(), "yyyy-MM-dd"),
    validUntil: format(add(new Date(), { months: 1 }), "yyyy-MM-dd"),
    sections: sections.map(({ rows, total, ...section }) => ({
      ...section,
      total: -total,
      rows: rows.map(({ price, ...row }) => ({ ...row, price: -price })),
    })),
    total: -total,
    creditForInvoice: { _id, publicId },
  };
}
export function DocumentCreatorTab({ onClose = () => {}, source = {} }) {
  const { createDocument } = useContext(SessionContext);

  const [credit] = useState(
    source.credited && getCreditFromCreditedSource(source)
  );

  const [preview, setPreview] = useState(credit);

  const saveDocument = () =>
    preview &&
    createDocument({ ...preview, draft: false }).then(() => {
      setPreview(null);
      onClose();
    });
  const saveDraft = (document) =>
    createDocument({ ...document, draft: true }).then(onClose);
  return (
    <Container className="document-create py-3 h-100">
      {preview && (
        <DocumentCreatorPreview
          document={preview}
          onEdit={() => setPreview(null)}
          onValidate={saveDocument}
          onDraftSave={saveDraft}
          onClose={onClose}
        />
      )}
      {!preview && (
        <DocumentCreatorForm
          source={credit || source}
          onClose={onClose}
          onSubmit={setPreview}
          onDraftSave={saveDraft}
        />
      )}
    </Container>
  );
}
