import type { Usuario } from "../types/Usuario";

export async function obtenerUsuarios(): Promise<Usuario[]> {
  //GET users
  const respuesta = await fetch("http://localhost:3001/users");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }
  const datos: Usuario[] = await respuesta.json();
  return datos;
}
