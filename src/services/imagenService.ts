import type { ImagenPublicacion } from "../types/ImagenPublicacion";

export async function obtenerImagenes( //GET imagenesByPost
  postId: string,
): Promise<ImagenPublicacion[]> {
  const respuesta = await fetch(
    `http://localhost:3001/postimages/post/${postId}`,
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las imágenes");
  }

  return respuesta.json();
}
