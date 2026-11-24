import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { obtenerUsuarios } from "../services/usuarioService";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const PASSWORD_FIJA = "123456";

type ErroresLogin = {
  nickName?: string;
  password?: string;
};

export default function LoginPage() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Si venía de una ruta protegida, volvemos ahí después de iniciar sesión
  const desde: string = location.state?.desde ?? "/";

  function validar(): ErroresLogin {
    const nuevosErrores: ErroresLogin = {};

    if (!nickName.trim()) {
      nuevosErrores.nickName = "Ingresá tu nombre de usuario.";
    }

    if (!password) {
      nuevosErrores.password = "Ingresá tu contraseña.";
    } else if (password !== PASSWORD_FIJA) {
      nuevosErrores.password = "Contraseña incorrecta.";
    }

    return nuevosErrores;
  }

  async function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      setCargando(true);
      const usuarios = await obtenerUsuarios();
      const usuario = usuarios.find((u) => u.nickName === nickName.trim());

      if (!usuario) {
        setErrores({ nickName: "No existe un usuario con ese nombre." });
        return;
      }

      setUsuario(usuario);
      navigate(desde, { replace: true });
    } catch {
      setError("No se pudieron consultar los usuarios. ¿Está corriendo la API?");
    } finally {
      setCargando(false);
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

                <Form onSubmit={manejarSubmit} noValidate>
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
                      isInvalid={!!errores.nickName}
                      disabled={cargando}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.nickName}
                    </Form.Control.Feedback>
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
                      isInvalid={!!errores.password}
                      disabled={cargando}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Botón */}
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
                          Ingresando...
                        </>
                      ) : (
                        "Ingresar"
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                <p className="text-center mb-0">
                  ¿No tenés cuenta?{" "}
                  <Link to="/registro">
                    Registrate acá
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
