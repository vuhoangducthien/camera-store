import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Profile() {
  const { user, loading, updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cccd, setCccd] = useState('');

  const roleLabel = user?.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng';
  const roleBadgeClass = user?.role === 'ADMIN'
    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
    : 'bg-blue-100 text-blue-700 border-blue-200';

  const getInitials = (name, email) => {
    const base = String(name || '').trim();
    if (base) {
      const parts = base.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] || '';
      const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : '';
      const initials = `${first}${last}`.toUpperCase();
      return initials || 'U';
    }
    const e = String(email || '').trim();
    return (e ? e[0] : 'U').toUpperCase();
  };

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
    setCccd(user.cccd || '');
  }, [user]);

  const profileCompleteness = useMemo(() => {
    if (!user) return 0;
    const fields = [
      Boolean(user.name && String(user.name).trim()),
      Boolean(user.phone && String(user.phone).trim()),
      Boolean(user.address && String(user.address).trim()),
      Boolean(user.cccd && String(user.cccd).trim()),
    ];
    const score = fields.filter(Boolean).length;
    return Math.round((score / fields.length) * 100);
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (saving) return;
      setSaving(true);
      await updateProfile({
        name,
        phone,
        address,
        cccd,
      });
      toast.success('Cập nhật hồ sơ thành công');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-56 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-4 w-72 bg-gray-100 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-28 bg-gray-100 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-[2rem] p-14 shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Bạn chưa đăng nhập</h1>
            <p className="text-gray-500 font-medium mb-8">Đăng nhập để xem hồ sơ, quản lý đơn mua và đơn thuê.</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Hồ sơ</h1>
          <p className="text-gray-500 font-medium">Thông tin tài khoản và các lối tắt quản lý</p>
        </div>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="p-10 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 border-b border-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <span className="text-2xl font-black tracking-tight">{getInitials(user.name, user.email)}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài khoản</p>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name || 'Chưa cập nhật tên'}</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">{user.email}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleBadgeClass}`}>
                      {roleLabel}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-green-100 text-green-700 border-green-200">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/orders"
                  className="px-7 py-4 rounded-2xl bg-white border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm text-xs font-black uppercase tracking-widest text-center"
                >
                  Đơn mua
                </Link>
                <Link
                  href="/rentals"
                  className="px-7 py-4 rounded-2xl bg-white border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm text-xs font-black uppercase tracking-widest text-center"
                >
                  Đơn thuê
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-7 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-all shadow-sm text-xs font-black uppercase tracking-widest text-center"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[2rem] border border-gray-100 bg-gray-50/30 p-7">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                <p className="mt-2 text-sm font-black text-gray-900 break-words">{user.email}</p>
              </div>
              <div className="rounded-[2rem] border border-gray-100 bg-gray-50/30 p-7">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên hiển thị</p>
                <p className="mt-2 text-sm font-black text-gray-900">{user.name || '—'}</p>
              </div>
              <div className="rounded-[2rem] border border-gray-100 bg-gray-50/30 p-7">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò</p>
                <p className="mt-2 text-sm font-black text-gray-900">{roleLabel}</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              <div className="lg:col-span-3 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Thông tin cá nhân</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hoàn thiện hồ sơ</p>
                    <p className="text-sm font-black text-gray-900">{profileCompleteness}%</p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên hiển thị</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                        placeholder="Họ và tên"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                        placeholder="VD: 0987654321"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ nhận hàng</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CCCD</label>
                      <input
                        value={cccd}
                        onChange={(e) => setCccd(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                        placeholder="9–12 chữ số"
                        inputMode="numeric"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full md:w-auto px-10 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <span>Lưu thay đổi</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Gợi ý</h3>
                  </div>
                  <div className="space-y-3">
                    <Link href="/orders" className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                      <span className="text-sm font-bold text-gray-900">Theo dõi đơn mua</span>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Mở</span>
                    </Link>
                    <Link href="/rentals" className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                      <span className="text-sm font-bold text-gray-900">Theo dõi đơn thuê</span>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Mở</span>
                    </Link>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3 .895 3 2v2H9v-2c0-1.105 1.343-2 3-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V8a5 5 0 0110 0v3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 19h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Sử dụng tại checkout</h3>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      Số điện thoại, địa chỉ và CCCD sẽ được hiển thị ở trang thanh toán (mua và thuê). Bạn nên cập nhật đầy đủ để thao tác nhanh hơn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
