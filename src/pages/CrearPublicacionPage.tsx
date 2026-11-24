import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { obtenerEtiquetas } from "../services/etiquetaService";
import type { Etiqueta } from "../types/Etiqueta";
import { crearPublicacion } from "../services/publicacionService";
import { crearImagen } from "../services/imagenService";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function CrearPublicacionPage() {
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>("");
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState<Etiqueta[]>([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<number[]>([]);
  const [urlsImagenes, setUrlsImagenes] = useState<string[]>([""]);
  const [error, setError] = useState<string>("");
  const [descripcionInvalida, setDescripcionInvalida] = useState<boolean>(false);
  const [urlsInvalidas, setUrlsInvalidas] = useState<number[]>([]);
  const [cargandoEtiquetas, setCargandoEtiquetas] = useState<boolean>(true);
  const [enviando, setEnviando] = useState<boolean>(false);

  useEffect(() => {
    obtenerEtiquetas()
      .then((datos) => setEtiquetasDisponibles(datos))
      .catch(() => setError("No se pudieron cargar las etiquetas disponibles."))
      .finally(() => setCargandoEtiquetas(false));
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
    // Al corregir el campo, sacamos su mensaje de error
    setUrlsInvalidas(urlsInvalidas.filter((i) => i !== indice));
  };

  const agregarCampoImagen = () => {
    setUrlsImagenes([...urlsImagenes, ""]);
  };

  const quitarCampoImagen = (indice: number) => {
    const nuevasUrls = urlsImagenes.filter((_, i) => i !== indice);
    setUrlsImagenes(nuevasUrls);
    setUrlsInvalidas([]);
  };

  // Una URL es válida si el navegador la puede interpretar y empieza con http o https
  const esUrlValida = (texto: string) => {
    try {
      const url = new URL(texto);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usuario) {
      setError("Debés iniciar sesión para publicar.");
      return;
    }

    const descripcionVacia = !description.trim();
    const indicesInvalidos = urlsImagenes
      .map((url, indice) => ({ url: url.trim(), indice }))
      .filter(({ url }) => url.length > 0 && !esUrlValida(url))
      .map(({ indice }) => indice);

    setDescripcionInvalida(descripcionVacia);
    setUrlsInvalidas(indicesInvalidos);

    if (descripcionVacia || indicesInvalidos.length > 0) {
      return;
    }

    try {
      setEnviando(true);

      // 1. Crear publicación (POST /posts)
      const postCreado = await crearPublicacion(
        description.trim(),
        usuario.id,
        etiquetasSeleccionadas,
      );

      // 2. Asociar imágenes una por una (POST /postimages)
      const urlsValidas = urlsImagenes
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const imagenesFallidas: string[] = [];

      for (const url of urlsValidas) {
        try {
          await crearImagen(url, postCreado.id);
        } catch {
          imagenesFallidas.push(url);
        }
      }

      // 3. Ir al perfil, avisando si alguna imagen no se pudo guardar
      navigate("/perfil", {
        state: { publicacionCreada: true, imagenesFallidas },
      });
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

                <Form onSubmit={manejarSubmit} noValidate>
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
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setDescripcionInvalida(false);
                      }}
                      placeholder="¿Qué estás pensando?"
                      isInvalid={descripcionInvalida}
                      disabled={enviando}
                    />

                    <Form.Control.Feedback type="invalid">
                      La descripción es obligatoria.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Etiquetas */}
                  <div className="mb-4">
                    <p className="fw-semibold mb-2">
                      Etiquetas
                    </p>

                    {cargandoEtiquetas ? (
                      <div className="d-flex align-items-center gap-2">
                        <Spinner
                          animation="border"
                          size="sm"
                        />
                        <span className="text-muted">
                          Cargando etiquetas...
                        </span>
                      </div>
                    ) : etiquetasDisponibles.length === 0 ? (
                      <p className="text-muted small mb-0">
                        No hay etiquetas disponibles.
                      </p>
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
                            isInvalid={urlsInvalidas.includes(indice)}
                            disabled={enviando}
                          />
                          <Form.Control.Feedback type="invalid">
                            Ingresá una URL válida que empiece con http:// o https://
                          </Form.Control.Feedback>
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
