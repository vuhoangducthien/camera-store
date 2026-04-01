import withAdmin from '../../components/withAdmin';               // sửa: thêm một dấu .
import AdminLayout from '../../components/admin/AdminLayout';    // sửa
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';                            // sửa
import { toast } from 'react-hot-toast';

const FALLBACK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset="1" stop-color="#f9fafb"/></linearGradient></defs><rect width="96" height="96" rx="20" fill="url(#g)"/><path d="M30 62l12-14 10 12 6-7 8 9" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="38" r="6" fill="#cbd5e1"/></svg>')}`;

function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await axios.get('/rentals/admin');
      setRentals(res.data);
    } catch (error) {
      toast.error('Không thể tải danh sách thuê');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/rentals/admin/${id}`, { status });
      toast.success('Cập nhật trạng thái thành công');
      fetchRentals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const statusText = {
    pending: 'Đang xử lý',
    approved: 'Đã duyệt',
    returned: 'Đã trả',
    cancelled: 'Đã hủy',

    REQUESTED: 'Đang xử lý',
    APPROVED: 'Đã duyệt',
    ACTIVE: 'Đang thuê',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    REJECTED: 'Từ chối'
  };

  const paymentStatusText = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền'
  };

  const getStatusBadgeClass = (status) => {
    switch (String(status || '').toUpperCase()) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'APPROVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ACTIVE': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      case 'REJECTED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'REFUNDED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Đang xử lý' },
    { key: 'approved', label: 'Đã duyệt' },
    { key: 'returned', label: 'Đã trả' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredRentals = activeTab === 'all'
    ? rentals
    : rentals.filter(r => String(r.status || '').toLowerCase() === activeTab);

  const queryNormalized = query.trim().toLowerCase();
  const visibleRentals = filteredRentals.filter((r) => {
    if (!queryNormalized) return true;
    const candidates = [
      r.id,
      r.status,
      r.paymentStatus,
      r.total,
      r.deposit,
      r.createdAt,
      r.user?.id,
      r.user?.name,
      r.user?.email,
      r.user?.phone,
      r.user?.cccd,
      r.user?.address,
      r.payment?.paymentMethod,
      ...(Array.isArray(r.items) ? r.items.map((it) => it.product?.name).filter(Boolean) : []),
    ]
      .filter((v) => v !== null && v !== undefined)
      .map((v) => String(v).toLowerCase());
    return candidates.some((v) => v.includes(queryNormalized));
  });

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý đơn thuê</h1>
        <p className="text-sm text-gray-400 font-medium">Hệ thống quản lý CameraStore Studio v2.0</p>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-10 overflow-x-auto pb-px scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab.key ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="relative w-full max-w-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
              </svg>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, thiết bị thuê..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/60 border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã đơn</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Thanh toán</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs" colSpan={7}>
                    Đang tải...
                  </td>
                </tr>
              ) : (
                visibleRentals.map(r => {
                  const expanded = expandedId === r.id;
                  const startText = r.startDate ? new Date(r.startDate).toLocaleDateString('vi-VN') : '—';
                  const endText = r.endDate ? new Date(r.endDate).toLocaleDateString('vi-VN') : '—';
                  return (
                    <>
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-6">
                          <span className="font-mono text-xs font-bold text-gray-400">#{r.id.substring(0,8).toUpperCase()}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{r.user?.name || 'Khách hàng'}</span>
                            <span className="text-xs text-gray-400 font-medium">{r.user?.email}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{startText} → {endText}</span>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              Tạo: {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '—'}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="font-black text-gray-900">{typeof r.total === 'number' ? `${r.total.toLocaleString('vi-VN')} đ` : '—'}</span>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit ${getPaymentBadgeClass(r.paymentStatus)}`}>
                            {paymentStatusText[r.paymentStatus] || r.paymentStatus || '—'}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit ${getStatusBadgeClass(r.status)}`}>
                            {statusText[r.status] || r.status || '—'}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            {String(r.status || '').toLowerCase() === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateStatus(r.id, 'approved')}
                                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => updateStatus(r.id, 'cancelled')}
                                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-gray-700 hover:bg-gray-800 shadow-lg shadow-gray-900/10 transition-all"
                                >
                                  Hủy
                                </button>
                              </>
                            )}
                            {String(r.status || '').toLowerCase() === 'approved' && (
                              <button
                                onClick={() => updateStatus(r.id, 'returned')}
                                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
                              >
                                Đã trả
                              </button>
                            )}

                            <button
                              onClick={() => setExpandedId(expanded ? null : r.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors group"
                              title="Chi tiết"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expanded && (
                        <tr key={`${r.id}-detail`} className="bg-gray-50/30">
                          <td className="p-6" colSpan={7}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="lg:col-span-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Thiết bị thuê</p>
                                <div className="space-y-4">
                                  {(Array.isArray(r.items) ? r.items : []).map((it) => (
                                    <div key={it.id} className="flex items-center gap-5 bg-white rounded-2xl p-4 border border-gray-100">
                                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                        <img
                                          src={it.product?.images?.[0]?.url || FALLBACK_IMAGE}
                                          alt={it.product?.name || 'Sản phẩm'}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{it.product?.name || 'Sản phẩm'}</p>
                                        <p className="text-sm text-gray-400 font-medium">Số lượng: {it.quantity || 0}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-black text-gray-900">
                                          {typeof it.price === 'number' ? `${it.price.toLocaleString('vi-VN')} đ/ngày` : '—'}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="lg:col-span-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tổng quan</p>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Số món</span>
                                    <span className="text-sm font-black text-gray-900">
                                      {(Array.isArray(r.items) ? r.items : []).reduce((sum, it) => sum + (it.quantity || 0), 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Tổng</span>
                                    <span className="text-lg font-black text-blue-600">
                                      {typeof r.total === 'number' ? `${r.total.toLocaleString('vi-VN')} đ` : '—'}
                                    </span>
                                  </div>
                                  {r.payment?.paymentMethod && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">PTTT</span>
                                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                                        {r.payment.paymentMethod}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && visibleRentals.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không có đơn thuê phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminRentals);
