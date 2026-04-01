import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import OrderDetailsModal from '../components/OrderDetailsModal';
import ReviewModal from '../components/ReviewModal';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewingOrder, setReviewingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Không thể tải đơn hàng');
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

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'PROCESSING', label: 'Chờ lấy hàng' },
    { key: 'SHIPPED', label: 'Chờ giao hàng' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'RETURNED', label: 'Trả hàng' },
    { key: 'CANCELLED', label: 'Đã hủy' }
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  const cancelOrder = async (orderId) => {
    const reason = prompt('Vui lòng nhập lý do hủy đơn hàng:');
    if (reason === null) return; // User cancelled prompt
    if (!reason.trim()) return toast.error('Vui lòng nhập lý do');

    try {
      await axios.put(`/orders/${orderId}/cancel`, { reason });
      toast.success('Đã gửi yêu cầu hủy đơn');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hủy đơn thất bại');
    }
  };

  const returnOrder = async (orderId) => {
    const reason = prompt('Vui lòng nhập lý do trả hàng:');
    if (reason === null) return;
    if (!reason.trim()) return toast.error('Vui lòng nhập lý do');

    try {
      await axios.put(`/orders/${orderId}/return`, { reason });
      toast.success('Đã gửi yêu cầu trả hàng');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trả hàng thất bại');
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Đơn mua của bạn</h1>
          <p className="text-gray-500 font-medium">Theo dõi và quản lý lịch sử mua hàng</p>
        </div>

        {/* Tabs */}
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

        {/* Order List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 animate-fadeIn">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã đơn hàng</p>
                      <p className="font-mono text-sm font-bold text-gray-900 uppercase">#{order.id.substring(0,12)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày đặt</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadgeClass(order.status)}`}>
                      {statusText[order.status] || order.status}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img
                          src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{item.product?.name}</h4>
                        <p className="text-sm text-gray-400 font-medium">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{item.price.toLocaleString('vi-VN')} đ</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-col gap-1">
                    {order.cancelReason && (
                      <div className="flex items-center gap-2 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-wider">Lý do hủy: {order.cancelReason}</p>
                      </div>
                    )}
                    {order.returnReason && (
                      <div className="flex items-center gap-2 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-bold uppercase tracking-wider">Lý do trả: {order.returnReason}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thành tiền</p>
                      <p className="text-2xl font-black text-blue-600 tracking-tighter">{order.total.toLocaleString('vi-VN')} đ</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Actions */}
                      <button 
                        onClick={() => setSelectedOrderId(order.id)}
                        className="px-6 py-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 rounded-xl transition-all shadow-sm flex items-center gap-2 group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Chi tiết</span>
                      </button>

                      {order.status === 'PENDING' && order.paymentStatus === 'PENDING' && (
                        <Link href={`/checkout?orderId=${order.id}`}>
                          <button className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                            Thanh toán
                          </button>
                        </Link>
                      )}
                      {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-6 py-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-all"
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <>
                          <button 
                            onClick={() => setReviewingOrder(order)}
                            className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                          >
                            Đánh giá
                          </button>
                          <button
                            onClick={() => returnOrder(order.id)}
                            className="px-6 py-3 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-100 transition-all"
                          >
                            Trả hàng
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Chi tiết đơn hàng */}
        <OrderDetailsModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
        />
        {/* Modal Đánh giá sản phẩm */}
        <ReviewModal 
          order={reviewingOrder} 
          onClose={() => setReviewingOrder(null)} 
          onSuccess={fetchOrders}
        />
      </div>
    </div>
  );
}