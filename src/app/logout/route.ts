import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Logout feito com sucesso' });
  response.cookies.set('token', '', { expires: new Date(0) });
  return response;
}
