import React from "react";
import CloseButton from "react-bootstrap/CloseButton";

import { DocumentActionButtons } from "../DocumentActions";
import { DocumentViewer } from "./DocumentViewer";

export function DocumentViewerTab({
  document,
  actions = false,
  onClose = () => {},
}) {
  return (
    <DocumentViewer document={document}>
      {actions && (
        <div className="py-3 mb-3 align-self-start">
          <DocumentActionButtons
            document={document}
            canView={false}
            size="lg"
          />
        </div>
      )}

      <CloseButton
        className="position-fixed end-0 my-3 me-3 fs-4"
        onClick={onClose}
      />
    </DocumentViewer>
  );
}
