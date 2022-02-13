import React, { useContext, useState, useMemo, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { format, add } from "date-fns";
import MDEditor from "@uiw/react-md-editor";

import { SessionContext } from "../SessionContext";
import { SmallClientManager } from "../SmallClientManager";
import { ConfirmModal } from "../Modals";
import { INVOICE, QUOTE } from "../documentTypes";
import { variantByState } from "../documentStates";
import { DetailSection } from "./DetailSection";

export function DocumentCreator({ onClose = () => {}, document: sourceDoc }) {
  const { user, createDocument } = useContext(SessionContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [validUntilPristine, setValidUntilPristine] = useState(true);
  const [validUntil, setValidUntil] = useState(
    format(add(new Date(), { months: 1 }), "yyyy-MM-dd")
  );
  const [payUntilPristine, setPayUntilPristine] = useState(true);
  const [payUntil, setPayUntil] = useState(
    format(add(new Date(), { months: 1 }), "yyyy-MM-dd")
  );
  useEffect(() => {
    if (!isNaN(Date.parse(date))) {
      payUntilPristine &&
        setPayUntil(format(add(new Date(date), { months: 1 }), "yyyy-MM-dd"));
      validUntilPristine &&
        setValidUntil(format(add(new Date(date), { months: 1 }), "yyyy-MM-dd"));
    }
  }, [date, payUntilPristine, validUntilPristine]);
  const [client, setClient] = useState(null);
  const [sections, setSections] = useState([{ title: "", rows: [], total: 0 }]);
  const [type, setType] = useState(INVOICE);
  const [draftId, setDraftId] = useState(undefined);
  const [quoteId, setQuoteId] = useState(undefined);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [totals, setTotals] = useState([0]);
  const total = totals.reduce((total, t) => total + t, 0);

  const isDocumentValid = useMemo(
    () => title && date && client && sections.length > 0,
    [title, date, client, sections]
  );
  const document = useMemo(() => {
    const base = {
      _id: draftId,
      date,
      title,
      description,
      sections,
      client,
      total,
      user,
      type,
    };
    return type === INVOICE
      ? { ...base, payUntil, quoteId }
      : { ...base, validUntil };
  }, [
    draftId,
    date,
    title,
    description,
    sections,
    client,
    total,
    user,
    type,
    validUntil,
    payUntil,
    quoteId,
  ]);

  useEffect(() => {
    if (sourceDoc) {
      const {
        title,
        description,
        date,
        client,
        sections,
        _id,
        type,
        draft,
        validUntil,
        payUntil,
      } = sourceDoc;
      const isInvoiceFromQuote = type === QUOTE && !draft;
      title && setTitle(title);
      description && setDescription(description);
      date && !isInvoiceFromQuote && setDate(date);
      client && setClient(client);
      type && setType(isInvoiceFromQuote ? INVOICE : type);
      if (sections) {
        setSections(sections.map((section) => ({ ...section })));
        setTotals(
          sections.map((section) =>
            section.reduce(
              (total, { quantity, price }) => total + quantity * price
            )
          )
        );
      }
      _id && (isInvoiceFromQuote ? setQuoteId(_id) : setDraftId(_id));
      if (draft) {
        validUntil && type === QUOTE && setValidUntil(validUntil);
        validUntil && type === QUOTE && setValidUntilPristine(false);
        payUntil && type === INVOICE && setPayUntil(payUntil);
        payUntil && type === INVOICE && setPayUntilPristine(false);
      }
    }
  }, [sourceDoc]);
  return (
    <Container className="document-create py-3 h-100">
      {!quoteId && (
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <ToggleButtonGroup
                className="d-block"
                size="md"
                name="document-type"
                type="radio"
                value={type}
                onChange={setType}
              >
                {[QUOTE, INVOICE].map((docType) => (
                  <ToggleButton
                    key={docType}
                    id={`select-type-${docType}`}
                    variant={
                      (type !== docType ? "outline-" : "") +
                      variantByState[docType]
                    }
                    name="document-type"
                    value={docType}
                  >
                    {docType}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Form.Group>
          </Col>
        </Row>
      )}
      <Row>
        <Col lg="4" xl="3">
          <Form.Group className="mb-3">
            <Form.Label>Le </Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={({ target: { value } }) => setDate(value)}
              placeholder="Date"
            />
          </Form.Group>
          {type === QUOTE && (
            <Form.Group className="mb-3">
              <Form.Label>Valide jusqu&#39;au </Form.Label>
              <Form.Control
                type="date"
                value={validUntil}
                onChange={({ target: { value } }) => {
                  setValidUntilPristine(false);
                  setValidUntil(value);
                }}
                placeholder="Date"
              />
            </Form.Group>
          )}
          {type === INVOICE && (
            <Form.Group className="mb-3">
              <Form.Label>Payable jusqu&#39;au </Form.Label>
              <Form.Control
                type="date"
                value={payUntil}
                onChange={({ target: { value } }) => {
                  setPayUntilPristine(false);
                  setPayUntil(value);
                }}
                placeholder="Date"
              />
            </Form.Group>
          )}
        </Col>
        <Col lg="8" md="12" xl="6" xxl="4">
          <Form.Group className="mb-3">
            <Form.Label>À </Form.Label>
            <SmallClientManager onChange={setClient} client={client} />
          </Form.Group>
        </Col>
        <Col lg="12" xxl="5">
          <Form.Group className="mb-3">
            <Form.Label>Pour </Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
              placeholder="Prestation fournie"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description </Form.Label>
            <MDEditor value={description} onChange={setDescription} />
          </Form.Group>
        </Col>
      </Row>
      <div className="document-detail">
        {sections.map((section, sectionIndex) => (
          <DetailSection
            key={sectionIndex}
            section={section}
            canDelete={sections.length > 1}
            onChange={(newSection) =>
              setSections((sections) =>
                sections.map((section, index) =>
                  sectionIndex === index ? newSection : section
                )
              )
            }
            onTotalChange={(total) =>
              setTotals((totals) =>
                totals.map((t, index) => (index === sectionIndex ? total : t))
              )
            }
            onDelete={() =>
              setSections((sections) =>
                sections.filter((section, index) => sectionIndex !== index)
              )
            }
            onAddNewSection={() => {
              setSections((sections) =>
                sections.concat([{ title: "", rows: [] }])
              );
              setTotals((totals) => totals.concat([0]));
            }}
          />
        ))}
      </div>
      <Card className="mt-3 w-auto">
        <Card.Body className="total text-end">
          <div>
            <b>Total HT </b>
            {total}€
          </div>
          <div>
            <b>Total TTC </b>
            {total}€
          </div>
        </Card.Body>
        <Card.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button
                variant={type === INVOICE ? "success" : "primary"}
                size="lg"
                title={type === INVOICE ? "Créer la facture" : "Créer le devis"}
                className="me-3"
                disabled={!isDocumentValid}
                onClick={() =>
                  createDocument({
                    ...document,
                    draft: false,
                  }).then(() => onClose())
                }
              >
                <FaCheck />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                title="Sauvegarder le brouillon"
                className="me-3"
                onClick={() =>
                  createDocument({
                    ...document,
                    draft: true,
                  }).then(() => onClose())
                }
              >
                <FaSave />
              </Button>
              <Button
                variant="warning"
                size="lg"
                title="Annuler"
                onClick={() => setShowCancelModal(true)}
              >
                <FaTimes />
              </Button>
              <ConfirmModal
                show={showCancelModal}
                onConfirm={onClose}
                onCancel={() => setShowCancelModal(false)}
              >
                <p>
                  Êtes-vous certains de vouloir annuler
                  {type === INVOICE ? " cette facture" : " ce devis"} ?
                </p>
              </ConfirmModal>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Container>
  );
}
