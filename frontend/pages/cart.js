import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import CartItem from '../components/CartItem';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { cartItems: cart, fetchCart: refreshGlobalCart } = useCart();
  const [loading, setLoading] = useState(false); // No longer needs to fetch locally

  const removeItem = async (id) => {
    try {
      await axios.delete(`/cart/${id}`);
      refreshGlobalCart(); // Cập nhật số lượng giỏ hàng toàn cục
      toast.success('Đã xóa sản phẩm');
    } catch (error) {
      toast.error('Xóa thất bại');
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await axios.put(`/cart/${id}`, { quantity: newQuantity });
      refreshGlobalCart(); // Cập nhật số lượng giỏ hàng toàn cục
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const checkout = async () => {
    try {
      const res = await axios.post('/orders');
      refreshGlobalCart(); // Làm trống giỏ hàng sau khi checkout
      router.push(`/checkout?orderId=${res.data.id}`);
    } catch (error) {
      toast.error('Lỗi tạo đơn hàng');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 10000000 ? 0 : 50000; // Free ship cho đơn trên 10tr
  const total = subtotal + shipping;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Giỏ hàng của bạn</h1>
            <p className="text-gray-500 font-medium">
              {cart.length > 0 ? `Bạn có ${cart.length} sản phẩm trong giỏ` : 'Giỏ hàng đang trống'}
            </p>
          </div>
          <Link href="/products" className="text-blue-600 font-bold hover:underline flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center shadow-xl shadow-gray-200/50 border border-gray-100 animate-fadeIn">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">
              Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các thiết bị tuyệt vời của chúng tôi!
            </p>
            <Link 
              href="/products" 
              className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              KHÁM PHÁ NGAY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onRemove={removeItem} 
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 sticky top-24">
              <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Tạm tính</span>
                    <span className="text-gray-900">{subtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Phí vận chuyển</span>
                    <span className={shipping === 0 ? 'text-green-500 font-bold' : 'text-gray-900'}>
                      {shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')} đ`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                      Mua thêm {(10000000 - subtotal).toLocaleString('vi-VN')} đ để được FREE SHIP
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-bold">Tổng cộng</span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-blue-600 tracking-tight">
                        {total.toLocaleString('vi-VN')} đ
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">(Đã bao gồm VAT)</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={checkout}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-gray-900/10 hover:bg-black transition-all flex items-center justify-center space-x-3 transform hover:scale-[1.02]"
                >
                  <span>TIẾN HÀNH THANH TOÁN</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04default_api:6A11.955 11.955 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Bảo mật</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Chính hãng</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Đổi trả</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}