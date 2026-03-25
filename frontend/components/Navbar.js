import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">CameraStore</Link>
          <div className="space-x-4">
            <Link href="/products">Sản phẩm</Link>
            {user ? (
              <>
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

      {user && !router.pathname.startsWith('/admin') && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            href="/cart"
            aria-label="Giỏ hàng"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          >
            {/* Shopping cart icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
              <path d="M3 4h2l2 12h14l2-8H7" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}