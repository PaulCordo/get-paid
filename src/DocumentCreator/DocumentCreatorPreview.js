import React from "react";
import Button from "react-bootstrap/Button";
import { FaPen, FaCheck } from "react-icons/fa";

import { DocumentCreatorCloseButton } from "./DocumentCreatorCloseButton";
import { DocumentViewer } from "../DocumentViewer";
import { getDocumentVariant } from "../documentStates";

export function DocumentCreatorPreview({
  document,
  onEdit = () => {},
  onValidate = () => {},
  onDraftSave = () => {},
  onClose = () => {},
}) {
  return (
    <DocumentViewer document={document}>
      <DocumentCreatorCloseButton
        onClose={onClose}
        onDraftSave={() => onDraftSave(document)}
      />
      <div className="py-3 mb-3 align-self-start">
        <Button
          onClick={onEdit}
          variant="secondary"
          className="me-3"
          title="éditer"
          size="lg"
        >
          <FaPen />
        </Button>
        <Button
          onClick={onValidate}
          variant={getDocumentVariant(document)}
          className="me-3"
          title="Créer le document"
          size="lg"
        >
          <FaCheck />
        </Button>
      </div>
    </DocumentViewer>
  );
}
