import type { Comentario } from "../types/Comentario";
import { API_URL } from "./api";

export async function obtenerComentarios(
  postId: string,
): Promise<Comentario[]> {
  const respuesta = await fetch(`${API_URL}/comments/post/${postId}`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los comentarios");
  }

  return respuesta.json();
}

export async function crearComentario(
  content: string,
  postId: number,
  userId: number,
): Promise<Comentario> {
  const respuesta = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      postId,
      PostId: postId,
      userId,
      UserId: userId,
    }),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo publicar el comentario");
  }

  return respuesta.json();
}