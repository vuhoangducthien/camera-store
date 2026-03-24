import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="text-xl font-bold">CameraStore</Link>
        <div className="space-x-4">
          <Link href="/products">Sản phẩm</Link>
          {user ? (
            <>
              <Link href="/cart">Giỏ hàng</Link>
              <Link href="/orders">Đơn mua</Link>
              <Link href="/rentals">Thuê</Link>
              <Link href="/profile">Hồ sơ</Link>
              {user.role === 'ADMIN' && <Link href="/admin">Admin</Link>}
              <button onClick={logout} className="text-red-500">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link href="/login">Đăng nhập</Link>
              <Link href="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}