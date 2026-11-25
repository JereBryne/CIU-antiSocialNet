import { useEffect, useState } from "react";

export type Tema = "light" | "dark";

function temaInicial(): Tema {
  const guardado = localStorage.getItem("tema");
  if (guardado === "light" || guardado === "dark") return guardado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  return { tema, setTema };
}