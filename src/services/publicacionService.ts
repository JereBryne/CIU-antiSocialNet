import type { Publicacion } from "../types/Publicacion";

export async function obtenerPublicaciones( //GET posts
  userId?: number,
): Promise<Publicacion[]> {
  let url = "http://localhost:3001/posts";

  if (userId !== undefined) {
    url = `${url}?userId=${userId}`;
  }

  const respuesta = await fetch(url);

  if (!respuesta.ok) {
    throw new Error("No se pueden obtener las publicaciones");
  }

  const datos: Publicacion[] = await respuesta.json();
  return datos;
}

export async function obtenerPublicacion(id: string): Promise<Publicacion> {
  // GET postById
  const respuesta = await fetch(`http://localhost:3001/posts/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar la publicación");
  }

  const datos: Publicacion = await respuesta.json();
  return datos;
}
