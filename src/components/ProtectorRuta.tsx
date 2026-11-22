import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectorRuta({ children }: { children: ReactNode }) {
  const { usuario } = useContext(UserContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
