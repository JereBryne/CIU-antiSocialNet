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

  useEffect(() => {
    if (!id) return;

    async function cargarPublicacion(postId: string) {
      setPublicacion(null);
      setError("");

      try {
        const datos = await obtenerPublicacion(postId);
        const imagenesDelPost = await obtenerImagenes(postId);
        const comentariosDelPost = await obtenerComentarios(postId);

        setPublicacion(datos);
        setImagenes(imagenesDelPost);
        setComentarios(comentariosDelPost);
      } catch {
        setError("No se pudo cargar la publicación");
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
      setErrorComentario("El comentario no puede estar vacío.");
      return;
    }

    try {
      setEnviandoComentario(true);
      await crearComentario(nuevoComentario.trim(), Number(id), usuario.id);
      setNuevoComentario("");

      const comentariosActualizados = await obtenerComentarios(id);
      setComentarios(comentariosActualizados);
    } catch {
      setErrorComentario("No se pudo agregar el comentario.");
    } finally {
      setEnviandoComentario(false);
    }
  }

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

      <h2>Comentarios ({comentarios.length})</h2>
      {comentarios.length === 0 && <p>Todavía no hay comentarios.</p>}
      <ul>
        {comentarios.map((comentario) => (
          <li key={comentario.id}>
            <strong>{comentario.User?.nickName ?? "Usuario"}: </strong>
            {comentario.content}
          </li>
        ))}
      </ul>

      {usuario ? (
        <form onSubmit={manejarComentarioSubmit}>
          <div>
            <label htmlFor="nuevoComentario">Agregar un comentario:</label>
            <textarea
              id="nuevoComentario"
              rows={3}
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Escribí tu comentario..."
            />
          </div>
          {errorComentario && <p role="alert">{errorComentario}</p>}
          <button type="submit" disabled={enviandoComentario}>
            {enviandoComentario ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p>
          <Link to="/login">Iniciá sesión</Link> para dejar un comentario.
        </p>
      )}
    </main>
  );
}