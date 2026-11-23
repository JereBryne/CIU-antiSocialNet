import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { obtenerEtiquetas } from "../services/etiquetaService";
import type { Etiqueta } from "../types/Etiqueta";

const API_URL = "http://localhost:3001";

export default function CrearPublicacionPage() {
  const { usuario } = useContext(UserContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>("");
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState<Etiqueta[]>([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<number[]>([]);
  const [urlsImagenes, setUrlsImagenes] = useState<string[]>([""]);
  const [error, setError] = useState<string>("");
  const [enviando, setEnviando] = useState<boolean>(false);

  useEffect(() => {
    obtenerEtiquetas()
      .then((datos) => setEtiquetasDisponibles(datos))
      .catch(() => setError("No se pudieron cargar las etiquetas disponibles."));
  }, []);

  const alternarEtiqueta = (idEtiqueta: number) => {
    if (etiquetasSeleccionadas.includes(idEtiqueta)) {
      setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter((id) => id !== idEtiqueta));
    } else {
      setEtiquetasSeleccionadas([...etiquetasSeleccionadas, idEtiqueta]);
    }
  };

  const actualizarUrlImagen = (indice: number, valor: string) => {
    const nuevasUrls = [...urlsImagenes];
    nuevasUrls[indice] = valor;
    setUrlsImagenes(nuevasUrls);
  };

  const agregarCampoImagen = () => {
    setUrlsImagenes([...urlsImagenes, ""]);
  };

  const quitarCampoImagen = (indice: number) => {
    const nuevasUrls = urlsImagenes.filter((_, i) => i !== indice);
    setUrlsImagenes(nuevasUrls);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usuario) {
      setError("Debés iniciar sesión para publicar.");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    try {
      setEnviando(true);

      // 1. Crear publicación (POST /posts)
      const respPost = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          userId: usuario.id,
          UserId: usuario.id,
          tags: etiquetasSeleccionadas,
        }),
      });

      if (!respPost.ok) {
        throw new Error("No se pudo crear la publicación.");
      }

      const postCreado = await respPost.json();

      // 2. Asociar imágenes una por una (POST /postimages)
      const urlsValidas = urlsImagenes
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      for (const url of urlsValidas) {
        const respImg = await fetch(`${API_URL}/postimages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            postId: postCreado.id,
            PostId: postCreado.id,
          }),
        });

        if (!respImg.ok) {
          console.error(`Error al asociar la imagen: ${url}`);
        }
      }

      navigate("/perfil");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado al publicar.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main>
      <h1>Nueva Publicación</h1>

      <form onSubmit={manejarSubmit}>
        <div>
          <label htmlFor="description">Descripción (obligatoria):</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué estás pensando?"
          />
        </div>

        <div>
          <p>Etiquetas:</p>
          {etiquetasDisponibles.length === 0 ? (
            <p>Cargando etiquetas...</p>
          ) : (
            <div>
              {etiquetasDisponibles.map((etiqueta) => (
                <label key={etiqueta.id} style={{ marginRight: "12px" }}>
                  <input
                    type="checkbox"
                    checked={etiquetasSeleccionadas.includes(etiqueta.id)}
                    onChange={() => alternarEtiqueta(etiqueta.id)}
                  />
                  {etiqueta.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <p>URLs de imágenes (opcional):</p>
          {urlsImagenes.map((url, indice) => (
            <div key={indice} style={{ marginBottom: "8px" }}>
              <input
                type="url"
                value={url}
                onChange={(e) => actualizarUrlImagen(indice, e.target.value)}
                placeholder="https://placeholder.pics/svg/300x400/DEDEDE/555555/Imagen%201"
              />
              {urlsImagenes.length > 1 && (
                <button type="button" onClick={() => quitarCampoImagen(indice)}>
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={agregarCampoImagen}>
            + Agregar otra imagen
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginTop: "16px" }}>
          <button type="submit" disabled={enviando}>
            {enviando ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </main>
  );
}