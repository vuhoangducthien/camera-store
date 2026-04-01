import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    rentals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async (opts = {}) => {
      try {
        if (opts.showLoading) setLoading(true);
        const [usersRes, productsRes, ordersRes, rentalsRes] = await Promise.all([
          axios.get('/users/admin'),
          axios.get('/products'),
          axios.get('/orders/admin'),
          axios.get('/rentals/admin')
        ]);

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          rentals: rentalsRes.data.length,
        });
      } catch (error) {
        toast.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      key: 'users',
      label: 'Người dùng',
      value: stats.users,
      badge: 'Users',
      cls: 'from-blue-600 to-indigo-600',
      icon: 'M12 11c1.657 0 3 .895 3 2v2H9v-2c0-1.105 1.343-2 3-2z M7 11V8a5 5 0 0110 0v3 M5 21h14a2 2 0 002-2v-1a6 6 0 00-12 0v1a2 2 0 002 2z',
    },
    {
      key: 'products',
      label: 'Sản phẩm',
      value: stats.products,
      badge: 'Products',
      cls: 'from-emerald-600 to-teal-600',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    },
    {
      key: 'orders',
      label: 'Đơn hàng',
      value: stats.orders,
      badge: 'Orders',
      cls: 'from-violet-600 to-fuchsia-600',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      key: 'rentals',
      label: 'Đơn thuê',
      value: stats.rentals,
      badge: 'Rentals',
      cls: 'from-amber-600 to-orange-600',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tổng quan</h1>
            <p className="text-sm text-gray-400 font-medium">Số liệu nhanh cho hệ thống CameraStore Studio</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              Promise.resolve()
                .then(async () => {
                  const [usersRes, productsRes, ordersRes, rentalsRes] = await Promise.all([
                    axios.get('/users/admin'),
                    axios.get('/products'),
                    axios.get('/orders/admin'),
                    axios.get('/rentals/admin'),
                  ]);
                  setStats({
                    users: usersRes.data.length,
                    products: productsRes.data.length,
                    orders: ordersRes.data.length,
                    rentals: rentalsRes.data.length,
                  });
                })
                .catch(() => toast.error('Không thể tải dữ liệu'))
                .finally(() => setLoading(false));
            }}
            disabled={loading}
            className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white border border-gray-100 text-gray-700 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={`sk-${i}`} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-7 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-9 w-24 bg-gray-100 rounded" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                </div>
                <div className="mt-6 h-2 w-full bg-gray-100 rounded" />
              </div>
            ))
          : cards.map((c) => (
              <div key={c.key} className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${c.cls}`} />
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.label}</p>
                      <p className="mt-3 text-4xl font-black text-gray-900 tracking-tight">{c.value}</p>
                      <span className="mt-3 inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100">
                        {c.badge}
                      </span>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.cls} text-white flex items-center justify-center shadow-lg`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="p-7 border-b border-gray-100 bg-gray-50/40">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lối tắt</p>
            <p className="mt-2 text-xl font-black text-gray-900 tracking-tight">Quản lý nhanh</p>
          </div>
          <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { href: '/admin/products', title: 'Sản phẩm', desc: 'Tạo, sửa, quản lý tồn kho', badge: `${stats.products}` },
              { href: '/admin/orders', title: 'Đơn hàng', desc: 'Theo dõi và cập nhật trạng thái', badge: `${stats.orders}` },
              { href: '/admin/rentals', title: 'Đơn thuê', desc: 'Duyệt thuê và cập nhật trả hàng', badge: `${stats.rentals}` },
              { href: '/admin/users', title: 'Người dùng', desc: 'Tìm kiếm và kiểm tra thông tin', badge: `${stats.users}` },
            ].map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="group rounded-2xl border border-gray-100 bg-white hover:bg-gray-50/50 transition-all p-6 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900">{it.title}</p>
                  <p className="mt-1 text-sm text-gray-500 font-medium">{it.desc}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100">
                    {it.badge}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] border border-gray-900 text-white shadow-2xl shadow-gray-900/10 overflow-hidden">
          <div className="p-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Trạng thái hệ thống</p>
            <p className="mt-2 text-2xl font-black tracking-tight">CameraStore Studio</p>
            <p className="mt-3 text-sm text-white/70 font-medium leading-relaxed">
              Bạn có thể quản lý sản phẩm, đơn hàng và đơn thuê ngay từ menu bên trái. Các số liệu trong dashboard là thống kê theo thời gian thực từ database.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { k: 'API', v: 'Online' },
                { k: 'Admin', v: 'Ready' },
                { k: 'Orders', v: `${stats.orders}` },
                { k: 'Rentals', v: `${stats.rentals}` },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{s.k}</p>
                  <p className="mt-2 text-sm font-black text-white">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminDashboard);
