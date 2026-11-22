import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerPublicacion } from "../services/publicacionService";
import type { Publicacion } from "../types/Publicacion";
import type { ImagenPublicacion } from "../types/ImagenPublicacion";
import { obtenerImagenes } from "../services/imagenService";
import type { Comentario } from "../types/Comentario";
import { obtenerComentarios } from "../services/comentarioService";

export default function DetallePublicacionPage() {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [error, setError] = useState("");
  const [imagenes, setImagenes] = useState<ImagenPublicacion[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    if (!id) return;

    async function cargarPublicacion(id: string) {
      setPublicacion(null);
      setError("");

      try {
        const datos = await obtenerPublicacion(id);
        const imagenesDelPost = await obtenerImagenes(id);
        const comentariosDelPost = await obtenerComentarios(id);

        setPublicacion(datos);
        setImagenes(imagenesDelPost);
        setComentarios(comentariosDelPost);
      } catch {
        setError("No se pudo cargar la publicación");
      }
    }

    cargarPublicacion(id);
  }, [id]);

  if (error) return <p role="alert">{error}</p>;
  if (!publicacion) return <p>Cargando publicación...</p>;

  return (
    <main>
      <h1>Publicación de {publicacion.User.nickName}</h1>
      <p>{publicacion.description}</p>
      <ul>
        {publicacion.Tags.map((etiqueta) => (
          <li key={etiqueta.id}>{etiqueta.name}</li>
        ))}
      </ul>
      {imagenes.map((imagen, indice) => (
        <img
          key={imagen.id}
          src={imagen.url}
          alt={`Imagen ${indice + 1} de la publicación`}
        />
      ))}
      <h2>Comentarios({comentarios.length})</h2>
      {comentarios.length === 0 && <p>Todavia no hay comentarios.</p>}
      <ul>
        {comentarios.map((comentario) => (
          <li key={comentario.id}>
            <strong>{comentario.User.nickName}</strong>
            {""}
            {comentario.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
