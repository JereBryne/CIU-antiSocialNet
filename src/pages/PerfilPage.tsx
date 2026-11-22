import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import PublicacionCard from "../components/PublicacionCard";
import { obtenerPublicaciones } from "../services/publicacionService";
import type { Publicacion } from "../types/Publicacion";

export default function PerfilPage() {
  const { usuario, setUsuario } = useContext(UserContext);
  const usuarioId = usuario?.id;
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (usuarioId === undefined) return;

    async function cargarPublicaciones(id: number) {
      try {
        const datos = await obtenerPublicaciones(id);
        setPublicaciones(datos);
      } catch {
        setError("No se pudieron cargar tus publicaciones");
      } finally {
        setCargando(false);
      }
    }

    cargarPublicaciones(usuarioId);
  }, [usuarioId]);

  return (
    <main>
      <h1>Perfil de {usuario?.nickName}</h1>
      <button type="button" onClick={() => setUsuario(null)}>
        Cerrar sesión
      </button>
      <h2>Mis Publicaciones</h2>
      {cargando && <p>Cargando publicaicones...</p>}
      {error && <p>{error}</p>}
      {!cargando && !error && publicaciones.length === 0 && (
        <p>Todavia no tenes publicaciones</p>
      )}
      {publicaciones.map((publicacion) => (
        <PublicacionCard key={publicacion.id} publicacion={publicacion} />
      ))}
    </main>
  );
}
