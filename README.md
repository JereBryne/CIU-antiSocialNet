# CIU-antiSocialNet

Frontend de la red social **UnaHur Anti-Social Net**, desarrollado en React + TypeScript para la materia Construcción de Interfaces de Usuario (UNAHUR).

Permite registrarse, iniciar sesión (simulada), ver el feed de publicaciones, ver el detalle con sus comentarios, comentar, consultar el perfil propio y crear publicaciones con imágenes y etiquetas.

## Funcionalidades

- **Login simulado:** se busca el `nickName` con `GET /users` y la contraseña fija `123456` se valida en el frontend. El usuario se guarda en un contexto global (`useContext`) y en `localStorage`.
- **Rutas protegidas:** `/perfil` y `/crear-publicacion` redirigen al login si no hay sesión, y después del login se vuelve a la página que se quería ver.
- **Registro:** valida los campos y el formato del email, envía `POST /users` y muestra el error del servidor (por ejemplo, si el `nickName` ya existe).
- **Home:** feed de publicaciones recientes con descripción, imágenes, etiquetas, cantidad de comentarios y botón "Ver más". Incluye filtro por etiquetas.
- **Detalle (`/post/:id`):** descripción, imágenes, etiquetas, comentarios visibles y formulario para comentar.
- **Perfil:** publicaciones del usuario logueado y botón para cerrar sesión.
- **Nueva publicación:** descripción, una o más URLs de imágenes y etiquetas obtenidas de la API. Crea el post y después asocia cada imagen.
- Validaciones con mensaje en cada campo, alertas de éxito y error, modo oscuro, página Sobre nosotros y página 404.

## Requisitos

- Node.js 20.19 o superior
- La API del backend corriendo en `http://localhost:3001`

## Cómo correr en local

1. Levantar el backend (API provista por la cátedra, en la carpeta `backend-api`):

   ```bash
   npm install
   node seed.js
   npm start
   ```

2. En esta carpeta, instalar dependencias y iniciar el frontend:

   ```bash
   npm install
   npm run dev
   ```

3. Abrir `http://localhost:5173` en el navegador.

Para ingresar, usar un usuario registrado y la contraseña `123456`.

## API utilizada

URL: `http://localhost:3001`

Endpoints: `GET/POST /users`, `GET/POST /posts`, `GET /posts/:id`, `GET /comments/post/:postId`, `POST /comments`, `GET /tags`, `GET/POST /postimages`.

Backend de la cátedra: https://github.com/lucasfigarola/backend-api

## Estructura

```
src/
  components/   PublicacionCard y ProtectorRuta (rutas protegidas)
  context/      UserContext y UserProvider (usuario logueado + localStorage)
  hooks/        useTema (modo claro / oscuro)
  pages/        Una página por ruta
  services/     Funciones que hacen los fetch a la API
  types/        Tipos de TypeScript de los datos de la API
```

## Tecnologías

React, TypeScript, Vite, react-router-dom, Bootstrap y react-bootstrap.
