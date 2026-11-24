import { useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useTema } from "../hooks/useTema";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function BarraNavegacion() {
  const { usuario, setUsuario } = useContext(UserContext);
  const { tema, setTema } = useTema();
  const location = useLocation();

  // El UserProvider se encarga de borrar el usuario de localStorage
  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="md"
      collapseOnSelect
      className="mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          UnaHur Anti-Social Net
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-principal" />

        <Navbar.Collapse id="navbar-principal">
          {/* Parte izquierda. Nav.Link + eventKey hace que el menú se cierre en celular al elegir una opción */}
          <Nav className="me-auto" activeKey={location.pathname}>
            <Nav.Link as={NavLink} to="/" end eventKey="/">
              Inicio
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/sobre-nosotros"
              eventKey="/sobre-nosotros"
            >
              Sobre nosotros
            </Nav.Link>

            {!usuario ? (
              <>
                <Nav.Link as={NavLink} to="/login" eventKey="/login">
                  Iniciar sesión
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" eventKey="/registro">
                  Registrarse
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/crear-publicacion"
                  eventKey="/crear-publicacion"
                >
                  Nueva publicación
                </Nav.Link>
                <Nav.Link as={NavLink} to="/perfil" eventKey="/perfil">
                  Perfil
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Parte derecha: modo oscuro y, si hay usuario logueado, saludo y cerrar sesión */}
          <Nav className="align-items-md-center gap-2">
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
  );
}
