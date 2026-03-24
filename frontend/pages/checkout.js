import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const { orderId } = router.query;
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'bank', 'cod'

  useEffect(() => {
    if (orderId && user) {
      axios.get(`/orders/${orderId}`)
        .then(res => setOrder(res.data))
        .catch(err => {
          toast.error('Không tải được đơn hàng');
          router.push('/orders');
        })
        .finally(() => setLoading(false));
    } else if (!user) {
      router.push('/login');
    }
  }, [orderId, user, router]);

  const handlePayment = async () => {
    try {
      await axios.post(`/orders/${orderId}/pay`, { paymentMethod });
      toast.success('Thanh toán thành công');
      router.push('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thanh toán thất bại');
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (!order) return <div className="text-center py-10">Không tìm thấy đơn hàng</div>;

  // Tính tổng thành tiền (đã có order.total)
  const totalAmount = order.total;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <p className="text-gray-600 mb-6">Vui lòng kiểm tra thông tin Khách hàng, thông tin Giỏ hàng trước khi Đặt hàng.</p>

      {/* Thông tin khách hàng */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Họ tên:</strong> {user?.name || 'Chưa cập nhật'}</p>
            <p><strong>Giới tính:</strong> Nam (tạm)</p>
            <p><strong>Địa chỉ:</strong> {user?.address || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p><strong>Điện thoại:</strong> {user?.phone || 'Chưa cập nhật'}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>CMND/CCCD:</strong> {user?.idCard || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Sản phẩm</th>
                <th className="p-2 text-right">Số lượng</th>
                <th className="p-2 text-right">Đơn giá</th>
                <th className="p-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.product.name}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">{item.price.toLocaleString()} đ</td>
                  <td className="p-2 text-right">{(item.price * item.quantity).toLocaleString()} đ</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan="3" className="p-2 text-right">Tổng thành tiền</td>
                <td className="p-2 text-right">{totalAmount.toLocaleString()} đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hình thức thanh toán */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Hình thức thanh toán</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
              className="mr-2"
            />
            <span>Tiền mặt</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={() => setPaymentMethod('bank')}
              className="mr-2"
            />
            <span>Chuyển khoản</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="mr-2"
            />
            <span>Ship COD</span>
          </label>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
      >
        Đặt hàng
      </button>

      <div className="text-center text-gray-500 text-sm mt-6">
        Bản quyền © bởi CameraStore - 2026. Hành trang tới Tương lai
      </div>
    </div>
  );
}