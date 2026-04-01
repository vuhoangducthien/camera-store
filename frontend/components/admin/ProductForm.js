import { useState } from 'react';
import axios from '../../utils/axios';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

// Hàm format số với dấu chấm
const formatNumber = (num) => {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Hàm loại bỏ dấu chấm để lấy số
const unformatNumber = (str) => {
  if (!str) return '';
  return str.replace(/\./g, '');
};

export default function ProductForm({ initialData = {} }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    rentalPrice: initialData.rentalPrice || '',
    stock: initialData.stock || '',
    category: initialData.category || '',
    brand: initialData.brand || '',
    images: initialData.images || [],
  });

  const [displayPrice, setDisplayPrice] = useState(formatNumber(initialData.price || ''));
  const [displayRentalPrice, setDisplayRentalPrice] = useState(formatNumber(initialData.rentalPrice || ''));
  const [displayStock, setDisplayStock] = useState(formatNumber(initialData.stock || ''));
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setDisplayPrice(formatNumber(rawValue));
    setForm({ ...form, price: rawValue });
  };

  const handleRentalPriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setDisplayRentalPrice(formatNumber(rawValue));
    setForm({ ...form, rentalPrice: rawValue });
  };

  const handleStockChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setDisplayStock(formatNumber(rawValue));
    setForm({ ...form, stock: rawValue });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chỉ tải lên tệp hình ảnh');
      return;
    }

    // Kiểm tra kích thước file (ví dụ giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) {
        setForm({ ...form, images: [...form.images, { url: res.data.url }] });
        toast.success('Tải ảnh lên thành công');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Tải ảnh thất bại. Vui lòng kiểm tra lại cấu hình Cloudinary.';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...form,
        price: form.price ? parseInt(form.price) : 0,
        rentalPrice: form.rentalPrice ? parseInt(form.rentalPrice) : null,
        stock: form.stock ? parseInt(form.stock) : 0,
      };
      if (initialData.id) {
        await axios.put(`/products/${initialData.id}`, submitData);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await axios.post('/products', submitData);
        toast.success('Thêm sản phẩm thành công');
      }
      router.push('/admin/products');
    } catch (error) {
      toast.error('Lưu thất bại');
    }
  };

  const categories = [
    'Máy ảnh Mirrorless',
    'Ống kính Prime',
    'Phụ kiện Studio',
    'Gimbal & Drone'
  ];

  const brands = [
    'Canon',
    'Fujifilm',
    'Nikon',
    'Sony',
    'DJI',
    'Zhiyun',
    'Zhiyun-Tech',
    'Khác'
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 max-w-4xl border border-gray-100">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{initialData.id ? 'Cập nhật' : 'Thêm mới'} sản phẩm</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chi tiết thông tin thiết bị</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột trái */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Tên sản phẩm</label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="VD: Sony A7 IV"
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Mô tả chi tiết</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Mô tả các thông số kỹ thuật và tình trạng máy..."
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
              rows="6" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Danh mục</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange}
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Thương hiệu</label>
              <select 
                name="brand" 
                value={form.brand} 
                onChange={handleChange}
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="">Chọn hãng</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Giá bán (VNĐ)</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-black text-blue-600"
                  placeholder="0"
                  required
                />
                <span className="absolute right-4 top-4 text-gray-400 font-bold text-xs uppercase">VNĐ</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Giá thuê / ngày</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={displayRentalPrice}
                  onChange={handleRentalPriceChange}
                  className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-black text-purple-600"
                  placeholder="0"
                />
                <span className="absolute right-4 top-4 text-gray-400 font-bold text-xs uppercase">VNĐ</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Số lượng tồn kho</label>
            <input
              type="text"
              inputMode="numeric"
              value={displayStock}
              onChange={handleStockChange}
              className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Hình ảnh sản phẩm</label>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 transition-all hover:border-blue-300">
              <div className="flex flex-wrap gap-4 mb-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img.url} className="w-24 h-24 object-cover rounded-2xl shadow-md border-2 border-white" />
                    <button 
                      type="button"
                      onClick={() => setForm({...form, images: form.images.filter((_, i) => i !== idx)})}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              {uploading && (
                <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs animate-pulse">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <span>ĐANG TẢI ẢNH LÊN...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-end space-x-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
        >
          Hủy bỏ
        </button>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          {initialData.id ? 'LƯU THAY ĐỔI' : 'TẠO SẢN PHẨM MỚI'}
        </button>
      </div>
    </form>
  );
}