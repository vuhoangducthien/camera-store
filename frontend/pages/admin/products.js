import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Không thể tải sản phẩm');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      try {
        await axios.delete(`/products/${id}`);
        toast.success('Xóa thành công');
        fetchProducts();
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Link href="/admin/products/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          Thêm sản phẩm
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Hình ảnh</th>
              <th className="p-3 text-left">Tên sản phẩm</th>
              <th className="p-3 text-left">Giá bán</th>
              <th className="p-3 text-left">Tồn kho</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.id.substring(0,8)}...</td>
                <td className="p-3">
                  {p.images?.[0] && <img src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover" />}
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.price.toLocaleString()} đ</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="text-blue-500 mr-2">Sửa</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminProducts);