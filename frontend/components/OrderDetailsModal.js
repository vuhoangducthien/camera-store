import { useState, useEffect } from 'react';
import axios from '../utils/axios';

export default function OrderDetailsModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFallbackImage = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset="1" stop-color="#f9fafb"/></linearGradient></defs><rect width="96" height="96" rx="20" fill="url(#g)"/><path d="M30 62l12-14 10 12 6-7 8 9" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="38" r="6" fill="#cbd5e1"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Lỗi tải chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Chi tiết đơn hàng</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Mã đơn: #{order?.id?.toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
          </div>
        ) : order ? (
          <div className="max-h-[70vh] overflow-y-auto p-8 scrollbar-thin">
            {/* Customer & Order Info */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Thông tin khách hàng</h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900">{order.user?.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{order.user?.email}</p>
                  <p className="text-xs text-gray-500 font-medium">{order.user?.address || 'Chưa cập nhật địa chỉ'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Ngày đặt:</span>
                    <span className="text-xs font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Trạng thái:</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Thanh toán:</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-green-50 text-green-600 border border-green-100 uppercase">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Items */}
            <div className="space-y-4 mb-10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Danh sách sản phẩm</h3>
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product?.images?.[0]?.url || getFallbackImage()} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-400 font-medium">Số lượng: {item.quantity} x {item.price.toLocaleString()} đ</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{(item.price * item.quantity).toLocaleString()} đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng cộng</span>
              <span className="text-2xl font-black text-blue-600 tracking-tight">{order.total.toLocaleString()} đ</span>
            </div>
            
            {(order.cancelReason || order.returnReason) && (
              <div className="mt-6 p-6 bg-red-50 rounded-3xl border border-red-100">
                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Thông tin bổ sung</h4>
                <p className="text-sm font-bold text-red-600">
                  {order.cancelReason ? `Lý do hủy: ${order.cancelReason}` : `Lý do trả hàng: ${order.returnReason}`}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            Không tìm thấy thông tin đơn hàng
          </div>
        )}

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-black transition-all transform hover:scale-[1.02]"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
