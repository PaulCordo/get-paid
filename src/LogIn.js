import React, { useState, useContext, useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { FaUserPlus, FaUserAlt } from "react-icons/fa";

import { SessionContext } from "./SessionContext";
import { AccountSelector } from "./AccountSelector";
import { AccountEditor } from "./AccountEditor";
import { request } from "./apiServices";

export function LogIn() {
  const { open } = useContext(SessionContext);
  const [selecting, setSelecting] = useState(true);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    request("user-list").then(setUsers);
  }, []);
  useEffect(() => {
    setSelecting(Boolean(users.length));
  }, [users]);
  const handleUserCreation = useCallback(
    (user) => {
      request("user-create", user).then((user) => open(user._id));
    },
    [open]
  );
  return (
    <Container
      fluid
      as="main"
      className="bg-dark d-flex justify-content-center align-items-center vh-100"
    >
      <Card style={{ minWidth: 500 }}>
        {selecting ? (
          <Card.Body>
            <Card.Title className="text-center">
              <FaUserAlt className="mb-2 d-block mx-auto" />
              Sélectionner un utilisateur
            </Card.Title>
            <AccountSelector
              onSelect={({ _id }) => open(_id)}
              accounts={users}
            />
            <Button
              variant="primary"
              className="float-end mt-3"
              onClick={() => {
                setSelecting(false);
              }}
            >
              <FaUserPlus />
            </Button>
          </Card.Body>
        ) : (
          <Card.Body>
            <Card.Title className="text-center mb-2">
              <FaUserAlt />
              <div>Créer un utilisateur</div>
            </Card.Title>
            <AccountEditor
              onSave={handleUserCreation}
              onCancel={() => {
                setSelecting(true);
              }}
              hideCancel={!users.length}
              mini
              user
            />
          </Card.Body>
        )}
      </Card>
    </Container>
  );
}
