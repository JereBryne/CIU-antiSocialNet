import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default function SobreNosotrosPage() {
  return (
    <main>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={9} xl={8}>
            <h1 className="mb-4">Sobre nosotros</h1>

            <p className="lead">
              UnaHur Anti-Social Net es una red social pensada para la
              comunidad de la UNAHUR: un espacio para compartir ideas,
              imágenes y debates sin algoritmos ni publicidad.
            </p>

            <Row className="g-4 mt-2">
              <Col xs={12} md={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>Qué podés hacer</Card.Title>
                    <Card.Text>
                      Publicar ideas, comentar, explorar etiquetas y ver el
                      perfil con tus publicaciones.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>Tecnologías</Card.Title>
                    <Card.Text>
                      React, TypeScript, Vite, react-router-dom, Bootstrap y
                      react-bootstrap.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
}