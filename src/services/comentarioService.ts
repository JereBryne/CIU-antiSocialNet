import type { Comentario } from "../types/Comentario";

export async function obtenerComentarios( //GET comentariosByPost
  postId: string,
): Promise<Comentario[]> {
  const respuesta = await fetch(
    `http://localhost:3001/comments/post/${postId}`,
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los comentarios");
  }

  return respuesta.json();
}
