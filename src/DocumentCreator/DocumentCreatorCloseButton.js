import React, { useState } from "react";
import CloseButton from "react-bootstrap/CloseButton";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function DocumentCreatorCloseButton({
  onDraftSave = () => {},
  onClose = () => {},
}) {
  const [showCloseModal, setShowCloseModal] = useState(false);
  return (
    <>
      <CloseButton
        className="position-fixed end-0 my-3 me-3 fs-4"
        onClick={() => setShowCloseModal(true)}
      />

      <Modal
        show={showCloseModal}
        onEscapeKeyDown={() => setShowCloseModal(false)}
        onHide={() => setShowCloseModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <h3>Confirmation</h3>
        </Modal.Header>
        <Modal.Body>
          <p>
            Souhaitez-vous enregistrer le document en cours comme brouillon ?
          </p>
          <div className="text-end">
            <Button variant="secondary" className="me-3" onClick={onDraftSave}>
              Oui
            </Button>
            <Button variant="warning" onClick={onClose}>
              Non
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
