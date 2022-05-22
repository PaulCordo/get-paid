import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FaPen, FaCheck } from "react-icons/fa";

import { SessionContext } from "../SessionContext";

import { DocumentCreatorForm } from "./DocumentCreatorForm";
import { DocumentCreatorCloseButton } from "./DocumentCreatorCloseButton";
import { DocumentViewer } from "../DocumentViewer";
import { getDocumentVariant } from "../documentStates";

export function DocumentCreatorTab({ onClose = () => {}, source = {} }) {
  const { createDocument } = useContext(SessionContext);

  const [preview, setPreview] = useState(null);

  const saveDocument = () =>
    createDocument(preview).then(() => {
      setPreview(null);
      onClose();
    });
  const saveDraft = (document) =>
    createDocument(Object.assign(document, { draft: true })).then(onClose);

  return (
    <Container className="document-create py-3 h-100">
      {preview ? (
        <DocumentViewer document={preview}>
          <DocumentCreatorCloseButton
            onClose={onClose}
            onDraftSave={saveDraft}
          />
          <div className="py-3 mb-3 align-self-start">
            <Button
              onClick={() => setPreview(null)}
              variant="secondary"
              className="me-3"
              title="éditer"
              size="lg"
            >
              <FaPen />
            </Button>
            <Button
              onClick={() => saveDocument()}
              variant={getDocumentVariant(preview)}
              className="me-3"
              title="Créer le document"
              size="lg"
            >
              <FaCheck />
            </Button>
          </div>
        </DocumentViewer>
      ) : (
        <DocumentCreatorForm
          source={source}
          onClose={onClose}
          onSubmit={setPreview}
          onDraftSave={saveDraft}
        />
      )}
    </Container>
  );
}
