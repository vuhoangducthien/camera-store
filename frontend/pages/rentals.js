import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRentals() {
      try {
        const res = await axios.get('/rentals');
        if (!cancelled) setRentals(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) {
          setRentals([]);
          toast.error('Không thể tải danh sách đơn thuê');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRentals();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Đơn thuê của tôi</h1>

      {loading && <p className="text-gray-500">Đang tải...</p>}

      {!loading && rentals.length === 0 && (
        <p className="text-gray-500">Bạn chưa có đơn thuê nào.</p>
      )}

      {rentals.map((rental) => (
        <div key={rental.id} className="border p-4 mb-4 rounded">
          <p>
            <span className="font-semibold">Mã đơn:</span> {rental.id}
          </p>
          <p>
            <span className="font-semibold">Ngày tạo:</span>{' '}
            {rental.createdAt ? new Date(rental.createdAt).toLocaleDateString() : '—'}
          </p>
          <p>
            <span className="font-semibold">Thời gian thuê:</span>{' '}
            {rental.startDate ? new Date(rental.startDate).toLocaleDateString() : '—'} -{' '}
            {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : '—'}
          </p>
          <p>
            <span className="font-semibold">Tổng:</span>{' '}
            {typeof rental.total === 'number' ? rental.total.toLocaleString() : '—'} đ
          </p>
          <p>
            <span className="font-semibold">Trạng thái:</span> {rental.status || '—'}
          </p>

          {Array.isArray(rental.items) && rental.items.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold mb-1">Sản phẩm</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {rental.items.map((it) => (
                  <li key={it.id}>
                    {(it.product?.name || 'Sản phẩm')} × {it.quantity} (
                    {typeof it.price === 'number' ? it.price.toLocaleString() : '—'} đ/ngày)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}