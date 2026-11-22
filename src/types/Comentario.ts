import type { Usuario } from "./Usuario";

export type Comentario = {
  id: number;
  content: string;
  User: Usuario;
};
