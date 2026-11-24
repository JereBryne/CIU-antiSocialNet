import type { ImagenPublicacion } from "../types/ImagenPublicacion";
import { API_URL } from "./api";

export async function obtenerImagenes( //GET imagenesByPost
  postId: string,
): Promise<ImagenPublicacion[]> {
  const respuesta = await fetch(
    `${API_URL}/postimages/post/${postId}`,
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las imágenes");
  }

  return respuesta.json();
}
