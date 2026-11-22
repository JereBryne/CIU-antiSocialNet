import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { obtenerUsuarios } from "../services/usuarioService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUsuario } = useContext(UserContext);
  const navigate = useNavigate();

  async function manejarSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");

    if (!nickName.trim() || !password.trim()) {
      setError("Completá el nombre de usuario y la contraseña");
      return;
    }

    if (password !== "123456") {
      setError("Contraseña incorrecta");
      return;
    }
    try {
      const usuraios = await obtenerUsuarios();
      const usuario = usuraios.find((u) => u.nickName === nickName.trim());
      if (!usuario) {
        setError("Usuario no encontrado");
        return;
      }
      setUsuario(usuario);
      navigate("/", { replace: true });
    } catch {
      setError("No se pudieon consultar los usuarios");
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      <form onSubmit={manejarSubmit}>
        <div>
          <label htmlFor="nickName">Nombre de usuario</label>
          <input
            id="nickName"
            value={nickName}
            onChange={(evento) => setNickName(evento.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </main>
  );
}
