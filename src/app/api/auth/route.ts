import { SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== 'admin' || password !== '123456') {
    return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), { status: 401 });
  }

  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(SECRET_KEY);

  return new Response(JSON.stringify({ token }), {
    headers: { 'Set-Cookie': `token=${token}; HttpOnly; Path=/` },
  });
}
