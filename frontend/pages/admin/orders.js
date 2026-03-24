import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/orders/admin/${id}`, { status });
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const statusText = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đã giao cho vận chuyển',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy'
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Mã đơn</th>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-left">Tổng tiền</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Ngày đặt</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b">
                <td className="p-3">{o.id.substring(0,8)}...</td>
                <td className="p-3">{o.user?.email}</td>
                <td className="p-3">{o.total.toLocaleString()} đ</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{statusText[s]}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="p-3">
                  <button className="text-blue-500 hover:underline">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-center text-gray-500">Chưa có đơn hàng nào</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminOrders);