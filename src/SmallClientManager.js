import React, { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { FaTrashAlt, FaPlus, FaEdit, FaList } from "react-icons/fa";

import { SessionContext } from "./SessionContext";
import { AccountSelector } from "./AccountSelector";
import { AccountEditor } from "./AccountEditor/AccountEditor";
import { AccountDisplay } from "./AccountDisplay";
import { ConfirmModal } from "./Modals";

export function SmallClientManager({ client, onChange = () => {} }) {
  const [clientEdit, setClientEdit] = useState(!client);
  const [showDeleteClientModal, setShowClientDeleteModal] = useState(false);
  const { clients, saveClient, deleteClient } = useContext(SessionContext);
  useEffect(() => {
    setClientEdit(clients && clients.length === 0);
  }, [clients]);

  if (clientEdit)
    return (
      <AccountEditor
        small
        account={client}
        onSave={(client) => {
          saveClient(client).then(() => {
            onChange(client);
            setClientEdit(false);
          });
        }}
        onCancel={() => setClientEdit(false)}
        hideCancel={clients && clients.length === 0 && !client}
      />
    );
  return client ? (
    <>
      <AccountDisplay account={client} />
      <div className="mt-3">
        <Button
          className="me-3"
          variant="secondary"
          onClick={() => {
            onChange(null);
          }}
        >
          <FaList />
        </Button>
        <Button
          className="me-3"
          variant="warning"
          onClick={() => {
            setClientEdit(true);
          }}
        >
          <FaEdit />
        </Button>
        <Button
          className="me-3"
          variant="primary"
          onClick={() => {
            onChange(null);
            setClientEdit(true);
          }}
        >
          <FaPlus />
        </Button>
        <Button variant="danger" onClick={() => setShowClientDeleteModal(true)}>
          <FaTrashAlt />
        </Button>
        <ConfirmModal
          show={showDeleteClientModal}
          onCancel={() => setShowClientDeleteModal(false)}
          onConfirm={() => {
            setShowClientDeleteModal(false);
            deleteClient(client).then(() => onChange(null));
          }}
        >
          <p>Voulez-vous vraiment définitivement supprimer ce client ?</p>
        </ConfirmModal>
      </div>
    </>
  ) : (
    <>
      <AccountSelector onSelect={onChange} accounts={clients} />
      <Button
        variant="primary"
        className="float-end mt-3"
        onClick={() => {
          onChange(null);
          setClientEdit(true);
        }}
      >
        <FaPlus />
      </Button>
    </>
  );
}
