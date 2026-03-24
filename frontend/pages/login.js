import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 mb-2" required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 mb-4" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Đăng nhập</button>
      </form>
      <p className="mt-4 text-center">
        Chưa có tài khoản? <a href="/register" className="text-blue-500">Đăng ký</a>
      </p>
    </div>
  );
}