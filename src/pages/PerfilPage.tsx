import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import PublicacionCard from "../components/PublicacionCard";
import { obtenerPublicaciones } from "../services/publicacionService";
import type { Publicacion } from "../types/Publicacion";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function PerfilPage() {
  const { usuario, setUsuario } = useContext(UserContext);
  const usuarioId = usuario?.id;
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (usuarioId === undefined) return;

    async function cargarPublicaciones(id: number) {
      try {
        const datos = await obtenerPublicaciones(id);
        setPublicaciones(datos);
      } catch {
        setError("No se pudieron cargar tus publicaciones");
      } finally {
        setCargando(false);
      }
    }

    cargarPublicaciones(usuarioId);
  }, [usuarioId]);

  return (
    <main>
      <Container className="py-5">
        {/* Encabezado del perfil */}
        <Row className="justify-content-center mb-5">
          <Col xs={12} lg={10}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col xs={12} md>
                    <h1 className="h2 mb-2">
                      Perfil de {usuario?.nickName}
                    </h1>

                    <p className="text-muted mb-3 mb-md-0">
                      Desde aquí podés consultar tus publicaciones.
                    </p>
                  </Col>

                  <Col
                    xs={12}
                    md="auto"
                    className="d-grid"
                  >
                    <Button
                      type="button"
                      variant="outline-danger"
                      onClick={() => setUsuario(null)}
                    >
                      Cerrar sesión
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mis publicaciones */}
        <section>
          <h2 className="mb-4">
            Mis publicaciones
          </h2>

          {/* Cargando */}
          {cargando && (
            <div className="text-center py-5">
              <Spinner
                animation="border"
                role="status"
              />

              <p className="mt-3 mb-0">
                Cargando publicaciones...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}

          {/* Usuario sin publicaciones */}
          {!cargando &&
            !error &&
            publicaciones.length === 0 && (
              <Alert variant="secondary">
                Todavía no tenés publicaciones.
              </Alert>
            )}

          {/* Grid de publicaciones */}
          {!cargando &&
            !error &&
            publicaciones.length > 0 && (
              <Row className="g-4">
                {publicaciones.map((publicacion) => (
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
                ))}
              </Row>
            )}
        </section>
      </Container>
    </main>
  );
}
