import type { Usuario } from "../types/Usuario";

type UsuarioCardProps = {
  usuario: Usuario;
};

export default function UsuarioCard({ usuario }: UsuarioCardProps) {
  return (
    <article>
      <h2>{usuario.nickName}</h2>
      <p>{usuario.email}</p>
    </article>
  );
}
