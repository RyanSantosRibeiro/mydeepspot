import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Bem-vindo, {session.user?.name}!</p>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  ) : (
    <button onClick={() => signIn("google")}>Login com Google</button>
  );
}
