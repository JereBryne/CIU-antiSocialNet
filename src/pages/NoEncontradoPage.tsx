import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";

export default function NoEncontradoPage() {
  return (
    <main>
      <Container className="py-5 text-center">
        <h1 className="display-4 fw-bold">404</h1>
        <p className="lead text-body-secondary">
          La página que buscás no existe.
        </p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </Container>
    </main>
  );
}
