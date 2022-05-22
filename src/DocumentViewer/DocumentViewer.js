import React, { useRef, useState } from "react";

import { useDocumentView } from "../templates";
import { useResize } from "../useResize";

export function DocumentViewer({ document, children }) {
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
      {children}
      <div style={{ transformOrigin: "top", transform: `scale(${scale})` }}>
        <DocumentView document={document} />
      </div>
    </div>
  );
}
