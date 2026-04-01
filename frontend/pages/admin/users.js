import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/admin');
      setUsers(res.data);
    } catch (error) {
      toast.error('Không thể tải người dùng');
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'ADMIN').length;
  const totalNormalUsers = totalUsers - totalAdmins;

  const queryNormalized = query.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (!queryNormalized) return true;
    const fields = [u.id, u.name, u.email, u.phone, u.cccd, u.address]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase());
    return fields.some((v) => v.includes(queryNormalized));
  });

  const getRoleBadge = (role) => {
    if (role === 'ADMIN') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getProfileBadge = (u) => {
    const hasPhone = Boolean(u.phone);
    const hasAddress = Boolean(u.address);
    const hasCccd = Boolean(u.cccd);
    const score = [hasPhone, hasAddress, hasCccd].filter(Boolean).length;
    if (score === 3) return { cls: 'bg-green-100 text-green-700 border-green-200', text: 'Đầy đủ' };
    if (score === 0) return { cls: 'bg-gray-100 text-gray-600 border-gray-200', text: 'Chưa có' };
    return { cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: `Thiếu ${3 - score}` };
  };

  const getDisplayUserId = (id, role) => {
    if (!id) return 'USR-????-????';
    const s = String(id);
    let hash = 5381;
    for (let i = 0; i < s.length; i += 1) {
      hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
      hash >>>= 0;
    }

    const base36 = hash.toString(36).toUpperCase().padStart(8, '0').slice(0, 8);
    const prefix = role === 'ADMIN' ? 'ADM' : 'USR';
    return `${prefix}-${base36.slice(0, 4)}-${base36.slice(4, 8)}`;
  };

  const copyToClipboard = async (value, label) => {
    try {
      if (!value) return;
      await navigator.clipboard.writeText(value);
      toast.success(`Đã copy ${label}`);
    } catch {
      toast.error('Không thể copy');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý người dùng</h1>
            <p className="text-sm text-gray-400 font-medium">
              Tìm kiếm nhanh theo tên, email, SĐT, CCCD hoặc địa chỉ
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white border border-gray-100 text-gray-700 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-7">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng người dùng</p>
          <p className="mt-3 text-3xl font-black text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-7">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quản trị</p>
          <p className="mt-3 text-3xl font-black text-gray-900">{totalAdmins}</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-7">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</p>
          <p className="mt-3 text-3xl font-black text-gray-900">{totalNormalUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative w-full lg:max-w-lg">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
              </svg>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên, email, SĐT, CCCD..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/60 border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { key: 'ALL', label: 'Tất cả', count: totalUsers },
              { key: 'USER', label: 'Người dùng', count: totalNormalUsers },
              { key: 'ADMIN', label: 'Quản trị', count: totalAdmins },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setRoleFilter(t.key)}
                className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  roleFilter === t.key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                    : 'bg-white text-gray-500 border-gray-100 hover:text-blue-700 hover:border-blue-200'
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Vai trò</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Hồ sơ</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">SĐT / CCCD</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày tham gia</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100" />
                        <div className="space-y-2">
                          <div className="h-3 w-40 bg-gray-100 rounded" />
                          <div className="h-3 w-56 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-6"><div className="h-6 w-24 bg-gray-100 rounded-full" /></td>
                    <td className="p-6"><div className="h-6 w-24 bg-gray-100 rounded-full" /></td>
                    <td className="p-6"><div className="h-3 w-40 bg-gray-100 rounded" /></td>
                    <td className="p-6"><div className="h-3 w-28 bg-gray-100 rounded" /></td>
                    <td className="p-6"><div className="h-9 w-24 bg-gray-100 rounded-xl" /></td>
                  </tr>
                ))}

              {!loading &&
                filteredUsers.map((u) => {
                  const profileBadge = getProfileBadge(u);
                  const initials = (u.name || u.email || 'U').slice(0, 1).toUpperCase();
                  const displayId = getDisplayUserId(u.id, u.role);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/15">
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{u.name || '—'}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(u.email, 'email')}
                              className="text-left text-xs text-gray-400 font-medium hover:text-blue-700 transition-colors"
                              title="Click để copy email"
                            >
                              {u.email}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(u.id, 'ID')}
                              className={`w-fit mt-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                                u.role === 'ADMIN'
                                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-amber-200 border-amber-300/40 shadow-lg shadow-amber-500/10 hover:border-amber-300'
                                  : 'border-gray-100 bg-white text-gray-500 hover:text-blue-700 hover:border-blue-200'
                              }`}
                              title={u.id}
                            >
                              {displayId}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(u.role)}`}>
                          {u.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                        </span>
                      </td>

                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${profileBadge.cls}`}>
                          {profileBadge.text}
                        </span>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(u.phone, 'SĐT')}
                            className={`text-left text-sm font-bold ${u.phone ? 'text-gray-900 hover:text-blue-700' : 'text-gray-300'} transition-colors`}
                            title={u.phone ? 'Click để copy SĐT' : ''}
                          >
                            {u.phone || '—'}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(u.cccd, 'CCCD')}
                            className={`text-left text-xs font-bold ${u.cccd ? 'text-gray-400 hover:text-blue-700' : 'text-gray-300'} transition-colors`}
                            title={u.cccd ? 'Click để copy CCCD' : ''}
                          >
                            CCCD: {u.cccd || '—'}
                          </button>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                          {u.updatedAt && (
                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                              cập nhật: {new Date(u.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-6">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(u.id, 'ID')}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border border-gray-100 text-gray-500 hover:text-blue-700 hover:border-blue-200 transition-all"
                          title="Copy ID"
                        >
                          Copy ID
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {!loading && filteredUsers.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                Không tìm thấy người dùng phù hợp
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminUsers);
