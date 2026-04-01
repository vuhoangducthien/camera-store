import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { href: '/', label: 'Trang chủ', auth: 'any' },
    { href: '/products', label: 'Sản phẩm', auth: 'any' },
    { href: '/orders', label: 'Đơn mua', auth: 'user' },
    { href: '/rentals', label: 'Đơn thuê', auth: 'user' },
    { href: '/gioi-thieu', label: 'Giới thiệu', auth: 'any' },
    { href: '/admin', label: 'Admin', auth: 'admin' },
  ];

  const visibleItems = navItems.filter((item) => {
    if (item.auth === 'any') return true;
    if (item.auth === 'user') return Boolean(user);
    if (item.auth === 'admin') return user?.role === 'ADMIN';
    return false;
  });

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl border-b border-gray-200/60">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:shadow-xl group-hover:shadow-blue-600/30 transition-all">
                <span className="font-black text-sm tracking-tight">CS</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black tracking-tight text-gray-900">CameraStore</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Studio</div>
              </div>
            </Link>

            {!isAuthPage && (
              <div className="hidden md:flex items-center gap-2 rounded-[2rem] bg-white/70 border border-gray-200/70 px-2 py-2 shadow-sm">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        active
                          ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/15'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    href="/cart"
                    className={`relative inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition-all shadow-sm ${
                      isActive('/cart')
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/15'
                        : 'bg-white text-gray-700 border-gray-200/70 hover:border-blue-200 hover:text-blue-700'
                    }`}
                    aria-label="Giỏ hàng"
                    title="Giỏ hàng"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <circle cx="9" cy="20" r="1" />
                      <circle cx="17" cy="20" r="1" />
                      <path d="M3 4h2l2 12h14l2-8H7" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-black text-white shadow-lg shadow-blue-600/30">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/profile"
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition-all shadow-sm ${
                      isActive('/profile')
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/15'
                        : 'bg-white text-gray-700 border-gray-200/70 hover:border-blue-200 hover:text-blue-700'
                    }`}
                    aria-label="Hồ sơ"
                    title="Hồ sơ"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      isActive('/login')
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/15'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
