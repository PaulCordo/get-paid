import React, { useState, useContext } from "react";
import Tab from "react-bootstrap/Tab";

import { SessionContext } from "./SessionContext";
import { Header } from "./Header";
import { LogIn } from "./LogIn";
import { DocumentsTab } from "./DocumentsTab";
import { Configuration } from "./Configuration";
import { usePrevious } from "./usePrevious";

export function App() {
  const { user } = useContext(SessionContext);
  const prevUserId = usePrevious(user?.id_);
  const [activeTab, setActiveTab] = useState("documents");
  user && user.id_ !== prevUserId && setActiveTab("documents");
  return user ? (
    <Tab.Container
      activeKey={activeTab}
      id="document-tabs"
      onSelect={setActiveTab}
      mountOnEnter
    >
      <Header setActiveTab={setActiveTab} activeTab={activeTab} />
      <Tab.Content>
        <Tab.Pane eventKey="documents">
          <DocumentsTab />
        </Tab.Pane>
        <Tab.Pane eventKey="configuration">
          <Configuration />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  ) : (
    <LogIn />
  );
}
