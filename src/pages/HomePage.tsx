import { useEffect, useState } from "react";
import PublicacionCard from "../components/PublicacionCard";
import type { Publicacion } from "../types/Publicacion";
import type { Etiqueta } from "../types/Etiqueta";
import { obtenerPublicaciones } from "../services/publicacionService";
import { obtenerEtiquetas } from "../services/etiquetaService";

export default function HomePage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [datosPublicaciones, datosEtiquetas] = await Promise.all([
          obtenerPublicaciones(),
          obtenerEtiquetas(),
        ]);

        const ordenadas = [...datosPublicaciones].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setPublicaciones(ordenadas);
        setEtiquetas(datosEtiquetas);
      } catch {
        setError("No se pudieron cargar las publicaciones");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const publicacionesFiltradas =
    etiquetaSeleccionada === null
      ? publicaciones
      : publicaciones.filter((pub) =>
          pub.Tags.some((tag) => tag.id === etiquetaSeleccionada),
        );

  if (cargando) {
    return <p>Cargando publicaciones...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <main>
      <header>
        <h1>UnaHur Anti-Social Net</h1>
        <p>El espacio de la comunidad universitaria para compartir ideas sin algoritmos.</p>
      </header>

      <section>
        <h2>Sobre nosotros</h2>
        <p>
          Proyecto desarrollado para Construcción de Interfaces de Usuario (UNAHUR).
          Publicá tus reflexiones, compartí imágenes y debatí con otros estudiantes.
        </p>
      </section>

      <section>
        <h2>Filtrar por etiqueta</h2>
        <div>
          <button
            type="button"
            onClick={() => setEtiquetaSeleccionada(null)}
            disabled={etiquetaSeleccionada === null}
          >
            Todas
          </button>
          {etiquetas.map((etiqueta) => (
            <button
              key={etiqueta.id}
              type="button"
              onClick={() => setEtiquetaSeleccionada(etiqueta.id)}
              disabled={etiquetaSeleccionada === etiqueta.id}
              style={{ marginLeft: "8px" }}
            >
              #{etiqueta.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Publicaciones recientes</h2>
        {publicacionesFiltradas.length === 0 ? (
          <p>No hay publicaciones para mostrar.</p>
        ) : (
          publicacionesFiltradas.map((publicacion) => (
            <PublicacionCard key={publicacion.id} publicacion={publicacion} />
          ))
        )}
      </section>
    </main>
  );
}