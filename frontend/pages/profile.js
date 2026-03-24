import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hồ sơ</h1>
      <p>Email: {user.email}</p>
      <p>Tên: {user.name}</p>
      <p>Vai trò: {user.role}</p>
    </div>
  );
}