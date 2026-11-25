import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import { useContext } from "react";

import Form from "react-bootstrap/Form";
import { useTema } from "./pages/tema";

import SobreNosotrosPage from "./pages/SobreNosotrosPage";
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

  const { tema, setTema } = useTema();

  return (
    <BrowserRouter>
      <Navbar
        bg="dark"
        data-bs-theme="dark"
        expand="md"
        collapseOnSelect
        className="mb-4"
      >
        <Container>
          <Link className="navbar-brand" to="/">
            UnaHur Anti-Social Net
          </Link>

          <Navbar.Toggle aria-controls="navbar-principal" />

          <Navbar.Collapse id="navbar-principal">
            {/* Parte izquierda */}
            <Nav className="me-auto">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/sobre-nosotros"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Sobre nosotros
              </NavLink>

              {!usuario ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Iniciar sesión
                  </NavLink>

                  <NavLink
                    to="/registro"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Registrarse
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/crear-publicacion"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Nueva publicación
                  </NavLink>

                  <NavLink
                    to="/perfil"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Perfil
                  </NavLink>
                </>
              )}
            </Nav>

            {/* Parte derecha: solamente aparece si hay usuario logueado */}
            <Nav className="align-items-md-center gap-2 ">
              <Form.Check
                type="switch"
                id="modo-oscuro"
                label={tema === "dark" ? "Modo claro" : "Modo oscuro"}
                checked={tema === "dark"}
                onChange={(e) => setTema(e.target.checked ? "dark" : "light")}
                className="mb-0 text-light"
              />

              {usuario && (
                <>
                  <Navbar.Text>Hola, {usuario.nickName}</Navbar.Text>
                  <Button
                    type="button"
                    variant="outline-light"
                    size="sm"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
      </Routes>
      <footer className="border-top mt-5 py-4 text-center text-body-secondary small">
        UnaHur Anti-Social Net · Construcción de Interfaces de Usuario · UNAHUR
      </footer>
    </BrowserRouter>
  );
}
