import React, { useMemo, useState, useCallback, useContext } from "react";
import Container from "react-bootstrap/Container";

import { DocumentCreatorTab } from "../DocumentCreator";
import { DocumentViewerTab } from "../DocumentViewer";
import { documentStates, getDocumentState } from "../documentStates";
import { SessionContext } from "../SessionContext";
import { PrintContext } from "../PrintContext";

export const DocumentActionsContext = React.createContext({
  add: () => {},
  view: () => {},
  edit: () => {},
  duplicate: () => {},
  setPaid: () => {},
  archive: () => {},
  cancelInvoice: () => {},
  creditNote: () => {},
});

export function DocumentActionsProvider({
  children,
  setActiveTab,
  setTabs,
  getHandleCloseTab,
}) {
  const { deleteDraft, setPaid, archive } = useContext(SessionContext);
  const { downloadDocument } = useContext(PrintContext);

  const [newDocumentIndex, setNewDocumentIndex] = useState(1);

  const add = useCallback(() => {
    const key = "new-document" + newDocumentIndex;
    setTabs((tabs) =>
      tabs.concat([
        {
          title: "Nouvelle " + newDocumentIndex,
          key,
          state: documentStates.NEW,
          component: <DocumentCreatorTab onClose={getHandleCloseTab(key)} />,
        },
      ])
    );
    setActiveTab(key);
    setNewDocumentIndex((index) => index + 1);
  }, [getHandleCloseTab, newDocumentIndex, setActiveTab, setTabs]);
  const view = useCallback(
    (document) => {
      const key = document._id;
      setTabs((tabs) =>
        !tabs.some((tab) => tab.key === key)
          ? tabs.concat([
              {
                title: document?.publicId,
                key,
                state: getDocumentState(document),
                component: (
                  <Container>
                    <DocumentViewerTab
                      document={document}
                      onClose={getHandleCloseTab(key)}
                      actions
                    />
                  </Container>
                ),
              },
            ])
          : tabs
      );
      setActiveTab(key);
    },
    [getHandleCloseTab, setActiveTab, setTabs]
  );
  const duplicate = useCallback(
    (document) => {
      const key = "new-document" + newDocumentIndex;
      setTabs((tabs) =>
        tabs.concat([
          {
            title: "Nouveau",
            key,
            state: documentStates.NEW,
            component: (
              <DocumentCreatorTab
                source={document}
                onClose={getHandleCloseTab(key)}
              />
            ),
          },
        ])
      );
      setActiveTab(key);
      setNewDocumentIndex((index) => index + 1);
    },
    [getHandleCloseTab, newDocumentIndex, setActiveTab, setTabs]
  );
  const edit = useCallback(
    (document) => {
      const key = document._id;
      setTabs((tabs) =>
        tabs.concat([
          {
            title: documentStates.DRAFT,
            key,
            state: documentStates.DRAFT,
            component: (
              <DocumentCreatorTab
                source={document}
                onClose={getHandleCloseTab(key)}
              />
            ),
          },
        ])
      );
      setActiveTab(key);
    },
    [getHandleCloseTab, setActiveTab, setTabs]
  );

  const cancelInvoice = useCallback(
    (document) => {
      const key = "cancel-and-replace-" + document._id;
      setTabs((tabs) =>
        tabs.concat([
          {
            title: `Annule ${document.publicId}`,
            key,
            state: documentStates.NEW,
            component: (
              <DocumentCreatorTab
                source={{ ...document, canceled: true }}
                onClose={getHandleCloseTab(key)}
              />
            ),
          },
        ])
      );
      setActiveTab(key);
    },
    [getHandleCloseTab, setActiveTab, setTabs]
  );

  const creditNote = useCallback(
    (document) => {
      const key = "credit-and-replace-" + document._id;
      setTabs((tabs) =>
        tabs.concat([
          {
            title: `Crédite ${document.publicId}`,
            key,
            state: documentStates.NEW,
            component: (
              <DocumentCreatorTab
                source={{ ...document, credited: true }}
                onClose={getHandleCloseTab(key)}
              />
            ),
          },
        ])
      );
      setActiveTab(key);
    },
    [getHandleCloseTab, setActiveTab, setTabs]
  );

  const documentActionContextValue = useMemo(
    () => ({
      add,
      view,
      duplicate,
      edit,
      deleteDraft,
      download: downloadDocument,
      setPaid,
      archive,
      cancelInvoice,
      creditNote,
    }),
    [
      add,
      view,
      duplicate,
      edit,
      deleteDraft,
      downloadDocument,
      setPaid,
      archive,
      cancelInvoice,
      creditNote,
    ]
  );
  return (
    <DocumentActionsContext.Provider value={documentActionContextValue}>
      {children}
    </DocumentActionsContext.Provider>
  );
}
