import type { Etiqueta } from "../types/Etiqueta";
import { API_URL } from "./api";

export async function obtenerEtiquetas(): Promise<Etiqueta[]> {
  const respuesta = await fetch(`${API_URL}/tags`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las etiquetas");
  }

  const datos: Etiqueta[] = await respuesta.json();
  return datos;
}