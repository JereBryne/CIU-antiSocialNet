import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectorRuta({ children }: { children: ReactNode }) {
  const { usuario } = useContext(UserContext);
  const location = useLocation();

  if (!usuario) {
    // Guardamos a dónde quería ir, para volver ahí después del login
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  return <>{children}</>;
}
