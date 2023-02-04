import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";

import { useDocumentView } from "./templates";
import { StoreContext } from "./StoreContext";

export const PrintContext = React.createContext({
  downloadDocument: () => {},
});

export function PrintProvider({ children }) {
  const [renderedDocument, setRenderedDocument] = useState(null);
  const DocumentView = useDocumentView(renderedDocument);
  const [action, setAction] = useState(() => {});
  const downloadDocument = useCallback((document) => {
    setRenderedDocument(document);
    setAction(() => () => {
      window.print();
      setRenderedDocument(null);
    });
  }, []);
  useEffect(() => {
    renderedDocument && action && action();
  }, [action, renderedDocument]);

  const { documents } = useContext(StoreContext);
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
        <DocumentView document={renderedDocument} />
      </div>
      {children}
    </PrintContext.Provider>
  );
}
