import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import {
  FaEye,
  FaFileDownload,
  FaCopy,
  FaEdit,
  FaTrash,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { DocumentActionsContext } from "../DocumentActionsContext";
import { getDocumentState, documentStates } from "../documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

export function ActionsCell({ value: document }) {
  const documentState = getDocumentState(document);
  const { view, duplicate, edit, deleteDraft, download } = useContext(
    DocumentActionsContext
  );

  if (documentState === DRAFT) {
    return (
      <>
        <Button
          onClick={() => edit(document)}
          variant="secondary"
          className="me-3"
          title="Editer"
        >
          <FaEdit />
        </Button>
        <Button
          onClick={() => deleteDraft(document)}
          variant="danger"
          title="Supprimer"
        >
          <FaTrash />
        </Button>
      </>
    );
  }
  if (documentState === INVOICE) {
    return (
      <>
        <Button
          onClick={() => view(document)}
          variant="secondary"
          className="me-3"
          title="Voir"
        >
          <FaEye />
        </Button>
        <Button
          onClick={() => download(document)}
          variant="success"
          className="me-3"
          title="Télécharger"
        >
          <FaFileDownload />
        </Button>
        <Button
          onClick={() => duplicate(document)}
          variant="warning"
          title="Dupliquer"
        >
          <FaCopy />
        </Button>
      </>
    );
  }
  if (documentState == QUOTE) {
    return (
      <>
        <Button
          onClick={() => view(document)}
          variant="secondary"
          className="me-3"
          title="Voir"
        >
          <FaEye />
        </Button>
        <Button
          onClick={() => download(document)}
          variant="primary"
          className="me-3"
          title="Télécharger"
        >
          <FaFileDownload />
        </Button>
        <Button
          onClick={() => duplicate(document)}
          variant="success"
          title="Facturer"
        >
          <FaMoneyCheckAlt />
        </Button>
      </>
    );
  }
}
