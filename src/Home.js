import React, { useState, useContext, useCallback } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
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
import {
  documentStates,
  getDocumentState,
  variantByState,
} from "./documentStates";

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
  return user ? (
    <>
      <Header onBrandClick={() => setActiveTab("home")} />
      <Tab.Container
        activeKey={activeTab}
        id="document-tabs"
        onSelect={setActiveTab}
      >
        <Nav
          className="position-fixed start-0 py-3 px-2 border-right-1"
          style={{ width: 160 }}
        >
          {tabs &&
            tabs.map(({ key, title, state }) => (
              <Nav.Item
                as={Button}
                key={key}
                onClick={() => setActiveTab(key)}
                variant={variantByState[state]}
                className="w-100 mb-2"
              >
                {title}
              </Nav.Item>
            ))}
        </Nav>

        <Container as="main" className="d-print-none position-relative">
          <Tab.Content>
            <Tab.Pane eventKey="home" className="pt-3">
              <Button
                variant="dark"
                title="Créer un nouveau document"
                size="lg"
                className="float-end mb-3"
                onClick={() => {
                  const key = "new-document" + newDocumentIndex;
                  setTabs((tabs) =>
                    tabs.concat([
                      {
                        title: "Nouvelle " + newDocumentIndex,
                        key,
                        state: documentStates.NEW,
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
                Créer <FaPlus />
              </Button>
              {documents && documents.length > 0 && (
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th scope="col" style={{ borderLeftWidth: 7 }}>
                        Numéro
                      </th>
                      <th scope="col">Client</th>
                      <th scope="col">Pour</th>
                      <th scope="col">Total</th>
                      <th scope="col">Date</th>
                      <th scope="col" className=" text-end">
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
                              );
                          }}
                          onDuplicate={() => {
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
                          }}
                          onDownload={() => {
                            downloadDocument(document);
                          }}
                          onEdit={() => {
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
                          }}
                          onDelete={() => {
                            deleteDraft(document);
                          }}
                        />
                      ))}
                  </tbody>
                </Table>
              )}
            </Tab.Pane>
            {tabs &&
              tabs.map(({ key, component }) => (
                <Tab.Pane key={key} eventKey={key} className="h-100">
                  <>
                    <CloseButton
                      className="position-fixed end-0 my-3 me-3 fs-4"
                      onClick={getHandleCloseTab(key)}
                    />
                    {component}
                  </>
                </Tab.Pane>
              ))}
          </Tab.Content>
        </Container>
      </Tab.Container>
    </>
  ) : (
    <LogIn />
  );
}
