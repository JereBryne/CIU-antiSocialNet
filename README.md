# CIU-antiSocialNet

Frontend de la red social **UnaHur Anti-Social Net**, desarrollado en React + TypeScript para la materia Construcción de Interfaces de Usuario (UNAHUR).

Permite registrarse, iniciar sesión (simulada), ver el feed de publicaciones, ver el detalle con sus comentarios, comentar, consultar el perfil propio y crear publicaciones con imágenes y etiquetas.

## Requisitos

- Node.js 18 o superior
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

## Tecnologías

React, TypeScript, Vite, react-router-dom, Bootstrap y react-bootstrap.
