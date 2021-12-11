import React, { useMemo, useState, useCallback, useContext } from "react";
import Container from "react-bootstrap/Container";

import { DocumentCreator } from "./DocumentCreator";
import { DocumentViewer } from "./DocumentViewer";
import { documentStates, getDocumentState } from "./documentStates";
import { SessionContext } from "./SessionContext";
import { PrintContext } from "./PrintContext";

export const DocumentActionsContext = React.createContext({
  add: () => {},
  view: () => {},
  edit: () => {},
  duplicate: () => {},
});

export function DocumentActionsProvider({
  children,
  setActiveTab,
  setTabs,
  getHandleCloseTab,
}) {
  const { deleteDraft } = useContext(SessionContext);
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
          component: <DocumentCreator onClose={getHandleCloseTab(key)} />,
        },
      ])
    );
    setActiveTab(key);
    setNewDocumentIndex((index) => index + 1);
  }, [getHandleCloseTab, newDocumentIndex, setActiveTab, setTabs]);
  const view = useCallback(
    (document) => {
      const key = document._id;
      setActiveTab(key);
      setTabs((tabs) =>
        !tabs.some((tab) => tab.key === key)
          ? tabs.concat([
              {
                title: document?.number ?? document?.date,
                key,
                state: getDocumentState(document),
                component: (
                  <Container className="pt-5">
                    <DocumentViewer
                      document={document}
                      onClose={getHandleCloseTab(key)}
                    />
                  </Container>
                ),
              },
            ])
          : tabs
      );
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
              <DocumentCreator
                document={document}
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
              <DocumentCreator
                document={document}
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
    }),
    [add, view, duplicate, edit, deleteDraft, downloadDocument]
  );
  return (
    <DocumentActionsContext.Provider value={documentActionContextValue}>
      {children}
    </DocumentActionsContext.Provider>
  );
}
