import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import UserProvider from "./context/UserProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // UserProvider permite que la app comparta el usuario logeado
  <UserProvider>
    <App />
  </UserProvider>,
);
