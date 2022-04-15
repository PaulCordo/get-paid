import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import {
  FaEye,
  FaFileDownload,
  FaCopy,
  FaEdit,
  FaTrash,
  FaMoneyCheckAlt,
  FaEuroSign,
  FaSlash,
} from "react-icons/fa";

import { DocumentActionsContext } from "./DocumentActionsContext";
import { isDocumentOverdue, isDocumentPaid } from "./documentPaid";
import { getDocumentState, documentStates } from "./documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

export function DocumentActionButtons({
  document,
  size = "sm",
  canView = true,
}) {
  const documentState = getDocumentState(document);
  const { view, duplicate, edit, deleteDraft, download, setPaid } = useContext(
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
            variant="secondary"
            className="me-3"
            title="Télécharger"
            size={size}
          >
            <FaFileDownload />
          </Button>
          <Button
            onClick={() => duplicate(document)}
            variant="warning"
            className="me-3"
            title="Dupliquer"
            size={size}
          >
            <FaCopy />
          </Button>
          {isDocumentPaid(document) ? (
            <Button
              onClick={() => setPaid(document, false)}
              variant={
                isDocumentOverdue(document)
                  ? "outline-warning"
                  : "outline-secondary"
              }
              title="Marquer impayée"
              size={size}
            >
              <FaEuroSign />
              <FaSlash style={{ marginLeft: "-1em" }} />
            </Button>
          ) : (
            <Button
              onClick={() => setPaid(document, true)}
              variant="outline-success"
              title="Marquer payée"
              size={size}
            >
              <FaEuroSign />
            </Button>
          )}
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
            variant="secondary"
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
