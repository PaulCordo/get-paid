import React, { useRef, useState } from "react";
import CloseButton from "react-bootstrap/CloseButton";

import { useDocumentView } from "../templates";
import { DocumentActionButtons } from "../DocumentActionButtons";
import { useResize } from "../useResize";

export function DocumentViewer({
  document,
  actions = false,
  onClose = () => {},
}) {
  const DocumentView = useDocumentView(document);
  const documentViewerRef = useRef();
  const [scale, setScale] = useState(1);
  useResize(() => {
    // we use A4 pages that are 21cm large, that's 8.27inch and 793.7px at 96 DPI
    const viewerWidth =
      documentViewerRef.current?.getBoundingClientRect()?.width;
    if (viewerWidth) {
      // avoid a resize triggered on print
      const A4Width = 793.7;
      setScale(viewerWidth > A4Width ? 1 : viewerWidth / A4Width);
    }
  });

  return (
    <div
      className="document-viewer d-flex flex-column align-items-center"
      ref={documentViewerRef}
    >
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
      <div style={{ transformOrigin: "top", transform: `scale(${scale})` }}>
        <DocumentView document={document} />
      </div>
    </div>
  );
}
