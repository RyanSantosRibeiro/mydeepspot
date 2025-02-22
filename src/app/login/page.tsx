'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log(res);

    if (res.ok) {
      window.location.href = '/dashboard';
    } else {
      alert('Login falhou!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
