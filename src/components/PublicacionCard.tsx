import { Link } from "react-router-dom";
import type { Publicacion } from "../types/Publicacion";
import { useEffect, useState } from "react";
import { obtenerImagenes } from "../services/imagenService";
import { obtenerComentarios } from "../services/comentarioService";
import type { ImagenPublicacion } from "../types/ImagenPublicacion";

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
    <article>
      <h2>{publicacion.User.nickName}</h2>
      <p>{publicacion.description}</p>

      <ul>
        {publicacion.Tags.map((etiqueta) => (
          <li key={etiqueta.id}> {etiqueta.name}</li>
        ))}
      </ul>
      {imagenes.map((imagen, indice) => (
        <img
          key={imagen.id}
          src={imagen.url}
          alt={`Imagen ${indice + 1} de la publicación`}
        />
      ))}
      {error && <p role="alert">{error}</p>}
      {cantidadComentarios !== null && (
        <p>Comentarios: {cantidadComentarios}</p>
      )}
      {!error && cantidadComentarios === null && <p>Cargando comentarios...</p>}
      <Link to={`/post/${publicacion.id}`}>VEr mas</Link>
    </article>
  );
}
