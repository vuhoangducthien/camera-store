import { useState } from 'react';
import axios from '../utils/axios';
import { useRouter } from 'next/router';

export default function RentalForm({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/rentals', {
        items: [{ productId: product.id, quantity }],
        startDate,
        endDate
      });
      router.push('/rentals');
    } catch (error) {
      alert('Lỗi tạo đơn thuê');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Thuê sản phẩm</h3>
      <div className="mb-4">
        <label>Số lượng:</label>
        <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="border p-2 ml-2" />
      </div>
      <div className="mb-4">
        <label>Ngày bắt đầu:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 ml-2" required />
      </div>
      <div className="mb-4">
        <label>Ngày kết thúc:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 ml-2" required />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Tạo đơn thuê</button>
    </form>
  );
}