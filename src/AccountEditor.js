import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { Input, Select } from "./Form";
import { templates, defaultTemplate } from "./templates";

const defaultClient = {
  name: "",
  idType: "",
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
};

const idTypes = ["SIREN", "SIRET", "RNA"];

export function AccountEditor({
  account = {},
  onSave,
  onCancel,
  hideCancel,
  user,
  mini,
}) {
  const { register, control, handleSubmit } = useForm({
    defaultValues: { ...(user ? defaultUser : defaultClient), ...account },
  });

  const isEditing = Boolean(account?.idNumber);
  const isEditingUser = isEditing && user;

  return (
    <Form onSubmit={handleSubmit(onSave)}>
      <Form.Control
        type="hidden"
        {...register("_id", { required: true })}
        id="id"
      />
      {mini ? (
        <MiniAccountForm
          register={register}
          control={control}
          isEditingUser={isEditingUser}
          user={user}
          onCancel={onCancel}
          isEditing={isEditing}
          hideCancel={hideCancel}
        />
      ) : (
        <AccountForm
          register={register}
          control={control}
          isEditingUser={isEditingUser}
          user={user}
          onCancel={onCancel}
          isEditing={isEditing}
          hideCancel={hideCancel}
        />
      )}
    </Form>
  );
}
const AccountFormButtons = ({
  size,
  isEditing,
  hideCancel,
  onCancel,
  className,
}) => (
  <div className={className}>
    <Button type="submit" variant="primary" size={size}>
      {isEditing ? <FaSave /> : <FaCheck />}
    </Button>
    {!hideCancel && (
      <Button variant="warning" onClick={onCancel} size={size} className="ms-3">
        <FaTimes />
      </Button>
    )}
  </div>
);
const AccountForm = ({
  register,
  isEditingUser,
  user,
  control,
  isEditing,
  onCancel,
  hideCancel,
}) => (
  <>
    <section className="mb-4">
      <Row>
        <Col as="h2">Identification</Col>
        <Col sm="auto">
          <AccountFormButtons
            size="lg"
            onCancel={onCancel}
            isEditing={isEditing}
            hideCancel={hideCancel}
          />
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
          disabled={isEditingUser}
          register={register}
        />
        <Select
          as={Col}
          sm={4}
          md={{ span: 2, offset: 1 }}
          className="mb-3"
          name="idType"
          label="Type"
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
          type="number"
          label="Immatriculation"
          required
          placeholder="Numéro structure"
          disabled={isEditingUser}
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
      </section>
    )}
  </>
);
const MiniAccountForm = ({
  register,
  isEditingUser,
  user,
  control,
  isEditing,
  onCancel,
  hideCancel,
}) => (
  <>
    <Row>
      <Input
        as={Col}
        className="mb-1"
        name="name"
        required
        placeholder="Nom"
        disabled={isEditingUser}
        register={register}
      />
    </Row>
    <Row>
      <Select
        as={Col}
        md={4}
        className="mb-1"
        name="idType"
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
        type="number"
        required
        placeholder="Numéro structure"
        disabled={isEditingUser}
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
      <Row>
        <Input
          as={Col}
          className="mb-1 mt-3"
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
    )}
    <AccountFormButtons
      size="sm"
      className="float-end"
      onCancel={onCancel}
      isEditing={isEditing}
      hideCancel={hideCancel}
    />
  </>
);
