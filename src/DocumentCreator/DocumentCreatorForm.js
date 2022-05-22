import React, { useContext, useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  FaFileSignature,
  FaSave,
  FaTimes,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { format, add } from "date-fns";
import MDEditor from "@uiw/react-md-editor";
import { Controller, useForm } from "react-hook-form";

import { Input } from "../Form";
import { SessionContext } from "../SessionContext";
import { SmallClientManager } from "../SmallClientManager";
import { ConfirmModal } from "../Modals";
import { INVOICE, QUOTE } from "../documentTypes";
import { currency } from "../numberFormat";
import { Sections } from "./Sections";
import { DocumentCreatorCloseButton } from "./DocumentCreatorCloseButton";

const emptyDocument = {
  title: "",
  description: "",
  date: format(new Date(), "yyyy-MM-dd"),
  client: null,
  sections: [
    { name: "", rows: [{ name: "", price: 0, quantity: 0 }], total: 0 },
  ],
  total: 0,
  type: INVOICE,
  draft: true,
  validUntil: format(add(new Date(), { months: 1 }), "yyyy-MM-dd"),
};

function getDefaultValuesFromSourceDocument(source, user) {
  const defaultValues = { ...emptyDocument, user };
  if (source) {
    defaultValues.title = source.title;
    defaultValues.description = source.description;
    defaultValues.client = source.client;

    const fromDraft = source.draft;
    const isInvoiceFromQuote = source.type === QUOTE && !fromDraft;
    if (!isInvoiceFromQuote) {
      if (source.type) {
        defaultValues.type = source.type;
      }
      if (source.date) {
        defaultValues.date = source.date;
      }
    }
    if (source.sections) {
      defaultValues.sections = source.sections.map((section) => ({
        ...section,
      }));
    }
    if (source._id) {
      if (fromDraft) {
        defaultValues._id = source._id;
      } else if (isInvoiceFromQuote) {
        defaultValues.quoteId = source._id;
      }
    }
  }
  return defaultValues;
}

export function DocumentCreatorForm({
  onClose = () => {},
  source = {},
  onSubmit = () => {},
  onDraftSave = () => {},
}) {
  const { user } = useContext(SessionContext);
  const {
    register,
    unregister,
    control,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { dirtyFields, isValid },
  } = useForm({
    defaultValues: getDefaultValuesFromSourceDocument(source, user),
    mode: "onChange",
  });

  // we have to set validUntil with setValue and not defaultValue to dirty the field
  useEffect(() => {
    source.draft &&
      source.validUntil &&
      setValue("validUntil", source.validUntil);
  }, [source, setValue]);

  // update validUntil when date is changed and they're still untouched
  const date = watch("date");
  useEffect(() => {
    if (!isNaN(Date.parse(date))) {
      !dirtyFields.validUntil &&
        setValue(
          "validUntil",
          format(add(new Date(date), { months: 1 }), "yyyy-MM-dd")
        );
    }
  }, [date, setValue, dirtyFields.validUntil]);

  const type = watch("type");
  useEffect(() => {
    switch (type) {
      case INVOICE:
        unregister("validUntil");
        break;
      case QUOTE:
        unregister("validUntil");
        unregister("quoteId");
        break;
      default:
        break;
    }
  }, [type, unregister]);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const total = watch("total");
  const tax = watch("user.tax");
  const quoteId = watch("quoteId");
  const _id = watch("_id");

  const saveDraft = () => onDraftSave({ ...getValues(), draft: true });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <DocumentCreatorCloseButton onClose={onClose} onDraftSave={saveDraft} />
      {_id && <Form.Control type="hidden" {...register("_id")} />}
      <Form.Control type="hidden" {...register("user", { required: true })} />
      {type === INVOICE && source.quoteId && (
        <Form.Control type="hidden" {...register("quoteId")} />
      )}
      <Row>
        <Col lg="4" xl="3">
          <Input
            register={register}
            name="date"
            type="date"
            label="Le"
            placeholder="Date"
            className="mb-3"
            required
          />
        </Col>
        <Col lg="4" xl="3">
          <Input
            register={register}
            name="validUntil"
            type="date"
            label="Valide/Payable jusqu&#39;au"
            placeholder="Date"
            className="mb-3"
          />
        </Col>
      </Row>
      <Row>
        <Col lg="12" xxl="8">
          <Input
            register={register}
            name="title"
            label="Pour "
            placeholder="Prestation fournie"
            className="mb-3"
          />
          <Form.Group className="mb-3">
            <Form.Label>Description </Form.Label>

            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MDEditor value={value} onChange={onChange} />
              )}
            />
          </Form.Group>
        </Col>

        <Col lg="8" md="12" xl="6" xxl="4">
          <Form.Group className="mb-3">
            <Form.Label>À </Form.Label>
            <Controller
              name="client"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <SmallClientManager onChange={onChange} client={value} />
              )}
            />
          </Form.Group>
        </Col>
      </Row>
      <Sections {...{ control, register, setValue, getValues }} />
      <Card className="mt-3 w-auto">
        <Card.Body className="total text-end">
          <div>
            <b>Total HT </b>
            {currency.format(total)}
          </div>
          <div>
            <b>TVA {tax}% </b>
            {currency.format((total * tax) / 100)}
          </div>
          <div>
            <b>Total TTC </b>
            {currency.format(total + (total * tax) / 100)}
          </div>
        </Card.Body>
        <Card.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button
                variant="secondary"
                size="lg"
                title="Sauvegarder le brouillon"
                className="me-3"
                onClick={saveDraft}
              >
                <FaSave />
              </Button>
              {
                // User can't create a quote if he wanted to bill from one
                !quoteId && (
                  <Button
                    variant="primary"
                    size="lg"
                    title="Créer un devis"
                    className="me-3"
                    disabled={!isValid}
                    onClick={() =>
                      onSubmit({ ...getValues(), draft: false, type: QUOTE })
                    }
                  >
                    <FaFileSignature />
                  </Button>
                )
              }
              <Button
                variant="success"
                size="lg"
                title="Créer une facture"
                className="me-3"
                disabled={!isValid}
                onClick={() =>
                  onSubmit({ ...getValues(), draft: false, type: INVOICE })
                }
              >
                <FaFileInvoiceDollar />
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
                <p>Êtes-vous certains de vouloir annuler ce document ?</p>
              </ConfirmModal>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Form>
  );
}
