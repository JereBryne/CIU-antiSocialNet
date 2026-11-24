import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { obtenerEtiquetas } from "../services/etiquetaService";
import type { Etiqueta } from "../types/Etiqueta";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const API_URL = "http://localhost:3001";

export default function CrearPublicacionPage() {
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>("");
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState<Etiqueta[]>([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<number[]>([]);
  const [urlsImagenes, setUrlsImagenes] = useState<string[]>([""]);
  const [error, setError] = useState<string>("");
  const [enviando, setEnviando] = useState<boolean>(false);

  useEffect(() => {
    obtenerEtiquetas()
      .then((datos) => setEtiquetasDisponibles(datos))
      .catch(() => setError("No se pudieron cargar las etiquetas disponibles."));
  }, []);

  const alternarEtiqueta = (idEtiqueta: number) => {
    if (etiquetasSeleccionadas.includes(idEtiqueta)) {
      setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter((id) => id !== idEtiqueta));
    } else {
      setEtiquetasSeleccionadas([...etiquetasSeleccionadas, idEtiqueta]);
    }
  };

  const actualizarUrlImagen = (indice: number, valor: string) => {
    const nuevasUrls = [...urlsImagenes];
    nuevasUrls[indice] = valor;
    setUrlsImagenes(nuevasUrls);
  };

  const agregarCampoImagen = () => {
    setUrlsImagenes([...urlsImagenes, ""]);
  };

  const quitarCampoImagen = (indice: number) => {
    const nuevasUrls = urlsImagenes.filter((_, i) => i !== indice);
    setUrlsImagenes(nuevasUrls);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usuario) {
      setError("Debés iniciar sesión para publicar.");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    try {
      setEnviando(true);

      // 1. Crear publicación (POST /posts)
      const respPost = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          userId: usuario.id,
          UserId: usuario.id,
          tagIds: etiquetasSeleccionadas,
        }),
      });

      if (!respPost.ok) {
        throw new Error("No se pudo crear la publicación.");
      }

      const postCreado = await respPost.json();

      // 2. Asociar imágenes una por una (POST /postimages)
      const urlsValidas = urlsImagenes
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      for (const url of urlsValidas) {
        const respImg = await fetch(`${API_URL}/postimages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            postId: postCreado.id,
            PostId: postCreado.id,
          }),
        });

        if (!respImg.ok) {
          console.error(`Error al asociar la imagen: ${url}`);
        }
      }

      navigate("/perfil");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado al publicar.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} xl={7}>
            <Card className="shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <Card.Title
                  as="h1"
                  className="text-center mb-4"
                >
                  Nueva publicación
                </Card.Title>

                <p className="text-muted text-center mb-4">
                  Compartí una idea con la comunidad.
                </p>

                {error && (
                  <Alert variant="danger" role="alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={manejarSubmit}>
                  {/* Descripción */}
                  <Form.Group
                    className="mb-4"
                    controlId="description"
                  >
                    <Form.Label className="fw-semibold">
                      Descripción
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="¿Qué estás pensando?"
                      disabled={enviando}
                    />

                    <Form.Text muted>
                      La descripción es obligatoria.
                    </Form.Text>
                  </Form.Group>

                  {/* Etiquetas */}
                  <div className="mb-4">
                    <p className="fw-semibold mb-2">
                      Etiquetas
                    </p>

                    {etiquetasDisponibles.length === 0 ? (
                      <div className="d-flex align-items-center gap-2">
                        <Spinner
                          animation="border"
                          size="sm"
                        />
                        <span className="text-muted">
                          Cargando etiquetas...
                        </span>
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-3">
                        {etiquetasDisponibles.map(
                          (etiqueta) => (
                            <Form.Check
                              key={etiqueta.id}
                              type="checkbox"
                              id={`etiqueta-${etiqueta.id}`}
                              label={`#${etiqueta.name}`}
                              checked={etiquetasSeleccionadas.includes(
                                etiqueta.id,
                              )}
                              onChange={() =>
                                alternarEtiqueta(
                                  etiqueta.id,
                                )
                              }
                              disabled={enviando}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <hr className="my-4" />

                  {/* Imágenes */}
                  <div className="mb-4">
                    <p className="fw-semibold mb-1">
                      URLs de imágenes
                    </p>

                    <p className="text-muted small">
                      Las imágenes son opcionales. Podés
                      agregar más de una.
                    </p>

                    {urlsImagenes.map((url, indice) => (
                      <Row
                        key={indice}
                        className="g-2 mb-2"
                      >
                        <Col>
                          <Form.Control
                            type="url"
                            value={url}
                            onChange={(e) =>
                              actualizarUrlImagen(
                                indice,
                                e.target.value,
                              )
                            }
                            placeholder="https://..."
                            disabled={enviando}
                          />
                        </Col>

                        {urlsImagenes.length > 1 && (
                          <Col xs="auto">
                            <Button
                              type="button"
                              variant="outline-danger"
                              onClick={() =>
                                quitarCampoImagen(indice)
                              }
                              disabled={enviando}
                            >
                              Quitar
                            </Button>
                          </Col>
                        )}
                      </Row>
                    ))}

                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="mt-2"
                      onClick={agregarCampoImagen}
                      disabled={enviando}
                    >
                      + Agregar otra imagen
                    </Button>
                  </div>

                  {/* Publicar */}
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={enviando}
                    >
                      {enviando ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                            aria-hidden="true"
                          />
                          Publicando...
                        </>
                      ) : (
                        "Publicar"
                      )}
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
