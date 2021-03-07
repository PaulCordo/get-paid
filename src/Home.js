import { useState, useContext, useCallback } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { FaPlus } from "react-icons/fa";
import compareAsc from "date-fns/compareAsc";

import { SessionContext } from "./SessionContext";
import { PrintContext } from "./PrintContext";
import { Header } from "./Header";
import { LogIn } from "./LogIn";
import { DocumentCreator } from "./DocumentCreator";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentRow } from "./DocumentRow";

export function Home() {
  const { user, documents, deleteDraft } = useContext(SessionContext);
  const { downloadDocument } = useContext(PrintContext);
  const [newDocumentIndex, setNewDocumentIndex] = useState(1);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const getHandleCloseTab = useCallback(
    (key) => () => {
      setTabs((tabs) => tabs.filter((tab) => tab.key !== key));
      setActiveTab("home");
    },
    []
  );
  const TabTitle = useCallback(
    ({ title, onClose }) => (
      <>
        {title}
        <Button
          variant="transparent"
          className="position-absolute top right"
          aria-label="Close"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }}
        >
          <span aria-hidden="true">&times;</span>
        </Button>
      </>
    ),
    []
  );
  return user ? (
    <>
      <Header onBrandClick={() => setActiveTab("home")} />
      <Container
        as="main"
        className="d-print-none"
        style={{ height: "calc(100% - 3.5rem)" }}
      >
        <Tabs activeKey={activeTab} onSelect={setActiveTab}>
          <Tab eventKey="home" className="pt-5">
            {documents && documents.length > 0 && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th scope="col" style={{ borderLeftWidth: 7 }}>
                      Numéro
                    </th>
                    <th scope="col">Client</th>
                    <th scope="col">Pour</th>
                    <th scope="col">Total</th>
                    <th scope="col">Date</th>
                    <th scope="col" className=" text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documents
                    .sort((a, b) =>
                      compareAsc(new Date(a.date), new Date(b.date))
                    )
                    .map((document) => (
                      <DocumentRow
                        key={document._id}
                        document={document}
                        onView={() => {
                          const key = document._id;
                          setActiveTab(key);
                          !tabs.some((tab) => tab.key === key) &&
                            setTabs((tabs) =>
                              tabs.concat([
                                {
                                  title: document.type,
                                  key,
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
                            );
                        }}
                        onDuplicate={() => {
                          const key = "new-document" + newDocumentIndex;
                          setTabs((tabs) =>
                            tabs.concat([
                              {
                                title: "Nouveau",
                                key,
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
                        }}
                        onDownload={() => {
                          downloadDocument(document);
                        }}
                        onEdit={() => {
                          const key = document._id;
                          setTabs((tabs) =>
                            tabs.concat([
                              {
                                title: "Brouillon",
                                key,
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
                        }}
                        onDelete={() => {
                          deleteDraft(document);
                        }}
                      />
                    ))}
                </tbody>
              </Table>
            )}
            <Button
              variant="dark"
              title="Créer un nouveau document"
              size="lg"
              className="float-right"
              onClick={() => {
                const key = "new-document" + newDocumentIndex;
                setTabs((tabs) =>
                  tabs.concat([
                    {
                      title: "Nouvelle " + newDocumentIndex,
                      key,
                      component: (
                        <DocumentCreator onClose={getHandleCloseTab(key)} />
                      ),
                    },
                  ])
                );
                setActiveTab(key);
                setNewDocumentIndex((index) => index + 1);
              }}
            >
              <FaPlus />
            </Button>
          </Tab>
          {tabs &&
            tabs.map(({ key, title, component }) => (
              <Tab
                key={key}
                eventKey={key}
                title={
                  <TabTitle title={title} onClose={getHandleCloseTab(key)} />
                }
                className="h-100"
              >
                {component}
              </Tab>
            ))}
        </Tabs>
      </Container>
    </>
  ) : (
    <LogIn />
  );
}
