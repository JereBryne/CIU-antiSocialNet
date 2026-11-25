import { useState, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";
import { crearUsuario } from "../services/usuarioService";
import { UserContext } from "../context/UserContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

type ErroresRegistro = {
  nickName?: string;
  email?: string;
};

export default function RegistroPage() {
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [error, setError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nuevosErrores: ErroresRegistro = {};

    if (!nickName.trim()) {
      nuevosErrores.nickName = "El nombre de usuario es obligatorio.";
    }

    if (!email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nuevosErrores.email = "Ingresá un email válido.";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      setCargando(true);
      const usuarioCreado = await crearUsuario(nickName.trim(), email.trim());

      // El UserProvider guarda el usuario en localStorage
      setUsuario(usuarioCreado);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al registrarse.");
      }
    } finally {
      setCargando(false);
    }
  };

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
                  Registro de usuario
                </Card.Title>

                {/* Mensaje de error */}
                {error && (
                  <Alert variant="danger" role="alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={manejarSubmit} noValidate>
                  {/* Nickname */}
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
                      onChange={(e) =>
                        setNickName(e.target.value)
                      }
                      placeholder="Ej: luna"
                      isInvalid={!!errores.nickName}
                      disabled={cargando}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.nickName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Email */}
                  <Form.Group
                    className="mb-4"
                    controlId="email"
                  >
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Ej: luna@example.com"
                      isInvalid={!!errores.email}
                      disabled={cargando}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Botón Crear cuenta */}
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={cargando}
                    >
                      {cargando ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                            aria-hidden="true"
                          />
                          Registrando...
                        </>
                      ) : (
                        "Crear cuenta"
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                <p className="text-center mb-0">
                  ¿Ya tenés cuenta?{" "}
                  <Link to="/login">
                    Iniciá sesión acá
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}