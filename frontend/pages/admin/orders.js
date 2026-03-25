import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

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

  const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const statusText = {
    PENDING: 'Chờ xác nhận',
    PROCESSING: 'Chờ lấy hàng',
    SHIPPED: 'Chờ giao hàng',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy'
  };

  const getAdminStatusInfo = (order) => {
    // Phân biệt "Trả hàng" với "Đã hủy" dựa vào paymentStatus
    if (order?.status === 'CANCELLED' && order?.paymentStatus === 'REFUNDED') {
      return { label: 'Trả hàng', tab: 'returned' };
    }
    return {
      label: statusText[order?.status] || order?.status || '—',
      tab:
        order?.status === 'PENDING'
          ? 'pending'
          : order?.status === 'PROCESSING'
            ? 'processing'
            : order?.status === 'SHIPPED'
              ? 'shipped'
              : order?.status === 'DELIVERED'
                ? 'delivered'
                : 'cancelled'
    };
  };

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Chờ lấy hàng' },
    { key: 'shipped', label: 'Chờ giao hàng' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'returned', label: 'Trả hàng' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((o) => getAdminStatusInfo(o).tab === activeTab);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
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
            {filteredOrders.map(o => (
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
                  <p className="text-sm text-gray-600 mt-1">{getAdminStatusInfo(o).label}</p>
                </td>
                <td className="p-3">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {o.status === 'PENDING' && o.paymentStatus === 'PAID' && (
                      <button
                        onClick={() => updateStatus(o.id, 'PROCESSING')}
                        className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600"
                      >
                        Duyệt đơn
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(o.id, 'DELIVERED')}
                      disabled={o.status !== 'SHIPPED' || o.paymentStatus === 'REFUNDED'}
                      className={`px-3 py-1 rounded text-white ${
                        o.status === 'SHIPPED' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Đã giao
                    </button>
                    <button
                      onClick={() => updateStatus(o.id, 'CANCELLED', 'REFUNDED')}
                      disabled={o.status !== 'DELIVERED' || (o.status === 'CANCELLED' && o.paymentStatus === 'REFUNDED')}
                      className={`px-3 py-1 rounded text-white ${
                        o.status === 'DELIVERED' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Trả hàng
                    </button>
                    <button className="text-blue-500 hover:underline">Chi tiết</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <p className="p-4 text-center text-gray-500">Chưa có đơn hàng nào</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminOrders);