import React, { useState, useContext, useEffect } from "react";
import Tab from "react-bootstrap/Tab";

import { SessionContext } from "./SessionContext";
import { Header } from "./Header";
import { LogIn } from "./LogIn";
import { DocumentsTab } from "./DocumentsTab";
import { Configuration } from "./Configuration";
import { usePrevious } from "./usePrevious";
import { request } from "./apiServices";

export function App() {
  const { open } = useContext(SessionContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    request("user-list").then(setUsers);
  }, []);
  // auto open session if there's only one user
  useEffect(() => {
    users?.length === 1 && open(users.find(() => true)._id);
  }, [open, users]);

  const { user } = useContext(SessionContext);
  const prevUserId = usePrevious(user?._id);
  const [activeTab, setActiveTab] = useState("documents");
  useEffect(() => {
    user && user._id !== prevUserId && setActiveTab("documents");
  }, [prevUserId, user]);
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
    <LogIn users={users} />
  );
}
