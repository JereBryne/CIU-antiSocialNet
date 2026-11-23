import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import PerfilPage from "./pages/PerfilPage";
import CrearPublicacionPage from "./pages/CrearPublicacionPage";
import ProtectorRuta from "./components/ProtectorRuta";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

export default function App() {
  const { usuario, setUsuario } = useContext(UserContext);

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <BrowserRouter>
      <nav>
        {usuario && <span>Hola, {usuario.nickName} | </span>}
        <Link to="/">Inicio</Link>
        {" | "}
        {!usuario ? (
          <>
            <Link to="/login">Iniciar sesión</Link>
            {" | "}
            <Link to="/registro">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to="/crear-publicacion">Nueva publicación</Link>
            {" | "}
            <Link to="/perfil">Perfil</Link>
            {" | "}
            <button type="button" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route
          path="/perfil"
          element={
            <ProtectorRuta>
              <PerfilPage />
            </ProtectorRuta>
          }
        />
        <Route
          path="/crear-publicacion"
          element={
            <ProtectorRuta>
              <CrearPublicacionPage />
            </ProtectorRuta>
          }
        />
        <Route path="/post/:id" element={<DetallePublicacionPage />} />
      </Routes>
    </BrowserRouter>
  );
}