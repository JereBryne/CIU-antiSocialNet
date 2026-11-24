import { useEffect, useState } from "react";
import PublicacionCard from "../components/PublicacionCard";
import type { Publicacion } from "../types/Publicacion";
import type { Etiqueta } from "../types/Etiqueta";
import { obtenerPublicaciones } from "../services/publicacionService";
import { obtenerEtiquetas } from "../services/etiquetaService";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function HomePage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [datosPublicaciones, datosEtiquetas] = await Promise.all([
          obtenerPublicaciones(),
          obtenerEtiquetas(),
        ]);

        const ordenadas = [...datosPublicaciones].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setPublicaciones(ordenadas);
        setEtiquetas(datosEtiquetas);
      } catch {
        setError("No se pudieron cargar las publicaciones");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const publicacionesFiltradas =
    etiquetaSeleccionada === null
      ? publicaciones
      : publicaciones.filter((pub) =>
          pub.Tags.some((tag) => tag.id === etiquetaSeleccionada),
        );

  if (error) {
    return (
      <main>
        <Container className="py-5">
          <Alert variant="danger" role="alert">
            {error}. Revisá que la API esté corriendo en http://localhost:3001.
          </Alert>
        </Container>
      </main>
    );
  }

  return (
    <main>
      {/* Presentación principal */}
      <section className="bg-body-secondary py-5 mb-4">
        <Container>
          <Row className="justify-content-center">
            <Col lg={9} className="text-center">
              <h1 className="display-4 fw-bold">
                UnaHur Anti-Social Net
              </h1>

              <p className="lead mb-0">
                El espacio de la comunidad universitaria
                para compartir ideas sin algoritmos.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="pb-5">

        {/* Filtros */}
        <section className="mb-5">
          <h2 className="h4 mb-3">
            Filtrar por etiqueta
          </h2>

          <div className="d-flex flex-wrap gap-2">
            <Button
              type="button"
              variant={
                etiquetaSeleccionada === null
                  ? "primary"
                  : "outline-primary"
              }
              onClick={() =>
                setEtiquetaSeleccionada(null)
              }
            >
              Todas
            </Button>

            {etiquetas.map((etiqueta) => (
              <Button
                key={etiqueta.id}
                type="button"
                variant={
                  etiquetaSeleccionada === etiqueta.id
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() =>
                  setEtiquetaSeleccionada(etiqueta.id)
                }
              >
                #{etiqueta.name}
              </Button>
            ))}
          </div>
        </section>

        {/* Publicaciones */}
        <section>
          <h2 className="mb-4">
            Publicaciones recientes
          </h2>

          {cargando ? (
            <Row className="g-4">
              {[1, 2, 3, 4, 5, 6].map((numero) => (
                <Col key={numero} xs={12} md={6} lg={4}>
                  <Card className="h-100 shadow-sm placeholder-glow overflow-hidden">
                    <div
                      className="placeholder w-100"
                      style={{ height: 200 }}
                    />

                    <Card.Body>
                      <h5 className="placeholder col-6" />
                      <p className="placeholder col-12" />
                      <p className="placeholder col-10" />
                      <p className="placeholder col-8" />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : publicacionesFiltradas.length === 0 ? (
            <Alert variant="secondary">
              No hay publicaciones para mostrar.
            </Alert>
          ) : (
            <Row className="g-4">
              {publicacionesFiltradas.map(
                (publicacion) => (
                  <Col
                    key={publicacion.id}
                    xs={12}
                    md={6}
                    lg={4}
                  >
                    <PublicacionCard
                      publicacion={publicacion}
                    />
                  </Col>
                ),
              )}
            </Row>
          )}
        </section>
      </Container>
    </main>
  );
}