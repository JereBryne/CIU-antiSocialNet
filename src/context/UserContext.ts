import { createContext } from "react";
import type { Usuario } from "../types/Usuario";

type DatosUsuario = {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
};

export const UserContext = createContext<DatosUsuario>({
  usuario: null,
  setUsuario: () => {},
});
