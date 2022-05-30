import React, { useState, useEffect } from "react";
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
import { SmallClientManager } from "../SmallClientManager";
import { ConfirmModal } from "../Modals";
import { INVOICE, QUOTE } from "../documentTypes";
import { currency } from "../numberFormat";
import { Sections } from "./Sections";
import { DocumentCreatorCloseButton } from "./DocumentCreatorCloseButton";

export function DocumentCreatorForm({
  onClose = () => {},
  document = {},
  onSubmit = () => {},
  onDraftSave = () => {},
}) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { dirtyFields, isValid },
  } = useForm({
    defaultValues: document,
    mode: "onChange",
  });

  // we have to set validUntil with setValue and not defaultValue to dirty the field
  useEffect(() => {
    document.draft &&
      document.validUntil !==
        format(add(new Date(), { months: 1 }), "yyyy-MM-dd") &&
      setValue("validUntil", document.validUntil);
  }, [document, setValue]);

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

  const [showCancelModal, setShowCancelModal] = useState(false);

  const total = watch("total");
  const tax = watch("user.tax");
  const fromQuote = watch("fromQuote");
  const _id = watch("_id");

  const cancelInvoice = watch("cancelInvoice");
  const creditForInvoice = watch("creditForInvoice");

  const saveDraft = () => onDraftSave({ ...getValues(), draft: true });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <DocumentCreatorCloseButton onClose={onClose} onDraftSave={saveDraft} />
      {_id && <Form.Control type="hidden" {...register("_id")} />}
      <Form.Control type="hidden" {...register("user", { required: true })} />
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

        {fromQuote && (
          <Col lg="4" xl="4">
            <Form.Control type="hidden" {...register("fromQuote")} />
            <Form.Group>
              <Form.Label htmlFor="fromQuote">Facture pour le devis</Form.Label>
              <Form.Control
                id="fromQuote"
                type="text"
                readOnly
                value={fromQuote.publicId}
              />
            </Form.Group>
          </Col>
        )}
        {cancelInvoice && (
          <Col lg="4" xl="4">
            <Form.Control type="hidden" {...register("cancelInvoice")} />
            <Form.Group>
              <Form.Label htmlFor="cancelInvoice">
                Annule et remplace la facture #
              </Form.Label>
              <Form.Control
                id="cancelInvoice"
                type="text"
                readOnly
                value={cancelInvoice.publicId}
              />
            </Form.Group>
          </Col>
        )}

        {creditForInvoice && (
          <Col lg="4" xl="4">
            <Form.Control type="hidden" {...register("creditForInvoice")} />
            <Form.Group>
              <Form.Label htmlFor="creditForInvoice">
                Avoir pour la facture #
              </Form.Label>
              <Form.Control
                id="creditForInvoice"
                type="text"
                readOnly
                value={creditForInvoice.publicId}
              />
            </Form.Group>
          </Col>
        )}
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
                // User can't create a quote if he wanted to bill from one or cancel/credit another invoice
                !fromQuote && !cancelInvoice && !creditForInvoice && (
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
