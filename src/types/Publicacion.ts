import type { Usuario } from "./Usuario";
import type { Etiqueta } from "./Etiqueta";

export type Publicacion = {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  UserId: number;
  User: Usuario;
  Tags: Etiqueta[];
};
