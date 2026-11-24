import { BrowserRouter, Routes, Route } from "react-router-dom";

import BarraNavegacion from "./components/BarraNavegacion";
import SobreNosotrosPage from "./pages/SobreNosotrosPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import PerfilPage from "./pages/PerfilPage";
import CrearPublicacionPage from "./pages/CrearPublicacionPage";
import ProtectorRuta from "./components/ProtectorRuta";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";
import NoEncontradoPage from "./pages/NoEncontradoPage";

export default function App() {
  return (
    <BrowserRouter>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
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
        <Route path="*" element={<NoEncontradoPage />} />
      </Routes>
      <footer className="border-top mt-5 py-4 text-center text-body-secondary small">
        UnaHur Anti-Social Net · Construcción de Interfaces de Usuario · UNAHUR
      </footer>
    </BrowserRouter>
  );
}
