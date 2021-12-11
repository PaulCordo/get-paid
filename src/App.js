import React, { useState, useContext, useCallback } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";

import { SessionContext } from "./SessionContext";
import { DocumentActionsProvider } from "./DocumentActionsContext";
import { Header } from "./Header";
import { Home } from "./Home";
import { LogIn } from "./LogIn";
import { variantByState } from "./documentStates";

export function App() {
  const { user } = useContext(SessionContext);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  // return a callback that'll close a given tab identified by its key
  const getHandleCloseTab = useCallback(
    (key) => () => {
      setTabs((tabs) => tabs.filter((tab) => tab.key !== key));
      setActiveTab("home");
    },
    []
  );
  return user ? (
    <DocumentActionsProvider
      setActiveTab={setActiveTab}
      setTabs={setTabs}
      getHandleCloseTab={getHandleCloseTab}
    >
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
            <Nav.Item
              as={Button}
              key="home"
              onClick={() => setActiveTab("home")}
              variant={(activeTab !== "home" ? "outline-" : "") + "dark"}
              className="w-100 mb-2"
            >
              Accueil
            </Nav.Item>
            {tabs &&
              tabs.map(({ key, title, state }) => (
                <Nav.Item
                  as={Button}
                  key={key}
                  onClick={() => setActiveTab(key)}
                  variant={
                    (activeTab !== key ? "outline-" : "") +
                    variantByState[state]
                  }
                  className="w-100 mb-2"
                >
                  {title}
                </Nav.Item>
              ))}
          </Nav>

          <main
            className="d-print-none position-relative"
            style={{ marginLeft: 164, marginRight: 164 }}
          >
            <Tab.Content>
              <Tab.Pane eventKey="home" className="pt-3">
                <Home />
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
          </main>
        </Tab.Container>
      </>
    </DocumentActionsProvider>
  ) : (
    <LogIn />
  );
}
