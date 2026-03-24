import { useState } from 'react';
import axios from '../utils/axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', { email, password, name });
      router.push('/login');
    } catch (error) {
      alert('Đăng ký thất bại');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 mb-2" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 mb-2" required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 mb-4" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Đăng ký</button>
      </form>
    </div>
  );
}