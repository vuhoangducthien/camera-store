import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchRentals = useCallback(async () => {
    try {
      const res = await axios.get('/rentals');
      setRentals(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setRentals([]);
      toast.error('Không thể tải danh sách đơn thuê');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const normalizeStatusClient = useCallback((status) => {
    const s = String(status || '').trim().toLowerCase();
    const aliases = {
      requested: 'pending',
      active: 'approved',
      completed: 'returned',
      rejected: 'cancelled',
    };
    return aliases[s] || s;
  }, []);

  const canPayDeposit = useCallback((rental) => {
    if (String(rental?.paymentStatus || '') !== 'PENDING') return false;
    const s = normalizeStatusClient(rental?.status);
    return s === 'pending' || s === 'approved';
  }, [normalizeStatusClient]);

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
    REJECTED: 'Từ chối',
  };

  const paymentText = {
    PENDING: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền',
  };

  const getStatusBadgeClass = (status) => {
    switch (String(status || '').toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'APPROVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RETURNED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ACTIVE': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
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
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredRentals = useMemo(() => {
    if (activeTab === 'all') return rentals;
    return rentals.filter((r) => normalizeStatusClient(r.status) === activeTab);
  }, [activeTab, rentals, normalizeStatusClient]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Đơn thuê của bạn</h1>
              <p className="text-gray-500 font-medium">Theo dõi và quản lý lịch sử thuê thiết bị</p>
            </div>
          </div>
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

        {loading ? (
          <div className="grid grid-cols-1 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-200/40 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="h-4 w-56 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-100 rounded-full animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-100 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Bạn chưa có đơn thuê nào</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredRentals.map(rental => {
              const createdAtText = rental.createdAt ? new Date(rental.createdAt).toLocaleDateString('vi-VN') : '—';
              const startText = rental.startDate ? new Date(rental.startDate).toLocaleDateString('vi-VN') : '—';
              const endText = rental.endDate ? new Date(rental.endDate).toLocaleDateString('vi-VN') : '—';
              const items = Array.isArray(rental.items) ? rental.items : [];
              const total = typeof rental.total === 'number' ? rental.total : null;
              const deposit = typeof rental.deposit === 'number' ? rental.deposit : (total === null ? null : total * 0.3);
              const days = (() => {
                if (!rental.startDate || !rental.endDate) return 0;
                const s = new Date(rental.startDate);
                const e = new Date(rental.endDate);
                const diff = e.getTime() - s.getTime();
                const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
                return d <= 0 ? 1 : d;
              })();

              return (
                <div key={rental.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 animate-fadeIn">
                  <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã đơn thuê</p>
                        <p className="font-mono text-sm font-bold text-gray-900 uppercase">#{rental.id.substring(0, 12)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</p>
                        <p className="text-sm font-bold text-gray-900">{startText} → {endText}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ngày tạo: {createdAtText}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPaymentBadgeClass(rental.paymentStatus)}`}>
                        {paymentText[rental.paymentStatus] || rental.paymentStatus || '—'}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadgeClass(rental.status)}`}>
                        {statusText[rental.status] || rental.status || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {items.map(it => (
                      <div key={it.id} className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img
                            src={it.product?.images?.[0]?.url || '/placeholder.jpg'}
                            alt={it.product?.name || 'Sản phẩm'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{it.product?.name || 'Sản phẩm'}</h4>
                          <p className="text-sm text-gray-400 font-medium">
                            Số lượng: {it.quantity || 0} • {typeof it.price === 'number' ? `${it.price.toLocaleString('vi-VN')} đ/ngày` : '—'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900">
                            {typeof it.price === 'number' ? `${(it.price * (it.quantity || 0) * (days || 1)).toLocaleString('vi-VN')} đ` : '—'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiền cọc (30%)</p>
                      <p className="text-sm font-black text-gray-900">{deposit === null ? '—' : `${deposit.toLocaleString('vi-VN')} đ`}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số ngày thuê: {days || '—'}</p>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</p>
                        <p className="text-2xl font-black text-blue-600 tracking-tighter">{total === null ? '—' : `${total.toLocaleString('vi-VN')} đ`}</p>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/rentals/${rental.id}/deposit`}>
                          <button className="px-6 py-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-xl transition-all shadow-sm flex items-center gap-2 group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Chi tiết</span>
                          </button>
                        </Link>

                        {canPayDeposit(rental) && (
                          <Link href={`/rentals/${rental.id}/deposit`}>
                            <button className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                              Thanh toán cọc
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
