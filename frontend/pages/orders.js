import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

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

  // Map trạng thái backend sang hiển thị
  const statusMap = {
    PENDING: { label: 'Chờ xác nhận', tab: 'pending' },
    PROCESSING: { label: 'Chờ lấy hàng', tab: 'processing' },
    SHIPPED: { label: 'Chờ giao hàng', tab: 'shipped' },
    DELIVERED: { label: 'Đánh giá', tab: 'delivered' },
    CANCELLED: { label: 'Đã hủy', tab: 'cancelled' }
  };

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Chờ lấy hàng' },
    { key: 'shipped', label: 'Chờ giao hàng' },
    { key: 'delivered', label: 'Đánh giá' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => statusMap[order.status]?.tab === activeTab);

  // Hủy đơn hàng
  const cancelOrder = async (orderId) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    try {
      await axios.put(`/orders/${orderId}/cancel`); // cần endpoint này
      toast.success('Đã hủy đơn hàng');
      fetchOrders();
    } catch (error) {
      toast.error('Hủy đơn thất bại');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn mua</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Không có đơn hàng nào
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start border-b pb-2 mb-2">
                <div>
                  <p className="text-sm text-gray-500">Mã đơn: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-500">
                    {statusMap[order.status]?.label || order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tổng: {order.total.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-2">
                {order.items?.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {item.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.quantity * item.price).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút hành động theo trạng thái */}
              <div className="mt-4 flex justify-end gap-2 border-t pt-3">
                {/* Nếu đơn hàng đang ở trạng thái PENDING và chưa thanh toán thì hiển thị nút Thanh toán */}
                {order.status === 'PENDING' && order.paymentStatus === 'PENDING' && (
                  <Link href={`/checkout?orderId=${order.id}`}>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Thanh toán
                    </button>
                  </Link>
                )}
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Hủy đơn
                  </button>
                )}
                {order.status === 'DELIVERED' && (
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Đánh giá
                  </button>
                )}
                <Link href={`/orders/${order.id}`}>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}