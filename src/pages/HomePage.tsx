import { useEffect, useState } from "react";

import PublicacionCard from "../components/PublicacionCard";
import type { Publicacion } from "../types/Publicacion";
import { obtenerPublicaciones } from "../services/publicacionService";

export default function HomePage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPublicaciones() {
      try {
        const datos = await obtenerPublicaciones();
        const ordenadas = [...datos].sort(
          //Ordenar las publicaicones cronologicamente
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setPublicaciones(ordenadas);
        setPublicaciones(datos);
      } catch {
        setError("No se pudieron cargar las publicaciones");
      } finally {
        setCargando(false);
      }
    }

    cargarPublicaciones();
  }, []);
  if (cargando) {
    return <p>Cargando publicaciones....</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <main>
      <h1>CIU-antiSocialNet</h1>

      {publicaciones.length === 0 && <p>No hay publicaciones.</p>}

      {publicaciones.map((publicacion) => (
        <PublicacionCard key={publicacion.id} publicacion={publicacion} />
      ))}
    </main>
  );
}
