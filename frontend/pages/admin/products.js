import withAdmin from '../../components/withAdmin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter) {
      result = result.filter(p => 
        p.category?.toLowerCase().trim() === categoryFilter.toLowerCase().trim()
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      toast.error('Không thể tải sản phẩm');
    }
  };

  const categories = [
    'Máy ảnh Mirrorless',
    'Ống kính Prime',
    'Phụ kiện Studio',
    'Gimbal & Drone'
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý kho hàng</h1>
          <p className="text-sm text-gray-400 font-medium">Danh sách toàn bộ thiết bị trong hệ thống</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center space-x-2 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span>THÊM SẢN PHẨM</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-grow w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <div className="w-full md:w-64">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Danh mục / Hãng</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Giá bán</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Tồn kho</th>
                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shadow-sm flex-shrink-0 border-2 border-white group-hover:border-blue-200 transition-all">
                        <img 
                          src={p.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                          alt={p.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {p.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 mb-1 block w-fit">
                      {p.category}
                    </span>
                    <p className="text-xs font-bold text-gray-400">{p.brand}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-blue-600">{p.price.toLocaleString()} đ</p>
                    {p.rentalPrice && <p className="text-[10px] text-purple-500 font-bold italic">Thuê: {p.rentalPrice.toLocaleString()} đ</p>}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className={`font-bold text-sm ${p.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/admin/products/${p.id}`} 
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Xóa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest">Không tìm thấy sản phẩm phù hợp</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminProducts);