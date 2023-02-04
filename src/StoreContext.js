import React, { useCallback, useState, useContext } from "react";
import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/dexie";
import { RxDBReplicationCouchDBNewPlugin } from "rxdb/plugins/replication-couchdb-new";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

import { accountSchema, documentSchema, companySchema } from "./schemas";
import { INVOICE } from "./documentTypes";
import { NotificationContext } from "./NotificationContext";
import {
  getDocumentPublicId,
  getUserCompanyName,
  logInUser,
  tryUpdateBilledQuote,
  tryUpdateCanceledInvoice,
  tryUpdateCreditedInvoice,
  tryUpdateDraftOrInsert,
} from "./dbServices";

addRxPlugin(RxDBReplicationCouchDBNewPlugin);
addRxPlugin(RxDBUpdatePlugin);

export const StoreContext = React.createContext({
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
  archive: () => {},
});

export function StoreProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentsReplicationState, setDocumentsReplicationState] = useState();

  const { pushError } = useContext(NotificationContext);

  const [database, setDatabase] = useState();

  const open = useCallback(
    async ({ name, password }) => {
      try {
        await logInUser(name, password);
        const companyName = await getUserCompanyName(name);

        //init DB
        const database = await createRxDatabase({
          name: companyName,
          storage: getRxStorageDexie(),
        });
        const collections = await database.addCollections({
          clients: {
            schema: accountSchema,
          },
          documents: {
            schema: documentSchema,
          },
          company: { schema: companySchema },
        });
        const documentsReplicationState = collections.documents.syncCouchDBNew({
          url: `${process.env.REACT_APP_COUCHDB_URL}/documents`,
        });
        await Promise.all(
          [
            documentsReplicationState,
            collections.clients.syncCouchDBNew({
              url: `${process.env.REACT_APP_COUCHDB_URL}/clients`,
            }),
            collections.company.syncCouchDBNew({
              url: `${process.env.REACT_APP_COUCHDB_URL}/company`,
            }),
          ].map(async (replicationState) => {
            replicationState.error$.subscribe((error) => {
              console.dir(error);
            });
            return replicationState.awaitInSync();
          })
        );
        collections.documents.$.subscribe(async () =>
          setDocuments(await collections.documents.find().exec())
        );
        collections.clients.$.subscribe(async () =>
          setClients(await collections.clients.find().exec())
        );
        collections.company.$.subscribe(async () =>
          setCompany(await collections.company.findOne().exec())
        );
        setDocuments(await collections.documents.find().exec());
        setClients(await collections.clients.find().exec());
        setCompany(await collections.company.findOne().exec());
        setDocumentsReplicationState(documentsReplicationState);
        setDatabase(database);
      } catch (err) {
        pushError(err);
        console.error(err);
      }
    },
    [pushError]
  );
  const close = useCallback(
    async (remove) => {
      remove ? await database.remove() : await database.destroy();
      setDatabase();
      setCompany(null);
      setDocuments([]);
      setClients([]);
    },
    [database]
  );
  //
  //
  const saveCompany = useCallback(
    async (user) => await database.company.upsert(user),
    [database?.company]
  );
  const saveClient = useCallback(
    async (client) => {
      await database.clients.upsert(client);
    },
    [database?.clients]
  );

  const deleteClient = useCallback(
    async (client) => {
      await database.clients.findOne(client._id).remove();
    },
    [database?.clients]
  );

  const createDocument = useCallback(
    async (document) => {
      if (!document.draft) {
        documentsReplicationState.reSync();
        await documentsReplicationState.awaitInSync();
        const documentYear = document.date.slice(0, 4);
        const { number } = await database.documents
          .findOne({
            selector: {
              date: {
                $lt: (Number(documentYear) + 1).toString().padStart(4, "0"),
                $gte: documentYear,
              },
              type: document.type,
            },
            sort: { number: "desc" },
          })
          .exec();
        document.number = !number ? 1 : number + 1;
        const company = await database.company.findOne();
        const format =
          document.type === INVOICE
            ? company.invoiceFormat
            : company.quoteFormat;
        document.publicId = getDocumentPublicId(
          format,
          documentYear,
          document.number
        );
      }
      await Promise.all([
        tryUpdateDraftOrInsert(document, database),
        tryUpdateBilledQuote(document, database),
        tryUpdateCanceledInvoice(document, database),
        tryUpdateCreditedInvoice(document, database),
      ]);
      setDocuments(await database.documents.find().exec());
    },
    [database, documentsReplicationState]
  );

  const deleteDraft = useCallback(async (document) => {
    if (document.draft) {
      await document.remove();
    }
  }, []);

  const setPaid = useCallback(async (document, paid) => {
    await document.update({ $set: { paid } });
  }, []);

  const archive = useCallback(async (document, archived) => {
    await document.update({ $set: { archived } });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        user: company,
        clients,
        documents,
        open,
        close,
        saveUser: saveCompany,
        saveClient,
        deleteClient,
        createDocument,
        deleteDraft,
        setPaid,
        archive,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
