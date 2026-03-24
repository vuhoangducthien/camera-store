import withAdmin from '../../components/withAdmin';               // sửa: thêm một dấu .
import AdminLayout from '../../components/admin/AdminLayout';    // sửa
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';                            // sửa
import { toast } from 'react-hot-toast';

function AdminRentals() {
  const [rentals, setRentals] = useState([]);

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
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/rentals/admin/${id}`, { status });
      toast.success('Cập nhật trạng thái thành công');
      fetchRentals();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const statusOptions = ['PENDING', 'APPROVED', 'RETURNED', 'CANCELLED'];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn thuê</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Mã đơn</th>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-left">Tổng tiền</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Ngày bắt đầu</th>
              <th className="p-3 text-left">Ngày kết thúc</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">{r.id.substring(0, 8)}...</td>
                <td className="p-3">{r.user?.email || 'N/A'}</td>
                <td className="p-3">{r.total.toLocaleString()} đ</td>
                <td className="p-3">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">{new Date(r.startDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(r.endDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <button className="text-blue-500 hover:underline">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rentals.length === 0 && (
          <p className="p-4 text-center text-gray-500">Chưa có đơn thuê nào</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminRentals);