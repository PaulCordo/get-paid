import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { Input, Select } from "./Form";
import { templates, defaultTemplate } from "./templates";

const idTypes = ["SIREN", "SIRET", "RNA"];

const defaultClient = {
  name: "",
  idType: idTypes[0],
  idNumber: "",
  addressLine1: "",
  addressLine2: "",
  zipCode: "",
  city: "",
  tel: "",
  email: "",
};

const defaultUser = {
  ...defaultClient,
  tax: 0,
  template: defaultTemplate.name,
  quoteFormat: "D{YYYY}-{NNN}",
  invoiceFormat: "{YYYY}{NNN}",
};

export function AccountEditor({
  account = {},
  onSave,
  onCancel,
  hideCancel,
  user,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: { ...(user ? defaultUser : defaultClient), ...account },
  });
  const isEditing = Boolean(account?.idNumber);
  const isEditingUser = isEditing && user;

  return (
    <Form onSubmit={handleSubmit(onSave)}>
      {isEditing && (
        <Form.Control type="hidden" {...register("_id", { required: true })} />
      )}
      <section className="mb-4">
        <Row>
          <Col as="h2">Identification</Col>
          <Col sm="auto">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid}
              title={
                isEditing ? "Sauvegarder le client" : "Créer le nouveau client"
              }
            >
              {isEditing ? <FaSave /> : <FaCheck />}
            </Button>
            {!hideCancel && (
              <Button
                variant="warning"
                onClick={onCancel}
                size="lg"
                className="ms-3"
                title="Annuler"
              >
                <FaTimes />
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Input
            as={Col}
            sm={12}
            md={5}
            className="mb-3"
            name="name"
            label="Nom de la société"
            required
            placeholder="Nom"
            readOnly={isEditingUser}
            register={register}
          />
          <Select
            as={Col}
            sm={4}
            md={{ span: 2, offset: 1 }}
            className="mb-3"
            name="idType"
            label="Type"
            required
            disabled={isEditingUser}
            options={idTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            control={control}
          />
          <Input
            as={Col}
            sm={8}
            md={4}
            className="mb-3"
            name="idNumber"
            type="text"
            label="Immatriculation"
            required
            placeholder="Numéro structure"
            readOnly={isEditingUser}
            register={register}
          />
        </Row>
        <Row>
          <Input
            as={Col}
            md={6}
            className="mb-3"
            name="tel"
            type="tel"
            label="Téléphone"
            placeholder="+33 6 66 66 66 66"
            register={register}
          />
          <Input
            as={Col}
            md={6}
            className="mb-3"
            name="email"
            type="email"
            label="Courriel"
            placeholder="gatsby@lemagnifique.com"
            register={register}
          />
        </Row>
      </section>
      <section className="mb-4">
        <h2>Adresse</h2>
        <Row>
          <Input
            as={Col}
            md={8}
            className="mb-3"
            name="addressLine1"
            required
            label="Adresse ligne 1"
            placeholder="Rue de Notre Dame"
            register={register}
          />
        </Row>
        <Row>
          <Input
            as={Col}
            md={8}
            className="mb-3"
            name="addressLine2"
            label="Adresse ligne 2"
            placeholder="Optionnel"
            register={register}
          />
        </Row>
        <Row>
          <Input
            as={Col}
            sm={5}
            md={3}
            className="mb-3"
            name="zipCode"
            required
            label="Code postal"
            placeholder="75001"
            register={register}
          />
          <Input
            as={Col}
            md={{ offset: 1, span: 4 }}
            sm={{ offset: 1, span: 6 }}
            className="mb-3"
            name="city"
            required
            label="Ville"
            placeholder="Paris"
            register={register}
          />
        </Row>
      </section>
      {user && (
        <section className="mb-4">
          <h2>Paramètres</h2>
          <Row>
            <Input
              as={Col}
              md={3}
              className="mb-3"
              name="tax"
              type="number"
              label="% TVA applicable"
              placeholder="ex : 20"
              register={register}
            />
          </Row>
          <Row>
            <Select
              as={Col}
              md={6}
              className="mb-3"
              name="template"
              label="Thème des documents"
              options={templates.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
              control={control}
            />
          </Row>
          <Row>
            <Input
              as={Col}
              md={5}
              className="mb-3"
              name="quoteFormat"
              type="text"
              label="Numérotation devis"
              tooltip={<UserFormatTooltipText documentName="devis" />}
              placeholder="D{YYYY}-{NNN}"
              register={register}
            />
            <Input
              as={Col}
              md={5}
              className="mb-3"
              name="invoiceFormat"
              type="text"
              label="Numérotation factures"
              tooltip={<UserFormatTooltipText documentName="factures" />}
              placeholder="{YYYY}{NNN}"
              register={register}
            />
          </Row>
        </section>
      )}
    </Form>
  );
}

const UserFormatTooltipText = ({ documentName }) => (
  <div className="text-start p-2">
    <p>
      Modifiez ici comment les numéros de vos {documentName} seront formattés.
      <br />
      Ceux ci devront au moins contenir un code relatif à l&lsquo;année en cours
      ainsi qu&lsquo;un autre ajoutant la numérotation. Ces codes sont toujours
      entourés d&lsquo;accolades {"{}"} :
    </p>
    <dl>
      <dt>{"{YYYY}, {YYY} ou {Y}"}</dt>
      <dd>
        Ajoute l&lsquo;année en cours à 4 chiffres, ex :{" "}
        {new Date().getFullYear()}
      </dd>
      <dt>{"{YY}"}</dt>
      <dd>
        Ajoute les deux derniers chiffres de l&lsquo;année en cours, ex :{" "}
        {String(new Date().getFullYear()).slice(-2)}
      </dd>
      <dt>{"{NNNN}, {NNN}, {NN} ou {N}"}</dt>
      <dd>
        Ajoute le numéro du document en cours. Le nombre de N détermine le
        nombre de chiffres à afficher. ex : {"{NNNN}"} donnera 0001 et {"{N}"}{" "}
        donnera 1 (mais affichera plus de chiffre si nécessaire)
      </dd>
    </dl>
  </div>
);

export function SmallAccountEditor({
  account = {},
  onSave,
  onCancel,
  hideCancel,
  user,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: { ...(user ? defaultUser : defaultClient), ...account },
    mode: "onChange",
  });
  const isEditing = Boolean(account?.idNumber);
  const isEditingUser = isEditing && user;
  return (
    <>
      {isEditing && (
        <Form.Control type="hidden" {...register("_id", { required: true })} />
      )}
      <Row>
        <Input
          as={Col}
          className="mb-1"
          name="name"
          required
          placeholder="Nom"
          readOnly={isEditingUser}
          register={register}
        />
      </Row>
      <Row>
        <Select
          as={Col}
          md={4}
          className="mb-1"
          name="idType"
          required
          disabled={isEditingUser}
          options={idTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
          control={control}
        />
        <Input
          as={Col}
          md={8}
          className="mb-1"
          name="idNumber"
          type="text"
          required
          placeholder="Numéro structure"
          readOnly={isEditingUser}
          register={register}
        />
      </Row>
      <Row>
        <Input
          as={Col}
          className="mb-1"
          name="addressLine1"
          required
          placeholder="Adresse ligne 1"
          register={register}
        />
      </Row>
      <Row>
        <Input
          as={Col}
          className="mb-1"
          name="addressLine2"
          placeholder="Adresse ligne 2"
          register={register}
        />
      </Row>
      <Row>
        <Input
          as={Col}
          md={5}
          className="mb-1"
          name="zipCode"
          required
          placeholder="Code postal"
          register={register}
        />
        <Input
          as={Col}
          md={{ offset: 1, span: 6 }}
          className="mb-1"
          name="city"
          required
          placeholder="Ville"
          register={register}
        />
      </Row>
      <Row>
        <Input
          as={Col}
          className="mb-1"
          name="tel"
          type="tel"
          placeholder="Numéro de téléphone"
          register={register}
        />
      </Row>
      <Row>
        <Input
          as={Col}
          className="mb-1"
          name="email"
          type="email"
          placeholder="Adresse email"
          register={register}
        />
      </Row>
      {user && (
        <>
          <Row className="mt-2">
            <Input
              as={Col}
              className="mb-1"
              name="tax"
              type="number"
              label="% TVA applicable"
              placeholder="ex : 20"
              register={register}
            />
            <Select
              as={Col}
              md={6}
              className="mb-1"
              name="template"
              label="Thème des documents"
              options={templates.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
              control={control}
            />
          </Row>

          <Row>
            <Input
              as={Col}
              md={6}
              className="mb-3"
              tooltip={<UserFormatTooltipText documentName="devis" />}
              name="quoteFormat"
              type="text"
              label="Numérotation devis"
              placeholder="D{YYYY}-{NNN}"
              register={register}
            />
            <Input
              as={Col}
              md={6}
              className="mb-3"
              tooltip={<UserFormatTooltipText documentName="facture" />}
              name="invoiceFormat"
              type="text"
              label="Numérotation factures"
              placeholder="{YYYY}{NNN}"
              register={register}
            />
          </Row>
        </>
      )}
      <Row>
        <Col sm="auto" className="ms-auto text-end">
          <Button
            onClick={handleSubmit(onSave)}
            variant="primary"
            size="sm"
            disabled={!isValid}
            title={
              isEditing ? "Sauvegarder le client" : "Créer le nouveau client"
            }
          >
            {isEditing ? <FaSave /> : <FaCheck />}
          </Button>
          {!hideCancel && (
            <Button
              variant="warning"
              onClick={onCancel}
              size="sm"
              className="ms-3"
              title="Annuler"
            >
              <FaTimes />
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}
