import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import PerfilPage from "./pages/PerfilPage";
import CrearPublicacionPage from "./pages/CrearPublicacionPage";
import ProtectorRuta from "./components/ProtectorRuta";
import DetallePublicacionPage from "./pages/DetallePublicacionPage";

import { UserContext } from "./context/UserContext";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

export default function App() {
  const { usuario, setUsuario } = useContext(UserContext);

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <BrowserRouter>

      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="md"
        className="mb-4"
      >
        <Container>
          
          <Navbar.Brand href="/">
            UnaHur Anti-Social Net
          </Navbar.Brand>

          
          <Navbar.Toggle aria-controls="navbar-principal" />

          <Navbar.Collapse id="navbar-principal">
            {/* Parte izquierda */}
            <Nav className="me-auto">
              <Nav.Link href="/">
                Inicio
              </Nav.Link>

              {!usuario ? (
                <>
                  <Nav.Link href="/login">
                    Iniciar sesión
                  </Nav.Link>

                  <Nav.Link href="/registro">
                    Registrarse
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="/crear-publicacion">
                    Nueva publicación
                  </Nav.Link>

                  <Nav.Link href="/perfil">
                    Perfil
                  </Nav.Link>
                </>
              )}
            </Nav>

            {/* Parte derecha: solamente aparece si hay usuario logueado */}
            {usuario && (
              <Nav className="align-items-md-center gap-2">
                <Navbar.Text>
                  Hola, {usuario.nickName}
                </Navbar.Text>

                <Button
                  type="button"
                  variant="outline-light"
                  size="sm"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </Button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
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