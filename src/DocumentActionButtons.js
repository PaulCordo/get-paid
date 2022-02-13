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

import { DocumentActionsContext } from "./DocumentActionsContext";
import { getDocumentState, documentStates } from "./documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

export function DocumentActionButtons({
  document,
  size = "sm",
  canView = true,
}) {
  const documentState = getDocumentState(document);
  const { view, duplicate, edit, deleteDraft, download } = useContext(
    DocumentActionsContext
  );
  switch (documentState) {
    case DRAFT:
      return (
        <>
          <Button
            onClick={() => edit(document)}
            variant="secondary"
            className="me-3"
            title="Editer"
            size={size}
          >
            <FaEdit />
          </Button>
          <Button
            onClick={() => deleteDraft(document)}
            variant="danger"
            title="Supprimer"
            size={size}
          >
            <FaTrash />
          </Button>
        </>
      );
    case INVOICE:
      return (
        <>
          {canView && (
            <Button
              onClick={() => view(document)}
              variant="secondary"
              className="me-3"
              title="Voir"
              size={size}
            >
              <FaEye />
            </Button>
          )}
          <Button
            onClick={() => download(document)}
            variant="success"
            className="me-3"
            title="Télécharger"
            size={size}
          >
            <FaFileDownload />
          </Button>
          <Button
            onClick={() => duplicate(document)}
            variant="warning"
            title="Dupliquer"
            size={size}
          >
            <FaCopy />
          </Button>
        </>
      );
    case QUOTE:
      return (
        <>
          {canView && (
            <Button
              onClick={() => view(document)}
              variant="secondary"
              className="me-3"
              title="Voir"
              size={size}
            >
              <FaEye />
            </Button>
          )}
          <Button
            onClick={() => download(document)}
            variant="primary"
            className="me-3"
            title="Télécharger"
            size={size}
          >
            <FaFileDownload />
          </Button>
          <Button
            onClick={() => duplicate(document)}
            variant="success"
            title="Facturer"
            size={size}
          >
            <FaMoneyCheckAlt />
          </Button>
        </>
      );
  }
}
