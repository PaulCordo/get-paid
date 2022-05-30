import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  FaEye,
  FaFileDownload,
  FaCopy,
  FaEdit,
  FaTrash,
  FaFileInvoiceDollar,
  FaEuroSign,
  FaSlash,
  FaArchive,
  FaTimesCircle,
} from "react-icons/fa";

import { DocumentActionsContext } from "./DocumentActionsContext";
import { isDocumentPaid } from "../documentPaid";
import { getDocumentState, documentStates } from "../documentStates";
const { INVOICE, QUOTE, DRAFT, OVERDUE } = documentStates;
import "./DocumentActionButtons.scss";

export function DocumentActionButtons({
  document,
  size = "sm",
  canView = true,
}) {
  const documentState = getDocumentState(document);
  const {
    view,
    duplicate,
    edit,
    deleteDraft,
    download,
    setPaid,
    archive,
    cancelInvoice,
    creditNote,
  } = useContext(DocumentActionsContext);
  const [showCancelModal, setShowCancelModal] = useState(false);
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
    // fall through
    case OVERDUE:
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
            variant="secondary"
            className="me-3"
            title="Dupliquer"
            size={size}
          >
            <FaCopy />
          </Button>
          {isDocumentPaid(document) ? (
            <Button
              onClick={() => setPaid(document, false)}
              variant="success"
              title="Marquer impayée"
              size={size}
              className="paid-button me-3"
            >
              <FaEuroSign />
            </Button>
          ) : (
            <Button
              onClick={() => setPaid(document, true)}
              variant="outline-success"
              className="me-3"
              title="Marquer payée"
              size={size}
            >
              <FaEuroSign />
            </Button>
          )}
          {!document.canceledBy && !document.creditedBy && (
            <>
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="danger"
                title="Annuler"
                size={size}
              >
                <FaTimesCircle />
              </Button>
              <Modal
                show={showCancelModal}
                onEscapeKeyDown={() => setShowCancelModal(false)}
                onHide={() => setShowCancelModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <h4>Annuler la facture #{document.publicId}</h4>
                </Modal.Header>
                <Modal.Body>
                  <p>Comment souhaitez-vous annuler ce document ?</p>
                  <div className="text-end">
                    <Button
                      variant={document.paid ? "secondary" : "success"}
                      className="me-3"
                      onClick={() => {
                        cancelInvoice(document);
                        setShowCancelModal(false);
                      }}
                    >
                      Annuler et remplacer
                    </Button>
                    <Button
                      variant={document.paid ? "success" : "secondary"}
                      onClick={() => {
                        creditNote(document);
                        setShowCancelModal(false);
                      }}
                    >
                      Créer un avoir
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          )}
          {document.canceledBy && (
            <Button
              onClick={() => archive(document, !document.archived)}
              variant="warning"
              title={document.archived ? "Désarchiver" : "Archiver"}
              size={size}
            >
              <FaArchive />
              {document.archived && <FaSlash style={{ marginLeft: "-1em" }} />}
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
            className="me-3"
            size={size}
          >
            <FaFileInvoiceDollar />
          </Button>

          <Button
            onClick={() => archive(document, !document.archived)}
            variant="warning"
            title={document.archived ? "Désarchiver" : "Archiver"}
            size={size}
          >
            <FaArchive />
            {document.archived && <FaSlash style={{ marginLeft: "-1em" }} />}
          </Button>
        </>
      );
  }
}
