import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import ProtectorRuta from "./components/ProtectorRuta";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

export default function App() {
  const { usuario } = useContext(UserContext);
  return (
    <BrowserRouter>
      <nav>
        {usuario && <span>Hola, {usuario.nickName}</span>}
        <Link to="/">Inicio</Link>
        {" | "}
        <Link to="/login">Iniciar sesión</Link>
        {" | "}
        <Link to="/perfil">Perfil</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />}></Route>
        <Route
          path="/perfil"
          element={
            <ProtectorRuta>
              <PerfilPage />
            </ProtectorRuta>
          }
        ></Route>
        <Route path="/post/:id" element={<DetallePublicacionPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
