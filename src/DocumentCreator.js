import React, { useContext, useState, useMemo, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Table from "react-bootstrap/Table";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { format, add } from "date-fns";

import { SessionContext } from "./SessionContext";
import { SmallClientManager } from "./SmallClientManager";
import { ConfirmModal } from "./Modals";
import { DetailRow } from "./DetailRow";
import { INVOICE, QUOTE } from "./documentTypes";
import { variantByState } from "./documentStates";

export function DocumentCreator({ onClose = () => {}, document: sourceDoc }) {
  const { user, createDocument } = useContext(SessionContext);
  const [title, setTitle] = useState("");
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
  const [details, setDetails] = useState([]);
  const [type, setType] = useState(INVOICE);
  const [draftId, setDraftId] = useState(undefined);
  const [quoteId, setQuoteId] = useState(undefined);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [totals, setTotals] = useState([0]);
  const total = useMemo(
    () => totals.reduce((total, t) => total + t, 0),
    [totals]
  );
  const isDocumentValid = useMemo(
    () => title && date && client && details.length > 0,
    [title, date, client, details]
  );
  const document = useMemo(() => {
    const base = {
      _id: draftId,
      date,
      title,
      details,
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
    details,
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
        date,
        client,
        details,
        _id,
        type,
        draft,
        validUntil,
        payUntil,
      } = sourceDoc;
      const isInvoiceFromQuote = type === QUOTE && !draft;
      title && setTitle(title);
      date && !isInvoiceFromQuote && setDate(date);
      client && setClient(client);
      type && setType(isInvoiceFromQuote ? INVOICE : type);
      if (details) {
        setDetails(details.map((detail) => ({ ...detail })));
        setTotals(details.map(({ quantity, price }) => quantity * price));
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
    <Container className="document-create pt-5 h-100">
      <Row className="document-head">
        <Col className="document-head-left">
          {!quoteId && (
            <ToggleButtonGroup
              className="mb-3"
              size="lg"
              name="document-type"
              value={type}
            >
              {[INVOICE, QUOTE].map((docType) => (
                <ToggleButton
                  key={docType}
                  type="radio"
                  variant={variantByState[docType]}
                  name="document-type"
                  value={docType}
                  onChange={() => setType(docType)}
                >
                  {docType}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
          <Form.Group>
            <Form.Label>Pour </Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
              placeholder="Prestation fournie"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Le </Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={({ target: { value } }) => setDate(value)}
              placeholder="Date"
            />
          </Form.Group>
          {type === QUOTE && (
            <Form.Group>
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
            <Form.Group>
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
          <div className="mt-3">
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
          </div>
        </Col>
        <Col md={{ offset: 3 }}>
          <h3>Client</h3>
          <SmallClientManager onChange={setClient} client={client} />
        </Col>
      </Row>
      <div className="document-detail mt-5">
        <Table striped>
          <thead>
            <tr>
              <th scope="col" className="w-50 border-top-0">
                Dénomination
              </th>
              <th scope="col" className="border-top-0">
                Prix unitaire
              </th>
              <th scope="col" className="border-top-0">
                Quantité
              </th>
              <th scope="col" className="border-top-0">
                Total
              </th>
              <th
                scope="col"
                className="border-top-0"
                style={{ width: "7.5rem" }}
              >
                Modifier
              </th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <DetailRow
                key={detail.name + detail.price + detail.quantity}
                detail={detail}
                onDelete={() =>
                  setDetails((details) => details.filter((d) => d !== detail))
                }
                onSave={(updatedDetail) => {
                  setDetails((details) =>
                    details.map(detail, (i) =>
                      i === index ? updatedDetail : detail
                    )
                  );
                  setTotals((totals) =>
                    totals.map(total, (i) =>
                      i === index
                        ? updatedDetail.price * updatedDetail.quantity
                        : total
                    )
                  );
                }}
                onTotalChange={(total) =>
                  setTotals((totals) =>
                    totals.map((t, i) => (i === index ? total : t))
                  )
                }
              />
            ))}
            <DetailRow
              onSave={(detail) => {
                setDetails((details) => details.concat([detail]));
                setTotals((totals) => totals.concat([0]));
              }}
              onTotalChange={(total) =>
                setTotals((totals) =>
                  totals.map((t, i) => (i === totals.length - 1 ? total : t))
                )
              }
            />
            <tr>
              <th colSpan="3" scope="row" className="text-end">
                Total HT
              </th>
              <td colSpan="2">{total}€</td>
            </tr>
            <tr>
              <th colSpan="3" scope="row" className="text-end">
                Total TTC
              </th>
              <td colSpan="2">{total}€</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
