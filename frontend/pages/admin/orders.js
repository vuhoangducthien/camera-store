import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';
import OrderDetailsModal from '../../components/OrderDetailsModal';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders/admin');
      setOrders(res.data);
    } catch (error) {
      toast.error('Không thể tải đơn hàng');
    }
  };

  const updateStatus = async (id, status, paymentStatus) => {
    try {
      await axios.put(`/orders/admin/${id}`, { status, ...(paymentStatus ? { paymentStatus } : {}) });
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const statusText = {
    PENDING: 'Chờ xác nhận',
    PROCESSING: 'Chờ lấy hàng',
    SHIPPED: 'Chờ giao hàng',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Trả hàng'
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      case 'RETURNED': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'REFUNDED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const paymentStatusText = {
    PAID: 'Đã thanh toán',
    PENDING: 'Chờ thanh toán',
    REFUNDED: 'Đã hoàn tiền'
  };

  const tabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'PROCESSING', label: 'Chờ lấy hàng' },
    { key: 'SHIPPED', label: 'Chờ giao hàng' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'RETURNED', label: 'Trả hàng' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  const queryNormalized = query.trim().toLowerCase();
  const filteredOrders = orders.filter((o) => {
    if (activeTab !== 'ALL' && o.status !== activeTab) return false;
    if (!queryNormalized) return true;

    const candidates = [
      o.id,
      o.status,
      o.paymentStatus,
      o.total,
      o.createdAt,
      o.user?.id,
      o.user?.name,
      o.user?.email,
      o.user?.phone,
      o.user?.cccd,
      o.user?.address,
      o.payment?.paymentMethod,
      ...(Array.isArray(o.items) ? o.items.map((it) => it.product?.name).filter(Boolean) : []),
    ]
      .filter((v) => v !== null && v !== undefined)
      .map((v) => String(v).toLowerCase());

    return candidates.some((v) => v.includes(queryNormalized));
  });

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-sm text-gray-400 font-medium">Hệ thống quản lý CameraStore Studio v2.0</p>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto pb-px scrollbar-hide">
        {tabs.map((tab) => (
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
              placeholder="Tìm theo mã đơn, khách hàng, sản phẩm, SĐT/CCCD..."
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
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Thanh toán</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày đặt</th>
                <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <span className="font-mono text-xs font-bold text-gray-400">#{o.id.substring(0,8).toUpperCase()}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{o.user?.name || 'Khách vãng lai'}</span>
                      <span className="text-xs text-gray-400 font-medium">{o.user?.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-black text-gray-900">{o.total.toLocaleString()} đ</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit ${getPaymentStatusBadgeClass(o.paymentStatus)}`}>
                        {paymentStatusText[o.paymentStatus] || o.paymentStatus}
                      </span>
                      {o.payment?.paymentMethod && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          PT: {o.payment.paymentMethod === 'cash' ? 'Tiền mặt' : o.payment.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Ship COD'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit ${getStatusBadgeClass(o.status)}`}>
                        {statusText[o.status] || o.status}
                      </span>
                      {o.cancelReason && <p className="text-[10px] text-red-500 font-bold">Lý do hủy: {o.cancelReason}</p>}
                      {o.returnReason && <p className="text-[10px] text-orange-500 font-bold">Lý do trả: {o.returnReason}</p>}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-sm text-gray-500 font-medium">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      {/* Flow: PENDING -> PROCESSING -> SHIPPED -> DELIVERED */}
                      {o.status === 'PENDING' && (
                        <button
                          onClick={() => updateStatus(o.id, 'PROCESSING')}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                        >
                          Chuẩn bị hàng
                        </button>
                      )}
                      {o.status === 'PROCESSING' && (
                        <button
                          onClick={() => updateStatus(o.id, 'SHIPPED')}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
                        >
                          Giao hàng
                        </button>
                      )}
                      {o.status === 'SHIPPED' && (
                        <button
                          onClick={() => updateStatus(o.id, 'DELIVERED')}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
                        >
                          Đã giao
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setSelectedOrderId(o.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors group" 
                        title="Chi tiết"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không có đơn hàng phù hợp</p>
            </div>
          )}
        </div>
      </div>

      <OrderDetailsModal 
        orderId={selectedOrderId} 
        onClose={() => setSelectedOrderId(null)} 
      />
    </AdminLayout>
  );
}

export default withAdmin(AdminOrders);
