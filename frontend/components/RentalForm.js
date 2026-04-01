import { useEffect, useMemo, useState } from 'react';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function RentalForm({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function fetchBookedDates() {
      if (!product?.id) return;
      try {
        const res = await axios.get(`/rentals/product/${product.id}`);
        const data = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setBookedRanges(data);
      } catch (e) {
        if (!cancelled) setBookedRanges([]);
      }
    }

    fetchBookedDates();
    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  const parseDateOnly = (value) => {
    if (!value) return null;
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };

  const isDateBooked = (dateStr) => {
    const date = parseDateOnly(dateStr);
    if (!date) return false;
    return bookedRanges.some((r) => {
      const start = parseDateOnly(r.start_date || r.startDate);
      const end = parseDateOnly(r.end_date || r.endDate);
      if (!start || !end) return false;
      return date >= start && date <= end;
    });
  };

  const days = useMemo(() => {
    const s = parseDateOnly(startDate);
    const e = parseDateOnly(endDate);
    if (!s || !e) return 0;
    const diff = e.getTime() - s.getTime();
    const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return d <= 0 ? 1 : d;
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    if (!product?.rentalPrice || days === 0) return 0;
    return days * product.rentalPrice * quantity;
  }, [product?.rentalPrice, days, quantity]);

  const deposit = useMemo(() => {
    return totalPrice * 0.3;
  }, [totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isDateBooked(startDate) || isDateBooked(endDate)) {
        toast.error('Khoảng thời gian bạn chọn có ngày đã được thuê');
        return;
      }

      await axios.post('/rentals', {
        items: [{ productId: product.id, quantity }],
        startDate,
        endDate
      });
      toast.success('Tạo đơn thuê thành công!');
      router.push('/rentals');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi tạo đơn thuê');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số lượng thuê</label>
          <div className="flex items-center bg-white rounded-2xl p-1 border border-gray-200">
            <button 
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
            </button>
            <span className="flex-grow text-center font-bold text-gray-900">{quantity}</span>
            <button 
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày bắt đầu</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => {
              const v = e.target.value;
              if (v && isDateBooked(v)) {
                toast.error('Ngày này đã có lịch thuê');
                setStartDate('');
                return;
              }
              setStartDate(v);
            }} 
            className="w-full bg-white border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 transition-all" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày kết thúc</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => {
              const v = e.target.value;
              if (v && isDateBooked(v)) {
                toast.error('Ngày này đã có lịch thuê');
                setEndDate('');
                return;
              }
              setEndDate(v);
            }} 
            className="w-full bg-white border border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700 transition-all" 
            required 
          />
        </div>

        <div className="flex items-end">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-black shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>ĐẶT LỊCH THUÊ</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số ngày thuê</p>
          <p className="mt-1 text-lg font-black text-gray-900">{days || '—'}</p>
        </div>
        <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</p>
          <p className="mt-1 text-lg font-black text-green-600">{totalPrice ? `${totalPrice.toLocaleString('vi-VN')} đ` : '—'}</p>
        </div>
        <div className="bg-white/70 border border-white/60 rounded-2xl p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiền cọc (30%)</p>
          <p className="mt-1 text-lg font-black text-gray-900">{deposit ? `${deposit.toLocaleString('vi-VN')} đ` : '—'}</p>
        </div>
      </div>
    </form>
  );
}
