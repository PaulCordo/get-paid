import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";

import { StoreContext } from "./StoreContext";
import { AccountEditor } from "./AccountEditor/AccountEditor";

export function Configuration({ close = () => {} }) {
  const { user, saveUser } = useContext(StoreContext);
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
        onSave={(user) => {
          saveUser(user).then(close);
        }}
        onCancel={() => setCancelKey(Date.now())}
        key={cancelKey}
      />
    </Container>
  );
}
