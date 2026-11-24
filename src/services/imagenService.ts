import type { ImagenPublicacion } from "../types/ImagenPublicacion";
import { API_URL } from "./api";

export async function obtenerImagenes( //GET imagenesByPost
  postId: string,
): Promise<ImagenPublicacion[]> {
  const respuesta = await fetch(`${API_URL}/postimages/post/${postId}`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las imágenes");
  }

  return respuesta.json();
}

export async function crearImagen( // POST postimages
  url: string,
  postId: number,
): Promise<ImagenPublicacion> {
  const respuesta = await fetch(`${API_URL}/postimages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, postId }),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo asociar la imagen ${url}`);
  }

  return respuesta.json();
}
