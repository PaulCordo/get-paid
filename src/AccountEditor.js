import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaCheck, FaTimes } from "react-icons/fa";

export function AccountEditor({ account, onSave, onCancel, hideCancel }) {
  const [name, setName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name);
      setIdType(account.idType);
      setIdNumber(account.idNumber);
      setAddressLine1(account.addressLine1);
      setAddressLine2(account.addressLine2);
      setZipCode(account.zipCode);
      setCity(account.city);
      setTel(account.tel);
      setEmail(account.email);
    }
  }, [account]);
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          name,
          idType,
          idNumber,
          addressLine1,
          addressLine2,
          zipCode,
          city,
          tel,
          email,
        });
      }}
    >
      <Form.Row>
        <Form.Group as={Col} className="mb-1">
          <Form.Control
            required
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            placeholder="Nom"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={4} className="mb-1">
          <Form.Control
            required
            type="text"
            value={idType}
            onChange={({ target: { value } }) => setIdType(value)}
            placeholder="Ex: SIRET, RNA"
          />
        </Form.Group>
        <Form.Group as={Col} md={8} className="mb-1">
          <Form.Control
            required
            type="number"
            value={idNumber}
            onChange={({ target: { value } }) => setIdNumber(value)}
            placeholder="Numéro structure"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} className="mb-1">
          <Form.Control
            required
            type="text"
            value={addressLine1}
            onChange={({ target: { value } }) => setAddressLine1(value)}
            placeholder="Adresse ligne 1"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} className="mb-1">
          <Form.Control
            type="text"
            value={addressLine2}
            onChange={({ target: { value } }) => setAddressLine2(value)}
            placeholder="Adresse ligne 2"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={5} className="mb-1">
          <Form.Control
            required
            type="text"
            value={zipCode}
            onChange={({ target: { value } }) => setZipCode(value)}
            placeholder="Code postal"
          />
        </Form.Group>
        <Form.Group as={Col} md={{ offset: 1, span: 6 }} className="mb-1">
          <Form.Control
            required
            type="text"
            value={city}
            onChange={({ target: { value } }) => setCity(value)}
            placeholder="Ville"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} className="mb-1">
          <Form.Control
            type="tel"
            value={tel}
            onChange={({ target: { value } }) => setTel(value)}
            placeholder="Numéro de téléphone"
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} className="mb-1">
          <Form.Control
            type="tel"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            placeholder="Adresse email"
          />
        </Form.Group>
      </Form.Row>
      <ButtonGroup className="float-right">
        <Button type="submit" variant="primary">
          <FaCheck />
        </Button>
        {!hideCancel && (
          <Button variant="warning" onClick={onCancel}>
            <FaTimes />
          </Button>
        )}
      </ButtonGroup>
    </Form>
  );
}
