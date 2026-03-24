import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users/admin');
      setUsers(res.data);
    } catch (error) {
      toast.error('Không thể tải người dùng');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.id.substring(0,8)}...</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}</td>
                <td className="p-3">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-4 text-center text-gray-500">Chưa có người dùng nào</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminUsers);