import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export function ConfirmModal({ show, children, onConfirm, onCancel }) {
  return (
    <Modal show={show} onEscapeKeyDown={onCancel} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <h3>Confirmation</h3>
      </Modal.Header>
      <Modal.Body>
        {children}
        <div className="text-end">
          <Button variant="warning" className="me-3" onClick={onConfirm}>
            Oui
          </Button>
          <Button variant="outline-secondary" onClick={onCancel}>
            Non
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
