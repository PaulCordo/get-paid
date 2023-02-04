import React, { useState, useContext, useEffect } from "react";
import Tab from "react-bootstrap/Tab";

import { StoreContext } from "./StoreContext";
import { Header } from "./Header";
import { LogIn } from "./LogIn";
import { DocumentsTab } from "./DocumentsTab";
import { Configuration } from "./Configuration";
import { usePrevious } from "./usePrevious";

export function App() {
  const { company } = useContext(StoreContext);
  const prevUserId = usePrevious(company?._id);
  const [activeTab, setActiveTab] = useState("documents");
  useEffect(() => {
    company && company._id !== prevUserId && setActiveTab("documents");
  }, [prevUserId, company]);

  return company ? (
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
          <Configuration close={() => setActiveTab("documents")} />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  ) : (
    <LogIn />
  );
}
