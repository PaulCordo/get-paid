import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";

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
        required
        type="text"
        {...register("id_", { required: true })}
        id="id"
        disabled={isEditingUser}
        readOnly={isEditingUser}
        className="visually-hidden"
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
        <Col>
          <h2>Identification</h2>
        </Col>
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
        <Form.Group as={Col} sm={12} md={5} className="mb-3">
          <Form.Label htmlFor="name">Nom de la société</Form.Label>
          <Form.Control
            required
            type="text"
            {...register("name", { required: true })}
            id="name"
            placeholder="Nom"
            disabled={isEditingUser}
            readOnly={isEditingUser}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          sm={4}
          md={{ span: 2, offset: 1 }}
          className="mb-3"
        >
          <Form.Label htmlFor="idType">Type</Form.Label>
          <Controller
            name="idType"
            control={control}
            render={({ field }) => (
              <Form.Select
                {...field}
                id="idType"
                disabled={isEditingUser}
                readOnly={isEditingUser}
              >
                {idTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            )}
          />
        </Form.Group>
        <Form.Group as={Col} sm={8} md={4} className="mb-3">
          <Form.Label htmlFor="idNumber">Immatriculation</Form.Label>
          <Form.Control
            required
            type="number"
            {...register("idNumber", { required: true })}
            id="idNumber"
            placeholder="Numéro structure"
            disabled={isEditingUser}
            readOnly={isEditingUser}
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md={6} className="mb-3">
          <Form.Label htmlFor="tel">Téléphone</Form.Label>
          <Form.Control
            type="tel"
            id="tel"
            {...register("tel")}
            placeholder="+33 6 66 66 66 66"
          />
        </Form.Group>
        <Form.Group as={Col} md={6} className="mb-3">
          <Form.Label htmlFor="email">Courriel</Form.Label>
          <Form.Control
            type="email"
            id="email"
            {...register("email")}
            placeholder="gatsby@lemagnifique.com"
          />
        </Form.Group>
      </Row>
    </section>
    <section className="mb-4">
      <h2>Adresse</h2>
      <Row>
        <Form.Group as={Col} md={8} className="mb-3">
          <Form.Label htmlFor="addressLine1">Adresse ligne 1</Form.Label>
          <Form.Control
            required
            type="text"
            id="addressLine1"
            {...register("addressLine1", { required: true })}
            placeholder="Rue de Notre Dame"
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md={8} className="mb-3">
          <Form.Label htmlFor="addressLine2">Adresse ligne 2</Form.Label>
          <Form.Control
            type="text"
            id="addressLine2"
            {...register("addressLine2")}
            placeholder="Optionnel"
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} sm={5} md={3} className="mb-3">
          <Form.Label htmlFor="zipCode">Code postal</Form.Label>
          <Form.Control
            required
            type="text"
            id="zipCode"
            {...register("zipCode", { required: true })}
            placeholder="75001"
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md={{ offset: 1, span: 4 }}
          sm={{ offset: 1, span: 6 }}
          className="mb-3"
        >
          <Form.Label htmlFor="city">Ville</Form.Label>
          <Form.Control
            required
            type="text"
            id="city"
            {...register("city", { required: true })}
            placeholder="Paris"
          />
        </Form.Group>
      </Row>
    </section>
    {user && (
      <section className="mb-4">
        <h2>Paramètres</h2>
        <Row>
          <Form.Group as={Col} md={3} className="mb-3">
            <Form.Label htmlFor="tax">% TVA applicable</Form.Label>
            <Form.Control
              type="number"
              id="tax"
              {...register("tax")}
              placeholder="ex : 20"
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md={6} className="mb-3">
            <Form.Label htmlFor="template">Thème des documents</Form.Label>
            <Controller
              name="template"
              control={control}
              render={({ field }) => (
                <Form.Select {...field} id="template">
                  {templates.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
          </Form.Group>
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
      <Form.Group as={Col} className="mb-1">
        <Form.Control
          required
          type="text"
          {...register("name", { required: true })}
          placeholder="Nom"
          disabled={isEditingUser}
          plaintext={isEditingUser}
          readOnly={isEditingUser}
        />
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} md={4} className="mb-1">
        <Form.Control
          required
          type="text"
          {...register("idType", { required: true })}
          placeholder="Ex: SIRET, RNA"
          disabled={isEditingUser}
          plaintext={isEditingUser}
          readOnly={isEditingUser}
        />
      </Form.Group>
      <Form.Group as={Col} md={8} className="mb-1">
        <Form.Control
          required
          type="number"
          {...register("idNumber", { required: true })}
          placeholder="Numéro structure"
          disabled={isEditingUser}
          plaintext={isEditingUser}
          readOnly={isEditingUser}
        />
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} className="mb-1">
        <Form.Control
          required
          type="text"
          {...register("addressLine1", { required: true })}
          placeholder="Adresse ligne 1"
        />
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} className="mb-1">
        <Form.Control
          type="text"
          {...register("addressLine2")}
          placeholder="Adresse ligne 2"
        />
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} md={5} className="mb-1">
        <Form.Control
          required
          type="text"
          {...register("zipCode", { required: true })}
          placeholder="Code postal"
        />
      </Form.Group>
      <Form.Group as={Col} md={{ offset: 1, span: 6 }} className="mb-1">
        <Form.Control
          required
          type="text"
          {...register("city", { required: true })}
          placeholder="Ville"
        />
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} className="mb-1">
        <Form.Control
          type="tel"
          {...register("tel")}
          placeholder="Numéro de téléphone"
        />
      </Form.Group>
    </Row>
    <Row>
      <Form.Group as={Col} className="mb-1">
        <Form.Control
          type="email"
          {...register("email")}
          placeholder="Adresse email"
        />
      </Form.Group>
    </Row>
    {user && (
      <>
        <Form.Group as={Col} className="mb-1 mt-3">
          <Form.Label htmlFor="tax">% TVA applicable</Form.Label>
          <Form.Control
            type="number"
            id="tax"
            {...register("tax")}
            placeholder="ex : 20"
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-1">
          <Form.Label htmlFor="template">Thème des documents</Form.Label>
          <Controller
            name="template"
            control={control}
            render={({ field }) => (
              <Form.Select {...field} id="template">
                {templates.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            )}
          />
        </Form.Group>
        <AccountFormButtons
          size="sm"
          className="float-end"
          onCancel={onCancel}
          isEditing={isEditing}
          hideCancel={hideCancel}
        />
      </>
    )}
  </>
);
