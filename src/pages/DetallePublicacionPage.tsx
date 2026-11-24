import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import type { FormEvent } from "react";
import { obtenerPublicacion } from "../services/publicacionService";
import type { Publicacion } from "../types/Publicacion";
import type { ImagenPublicacion } from "../types/ImagenPublicacion";
import { obtenerImagenes } from "../services/imagenService";
import type { Comentario } from "../types/Comentario";
import {
  obtenerComentarios,
  crearComentario,
} from "../services/comentarioService";
import { UserContext } from "../context/UserContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function DetallePublicacionPage() {
  const { id } = useParams();
  const { usuario } = useContext(UserContext);

  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [error, setError] = useState("");
  const [imagenes, setImagenes] = useState<ImagenPublicacion[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [errorComentario, setErrorComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [comentarioInvalido, setComentarioInvalido] = useState(false);
  const [comentarioEnviado, setComentarioEnviado] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function cargarPublicacion(postId: string) {
      setPublicacion(null);
      setError("");

      try {
        // Las tres consultas son independientes, así que van en paralelo
        const [datos, imagenesDelPost, comentariosDelPost] = await Promise.all([
          obtenerPublicacion(postId),
          obtenerImagenes(postId),
          obtenerComentarios(postId),
        ]);

        setPublicacion(datos);
        setImagenes(imagenesDelPost);
        setComentarios(comentariosDelPost);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar la publicación",
        );
      }
    }

    cargarPublicacion(id);
  }, [id]);

  async function manejarComentarioSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorComentario("");

    if (!usuario || !id) {
      setErrorComentario("Debés iniciar sesión para comentar.");
      return;
    }

    if (!nuevoComentario.trim()) {
      setComentarioInvalido(true);
      return;
    }

    setComentarioInvalido(false);

    try {
      setEnviandoComentario(true);
      await crearComentario(nuevoComentario.trim(), Number(id), usuario.id);
      setNuevoComentario("");
      setComentarioEnviado(true);

      const comentariosActualizados = await obtenerComentarios(id);
      setComentarios(comentariosActualizados);
    } catch {
      setErrorComentario("No se pudo agregar el comentario.");
    } finally {
      setEnviandoComentario(false);
    }
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
        <Link to="/" className="btn btn-outline-secondary">
          ← Volver al inicio
        </Link>
      </Container>
    );
  }

  if (!publicacion) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />

        <p className="mt-3">
          Cargando publicación...
        </p>
      </Container>
    );
  }

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={9} xl={8}>
            <Link to="/" className="btn btn-outline-secondary mb-4">
              ← Volver al inicio
            </Link>

            {/* Publicación */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <Card.Title as="h1" className="h2 mb-3">
                  Publicación de{" "}
                  {publicacion.User.nickName}
                </Card.Title>

                <Card.Text className="fs-5">
                  {publicacion.description}
                </Card.Text>

                {/* Etiquetas */}
                <div className="mb-4">
                  {publicacion.Tags.map((etiqueta) => (
                    <Badge
                      key={etiqueta.id}
                      bg="secondary"
                      className="me-2"
                    >
                      #{etiqueta.name}
                    </Badge>
                  ))}
                </div>

                {/* Imágenes */}
                {imagenes.length > 0 && (
                  <Row className="g-3">
                    {imagenes.map((imagen, indice) => (
                      <Col
                        key={imagen.id}
                        xs={12}
                        md={imagenes.length > 1 ? 6 : 12}
                      >
                        <img
                          src={imagen.url}
                          alt={`Imagen ${indice + 1} de la publicación`}
                          className="img-fluid rounded w-100"
                          onError={(e) => {
                            // Si la URL no carga, ocultamos la imagen rota
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>

            {/* Comentarios */}
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <Card.Title as="h2" className="h4 mb-4">
                  Comentarios ({comentarios.length})
                </Card.Title>

                {comentarios.length === 0 ? (
                  <Alert
                    variant="secondary"
                    className="mb-0"
                  >
                    Todavía no hay comentarios.
                  </Alert>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {comentarios.map((comentario) => (
                      <div
                        key={comentario.id}
                        className="border rounded p-3 bg-body-secondary"
                      >
                        <strong>
                          {comentario.User?.nickName ??
                            "Usuario"}
                          :
                        </strong>{" "}
                        {comentario.content}
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Formulario de comentario */}
            {usuario ? (
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <Card.Title
                    as="h2"
                    className="h4 mb-3"
                  >
                    Agregar un comentario
                  </Card.Title>

                  {comentarioEnviado && (
                    <Alert
                      variant="success"
                      dismissible
                      onClose={() => setComentarioEnviado(false)}
                    >
                      ¡Comentario publicado!
                    </Alert>
                  )}

                  {errorComentario && (
                    <Alert
                      variant="danger"
                      role="alert"
                    >
                      {errorComentario}
                    </Alert>
                  )}

                  <Form
                    onSubmit={
                      manejarComentarioSubmit
                    }
                    noValidate
                  >
                    <Form.Group
                      className="mb-3"
                      controlId="nuevoComentario"
                    >
                      <Form.Label>
                        Comentario
                      </Form.Label>

                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={nuevoComentario}
                        onChange={(e) => {
                          setNuevoComentario(e.target.value);
                          setComentarioEnviado(false);
                          setComentarioInvalido(false);
                        }}
                        placeholder="Escribí tu comentario..."
                        isInvalid={comentarioInvalido}
                        disabled={enviandoComentario}
                      />
                      <Form.Control.Feedback type="invalid">
                        El comentario no puede estar vacío.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid d-sm-block">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={enviandoComentario}
                      >
                        {enviandoComentario ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              className="me-2"
                              aria-hidden="true"
                            />
                            Enviando...
                          </>
                        ) : (
                          "Comentar"
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="info">
                <Link to="/login" state={{ desde: `/post/${id}` }}>
                  Iniciá sesión
                </Link>{" "}
                para dejar un comentario.
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}