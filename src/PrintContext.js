import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";

import { request } from "./apiServices";
import { DocumentViewer } from "./DocumentViewer";
import { SessionContext } from "./SessionContext";

export const PrintContext = React.createContext({
  downloadDocument: () => {},
});

export function PrintProvider({ children }) {
  const [renderedDocument, setRenderedDocument] = useState(null);
  const [action, setAction] = useState(() => {});
  const downloadDocument = useCallback((document) => {
    setRenderedDocument(document);
    setAction(
      () => () =>
        request("document-download", document).then(() => {
          setRenderedDocument(null);
          setAction(() => {});
        })
    );
  }, []);
  useEffect(
    () => renderedDocument && action && action(),
    [action, renderedDocument]
  );

  const { documents } = useContext(SessionContext);
  useEffect(() => {
    documents && documents.length && setRenderedDocument(documents[0]);
  }, [documents]);

  const PrintContextValue = useMemo(
    () => ({ downloadDocument }),
    [downloadDocument]
  );
  return (
    <PrintContext.Provider value={PrintContextValue}>
      <div className="d-none d-print-block h-100 w-100">
        {renderedDocument && <DocumentViewer document={renderedDocument} />}
      </div>
      {children}
    </PrintContext.Provider>
  );
}
