import { Link } from "react-router-dom";
import type { Publicacion } from "../types/Publicacion";
import { useEffect, useState } from "react";
import { obtenerImagenes } from "../services/imagenService";
import { obtenerComentarios } from "../services/comentarioService";
import type { ImagenPublicacion } from "../types/ImagenPublicacion";

import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

type PublicacionCardProps = {
  publicacion: Publicacion;
};

export default function PublicacionCard({ publicacion }: PublicacionCardProps) {
  const id = String(publicacion.id);
  const [imagenes, setImagenes] = useState<ImagenPublicacion[]>([]);
  const [cantidadComentarios, setCantidadComentarios] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const imagenesDelPost = await obtenerImagenes(id);
        setImagenes(imagenesDelPost);

        const comentarios = await obtenerComentarios(id);
        setCantidadComentarios(comentarios.length);
      } catch {
        setError("No se pudieron cargar todos los datos de la publicación");
      }
    }

    cargarDatos();
  }, [id]);
  return (
    <Card className="h-100 shadow-sm card-hover">
      {/* Imagen principal de la publicación */}
      {imagenes.length > 0 && (
        <Card.Img
          variant="top"
          src={imagenes[0].url}
          alt="Imagen principal de la publicación"
          className="post-card-img"
        />
      )}

      <Card.Body className="d-flex flex-column">
        {/* Usuario que realizó la publicación */}
        <Card.Title>
          {publicacion.User.nickName}
        </Card.Title>

        {/* Descripción de la publicación */}
        <Card.Text className="post-card-text">
          {publicacion.description}
        </Card.Text>

        {/* Etiquetas */}
        <div className="mb-3">
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

        {/* Si existen más imágenes, lo informamos */}
        {imagenes.length > 1 && (
          <Card.Text className="text-muted">
            + {imagenes.length - 1}{" "}
            {imagenes.length - 1 === 1
              ? "imagen más"
              : "imágenes más"}
          </Card.Text>
        )}

        {/* Mensaje de error */}
        {error && (
          <Alert variant="warning" role="alert">
            {error}
          </Alert>
        )}

        {/* Cantidad de comentarios */}
        {cantidadComentarios !== null ? (
          <Card.Text className="text-muted">
            Comentarios: {cantidadComentarios}
          </Card.Text>
        ) : (
          !error && (
            <Card.Text className="text-muted">
              Cargando comentarios...
            </Card.Text>
          )
        )}

        {/* Enlace al detalle completo */}
        <div className="mt-auto">
          <Link
            to={`/post/${publicacion.id}`}
            className="btn btn-primary w-100"
          >
            Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}


