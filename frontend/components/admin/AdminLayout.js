import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { logout } = useAuth();
  const menu = [
    { name: 'Tổng quan', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Sản phẩm', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Đơn hàng', path: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Đơn thuê', path: '/admin/rentals', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Người dùng', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl">C</div>
            <div>
              <h2 className="text-xl font-black tracking-tighter">ADMIN</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">CameraStore Studio</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {menu.map(item => (
            <Link key={item.path} href={item.path}>
              <span className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group ${router.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${router.pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-10">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              {menu.find(m => m.path === router.pathname)?.name || 'Trang quản trị'}
            </h1>
            <p className="text-xs text-gray-400 font-medium">Hệ thống quản lý CameraStore Studio v2.0</p>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">
              Quay lại Website →
            </Link>
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">Administrator</p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Trực tuyến</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-12">
          {children}
        </main>
      </div>
    </div>
  );
}