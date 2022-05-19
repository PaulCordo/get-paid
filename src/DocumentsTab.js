import React, { useState, useCallback } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import { FaHome } from "react-icons/fa";

import { AllDocuments } from "./AllDocuments";
import { variantByState } from "./documentStates";
import { DocumentActionsProvider } from "./DocumentActionsContext";

export function DocumentsTab() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  // return a callback that'll close a given tab identified by its key
  const getHandleCloseTab = useCallback(
    (key) => () => {
      setTabs((tabs) => tabs.filter((tab) => tab.key !== key));
      setActiveTab("all");
    },
    []
  );
  return (
    <DocumentActionsProvider
      setActiveTab={setActiveTab}
      setTabs={setTabs}
      getHandleCloseTab={getHandleCloseTab}
    >
      <Tab.Container
        activeKey={activeTab}
        id="document-tabs"
        onSelect={setActiveTab}
      >
        <Nav
          className="position-fixed start-0 py-3 px-2 border-end-1 d-print-none"
          style={{ width: 160 }}
        >
          <Nav.Item
            as={Button}
            key="all"
            onClick={() => setActiveTab("all")}
            variant={(activeTab !== "all" ? "outline-" : "") + "dark"}
            className="w-100 mb-2"
          >
            <FaHome />
          </Nav.Item>
          {tabs &&
            tabs.map(({ key, title, state }) => (
              <Nav.Item
                as={Button}
                key={key}
                onClick={() => setActiveTab(key)}
                variant={
                  (activeTab !== key ? "outline-" : "") + variantByState[state]
                }
                className="w-100 mb-2"
              >
                {title}
              </Nav.Item>
            ))}
        </Nav>

        <main
          className="d-print-none position-relative"
          style={{ marginLeft: 164 }}
        >
          <Tab.Content>
            <Tab.Pane eventKey="all" className="pt-3 me-3">
              <AllDocuments />
            </Tab.Pane>
            {tabs &&
              tabs.map(({ key, component }) => (
                <Tab.Pane
                  key={key}
                  eventKey={key}
                  className="h-100"
                  style={{ marginRight: 164 }}
                >
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
        </main>
      </Tab.Container>
    </DocumentActionsProvider>
  );
}
