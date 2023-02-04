import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";

import { StoreContext } from "../StoreContext";

import { DocumentCreatorForm } from "./DocumentCreatorForm";
import { DocumentCreatorPreview } from "./DocumentCreatorPreview";
import { getDocumentFromSource } from "./getDocumentFromSource";

export function DocumentCreatorTab({ onClose = () => {}, source }) {
  const { createDocument, user } = useContext(StoreContext);

  const [document, setDocument] = useState(getDocumentFromSource(source, user));

  const [preview, setPreview] = useState(source?.credited);

  const saveDocument = () =>
    preview &&
    createDocument({ ...document, draft: false }).then(() => {
      setPreview(false);
      onClose();
    });
  const saveDraft = (document) =>
    createDocument({ ...document, draft: true }).then(onClose);
  return (
    <Container className="document-create py-3 h-100">
      {preview ? (
        <DocumentCreatorPreview
          document={document}
          onEdit={() => setPreview(false)}
          onValidate={saveDocument}
          onDraftSave={saveDraft}
          onClose={onClose}
        />
      ) : (
        <DocumentCreatorForm
          document={document}
          onClose={onClose}
          onSubmit={(document) => {
            setDocument(document);
            setPreview(true);
          }}
          onDraftSave={saveDraft}
        />
      )}
    </Container>
  );
}
