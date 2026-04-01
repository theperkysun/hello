import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@foodieszenith.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      window.localStorage.setItem('fz_token', data.access_token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout title="Admin Login">
      <form onSubmit={onSubmit} className="form">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Sign in</button>
      </form>
      {error && <p>{error}</p>}
    </Layout>
  );
}
