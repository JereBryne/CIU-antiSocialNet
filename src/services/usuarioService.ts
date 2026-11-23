import type { Usuario } from "../types/Usuario";

const API_URL = "http://localhost:3001";

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const respuesta = await fetch(`${API_URL}/users`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }
  const datos: Usuario[] = await respuesta.json();
  return datos;
}

export async function crearUsuario(nickName: string, email: string): Promise<Usuario> {
  const respuesta = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickName, email }),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => null);
    const mensaje = errorData?.message || errorData?.error || "No se pudo crear el usuario";
    throw new Error(mensaje);
  }

  const nuevoUsuario: Usuario = await respuesta.json();
  return nuevoUsuario;
}