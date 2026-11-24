import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { obtenerUsuarios } from "../services/usuarioService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function LoginPage() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  async function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");

    if (!nickName.trim() || !password.trim()) {
      setError("Completá el nombre de usuario y la contraseña");
      return;
    }

    if (password !== "123456") {
      setError("Contraseña incorrecta");
      return;
    }
    try {
      const usuraios = await obtenerUsuarios();
      const usuario = usuraios.find((u) => u.nickName === nickName.trim());
      if (!usuario) {
        setError("Usuario no encontrado");
        return;
      }
      setUsuario(usuario);
      navigate("/", { replace: true });
    } catch {
      setError("No se pudieon consultar los usuarios");
    }
  }

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <Card.Title
                  as="h1"
                  className="text-center mb-4"
                >
                  Iniciar sesión
                </Card.Title>

                {error && (
                  <Alert variant="danger" role="alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={manejarSubmit}>
                  {/* Nombre de usuario */}
                  <Form.Group
                    className="mb-3"
                    controlId="nickName"
                  >
                    <Form.Label>
                      Nombre de usuario
                    </Form.Label>

                    <Form.Control
                      type="text"
                      value={nickName}
                      onChange={(evento) =>
                        setNickName(evento.target.value)
                      }
                      placeholder="Ingresá tu nombre de usuario"
                    />
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group
                    className="mb-4"
                    controlId="password"
                  >
                    <Form.Label>
                      Contraseña
                    </Form.Label>

                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(evento) =>
                        setPassword(evento.target.value)
                      }
                      placeholder="Ingresá tu contraseña"
                    />
                  </Form.Group>

                  {/* Botón */}
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                    >
                      Ingresar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
