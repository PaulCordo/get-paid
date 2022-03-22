import React, { useCallback, useState, useContext } from "react";

import { request as requestService } from "./apiServices";
import { NotificationContext } from "./NotificationContext";

export const SessionContext = React.createContext({
  user: null,
  clients: [],
  documents: [],
  configuration: {},
  open: () => {},
  close: () => {},
  saveUser: () => {},
  saveClient: () => {},
  deleteClient: () => {},
  createDocument: () => {},
  deleteDraft: () => {},
  setPaid: () => {},
});

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { pushError } = useContext(NotificationContext);
  const request = useCallback(
    (action, content) =>
      requestService(action, content).catch(pushError).catch(console.error),
    [pushError]
  );

  const open = useCallback(
    (id) =>
      request("open-session", id).then(({ user, clients, documents }) => {
        setUser(user);
        setDocuments(documents);
        setClients(clients);
      }),
    [request]
  );
  const close = useCallback(() => {
    setUser(null);
    setDocuments([]);
    setClients([]);
  }, []);

  const saveUser = useCallback(
    (user) => request("user-upsert", user).then((user) => setUser(user)),
    [request]
  );
  const saveClient = useCallback(
    (client) =>
      request("client-upsert", client).then(() =>
        request("client-list").then((clients) => setClients(clients))
      ),
    [request]
  );

  const deleteClient = useCallback(
    (client) =>
      request("client-remove", client).then(() =>
        request("client-list").then((clients) => setClients(clients))
      ),
    [request]
  );

  const createDocument = useCallback(
    (document) =>
      request("document-save", document).then(() =>
        request("document-list").then((documents) => setDocuments(documents))
      ),
    [request]
  );

  const deleteDraft = useCallback(
    (document) =>
      request("document-delete", document).then(() =>
        request("document-list").then((documents) => setDocuments(documents))
      ),
    [request]
  );

  const setPaid = useCallback(
    (document, paid) =>
      request("document-set-paid", { ...document, paid }).then(() =>
        request("document-list").then((documents) => setDocuments(documents))
      ),
    [request]
  );

  return (
    <SessionContext.Provider
      value={{
        user,
        clients,
        documents,
        open,
        close,
        saveUser,
        saveClient,
        deleteClient,
        createDocument,
        deleteDraft,
        setPaid,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
