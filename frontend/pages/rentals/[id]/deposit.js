import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import axios from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function RentalDepositCheckout() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!id) return;

    setLoading(true);
    axios.get(`/rentals/${id}`)
      .then((res) => setRental(res.data))
      .catch(() => {
        toast.error('Không tải được đơn thuê');
        router.push('/rentals');
      })
      .finally(() => setLoading(false));
  }, [authLoading, user, id, router]);

  const days = useMemo(() => {
    if (!rental?.startDate || !rental?.endDate) return 0;
    const s = new Date(rental.startDate);
    const e = new Date(rental.endDate);
    const diff = e.getTime() - s.getTime();
    const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return d <= 0 ? 1 : d;
  }, [rental?.startDate, rental?.endDate]);

  const total = useMemo(() => {
    return typeof rental?.total === 'number' ? rental.total : 0;
  }, [rental?.total]);

  const deposit = useMemo(() => {
    if (!rental) return 0;
    if (typeof rental.deposit === 'number' && rental.deposit > 0) return rental.deposit;
    return total * 0.3;
  }, [rental, total]);

  const handlePayDeposit = async () => {
    if (!id || paying || paymentSuccess) return;
    if (!user?.phone || !user?.address || !user?.cccd) {
      toast.error('Vui lòng cập nhật SĐT, địa chỉ và CCCD trước khi thanh toán cọc');
      router.push('/profile');
      return;
    }
    try {
      setPaying(true);
      await axios.post(`/rentals/${id}/pay`, { paymentMethod, paymentType: 'deposit' });
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push('/rentals');
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thanh toán thất bại');
    } finally {
      setPaying(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Không tìm thấy đơn thuê</h2>
          <Link href="/rentals" className="text-blue-600 font-bold hover:underline">Quay lại đơn thuê</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {paymentSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-black/20 border border-white/30 p-10 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-green-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-green-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-black text-gray-900 tracking-tight">Đã thanh toán cọc thành công</h3>
            <p className="mt-2 text-sm text-gray-500 font-medium">Đang chuyển sang trang đơn thuê...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Thanh toán cọc</h1>
            <p className="text-gray-500 font-medium mt-2">Hoàn tất tiền cọc để xác nhận yêu cầu thuê thiết bị</p>
          </div>
          <Link href="/rentals" className="text-sm font-black text-gray-600 hover:text-blue-600 transition-colors">
            ← Quay lại đơn thuê
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900">Thông tin người thuê</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Họ và tên</p>
                  <p className="text-gray-900 font-bold">{user?.name || 'Chưa cập nhật'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                  <p className="text-gray-900 font-bold">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</p>
                  <p className="text-gray-900 font-bold">{user?.phone || 'Chưa cập nhật'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-gray-900 font-bold">{user?.address || 'Chưa cập nhật'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CCCD</p>
                  <p className="text-gray-900 font-bold">{user?.cccd || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-700 font-medium">
                  Sau khi thanh toán cọc, đơn thuê sẽ được ghi nhận và admin sẽ xử lý xác nhận.
                </p>
              </div>

              {(!user?.phone || !user?.address || !user?.cccd) && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-red-700 font-bold">Thông tin chưa đầy đủ</p>
                    <p className="text-xs text-red-600 font-medium mt-1">Vui lòng cập nhật SĐT, địa chỉ và CCCD trước khi thanh toán cọc.</p>
                    <button
                      onClick={() => router.push('/profile')}
                      className="mt-3 text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700"
                    >
                      Cập nhật ngay →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900">Hình thức thanh toán</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'cash', label: 'Tiền mặt', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'bank', label: 'Chuyển khoản', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
                  { id: 'cod', label: 'Ship COD', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`relative flex flex-col items-center p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-gray-50/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="absolute top-4 right-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      paymentMethod === method.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-gray-400 border border-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                      </svg>
                    </div>
                    <span className={`font-black uppercase tracking-wider text-xs ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'}`}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Đơn thuê của bạn</h3>

              <div className="max-h-60 overflow-y-auto pr-2 mb-6 space-y-4 scrollbar-thin">
                {Array.isArray(rental.items) && rental.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500 font-medium">Số lượng: {item.quantity}</p>
                      <p className="text-xs text-gray-400 font-medium">
                        {typeof item.price === 'number' ? `${item.price.toLocaleString('vi-VN')} đ/ngày` : '—'}
                      </p>
                    </div>
                    <div className="text-sm font-black text-gray-900 whitespace-nowrap">
                      {typeof item.price === 'number' ? (item.price * item.quantity * (days || 1)).toLocaleString('vi-VN') : '—'} đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 mb-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Số ngày thuê</span>
                  <span className="text-sm font-black text-gray-900">{days || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Tổng tiền</span>
                  <span className="text-lg font-black text-gray-900">{total.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Tiền cọc (30%)</span>
                  <span className="text-2xl font-black text-blue-600 tracking-tight">{deposit.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button
                onClick={handlePayDeposit}
                disabled={paying || paymentSuccess || rental.paymentStatus === 'PAID'}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {paying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>ĐANG THANH TOÁN...</span>
                  </>
                ) : (
                  <>
                    <span>THANH TOÁN CỌC</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>

              <p className="mt-6 text-center text-[10px] text-gray-400 font-medium leading-relaxed">
                Bằng việc thanh toán, bạn đồng ý với các <br />
                <span className="text-blue-500 cursor-pointer">Điều khoản & Chính sách</span> của CameraStore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
