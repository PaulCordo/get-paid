import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { FaUserAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { StoreContext } from "./StoreContext";
import { Form } from "react-bootstrap";
import { Input } from "./Form";

export function LogIn() {
  const { open } = useContext(StoreContext);

  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
  });

  return (
    <Container
      fluid
      as="main"
      className="bg-dark d-flex justify-content-center align-items-center vh-100"
    >
      <Card style={{ minWidth: 500 }}>
        <Card.Body>
          <Card.Title className="text-center">
            <FaUserAlt className="mb-2 d-block mx-auto" />
            Connexion
          </Card.Title>
          <Form onSubmit={handleSubmit(open)}>
            <Input
              name="name"
              label="Nom d'utilisateur"
              placeholder="john-doe"
              className="mb-3"
              required
              register={register}
            />
            <Input
              name="password"
              label="Mot de passe"
              placeholder="john-doe"
              className="mb-3"
              type="password"
              required
              register={register}
            />
            <Button variant="primary" type="submit">
              Se connecter
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
