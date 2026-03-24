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
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, images: [...form.images, { url: res.data.url }] });
      toast.success('Tải ảnh lên thành công');
    } catch (error) {
      toast.error('Tải ảnh thất bại');
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl">
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tên sản phẩm</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Mô tả</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" rows="4" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Giá bán (VNĐ)</label>
          <input
            type="text"
            inputMode="numeric"
            value={displayPrice}
            onChange={handlePriceChange}
            className="w-full border p-2 rounded"
            placeholder="0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Giá thuê (theo ngày)</label>
          <input
            type="text"
            inputMode="numeric"
            value={displayRentalPrice}
            onChange={handleRentalPriceChange}
            className="w-full border p-2 rounded"
            placeholder="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Số lượng tồn kho</label>
          <input
            type="text"
            inputMode="numeric"
            value={displayStock}
            onChange={handleStockChange}
            className="w-full border p-2 rounded"
            placeholder="0"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Danh mục</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Thương hiệu</label>
        <input type="text" name="brand" value={form.brand} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Hình ảnh</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.images.map((img, idx) => (
            <img key={idx} src={img.url} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        {uploading && <span className="ml-2">Đang tải...</span>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
        {initialData.id ? 'Cập nhật' : 'Thêm mới'} sản phẩm
      </button>
    </form>
  );
}