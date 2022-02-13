import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";

import { SessionContext } from "./SessionContext";
import { AccountEditor } from "./AccountEditor";

export function Configuration() {
  const { user, saveUser } = useContext(SessionContext);
  const [cancelKey, setCancelKey] = useState(Date.now());
  return (
    <Container className="pt-4">
      <h1 className="mb-3">Configuration</h1>
      <p className="fst-italic">
        Modifiez ici les paramètres relatif à votre compte
      </p>
      <AccountEditor
        account={user}
        user
        onSave={saveUser}
        onCancel={() => setCancelKey(Date.now())}
        key={cancelKey}
      />
    </Container>
  );
}
