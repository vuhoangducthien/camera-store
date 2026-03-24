import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const menu = [
    { name: 'Tổng quan', path: '/admin' },
    { name: 'Sản phẩm', path: '/admin/products' },
    { name: 'Đơn hàng', path: '/admin/orders' },
    { name: 'Đơn thuê', path: '/admin/rentals' },
    { name: 'Người dùng', path: '/admin/users' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl border-b">Quản trị</div>
        <nav className="p-4">
          {menu.map(item => (
            <Link key={item.path} href={item.path}>
              <span className={`block p-2 mb-2 rounded cursor-pointer ${router.pathname === item.path ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}