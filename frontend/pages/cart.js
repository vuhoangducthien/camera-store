import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import CartItem from '../components/CartItem';
import { useRouter } from 'next/router';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await axios.get('/cart');
    setCart(res.data);
  };

  const removeItem = async (id) => {
    await axios.delete(`/cart/${id}`);
    fetchCart();
  };

  const checkout = async () => {
    try {
      await axios.post('/orders');
      router.push('/orders');
    } catch (error) {
      alert('Lỗi thanh toán');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          {cart.map(item => <CartItem key={item.id} item={item} onRemove={removeItem} />)}
          <div className="mt-4 text-xl font-bold">Tổng: {total.toLocaleString()} đ</div>
          <button onClick={checkout} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded">Thanh toán</button>
        </>
      )}
    </div>
  );
}