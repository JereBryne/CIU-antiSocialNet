import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearUsuario } from "../services/usuarioService";
import { UserContext } from "../context/UserContext";

export default function RegistroPage() {
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nickName.trim() || !email.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setCargando(true);
      const usuarioCreado = await crearUsuario(nickName.trim(), email.trim());

      setUsuario(usuarioCreado);
      localStorage.setItem("usuario", JSON.stringify(usuarioCreado));
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al registrarse.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <main>
      <h1>Registro de Usuario</h1>

      <form onSubmit={manejarSubmit}>
        <div>
          <label htmlFor="nickName">NickName:</label>
          <input
            id="nickName"
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Ej: luna"
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: luna@example.com"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
      </p>
    </main>
  );
}