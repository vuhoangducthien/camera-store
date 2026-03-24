import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import ReviewSection from '../../components/ReviewSection';
import RentalForm from '../../components/RentalForm';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      await axios.post('/cart', { productId: product.id, quantity });
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      toast.error('Thêm thất bại');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      // Backend hiện tạo order TỪ cart, nên "mua ngay" = add vào cart rồi tạo order.
      await axios.post('/cart', { productId: product.id, quantity });
      await axios.post('/orders');
      toast.success('Đặt hàng thành công');
      router.push('/orders');
    } catch (error) {
      toast.error('Đặt hàng thất bại');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.images?.[0]?.url || '/placeholder.jpg'} 
            alt={product.name} 
            className="w-full rounded"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl text-red-600 my-2">{product.price.toLocaleString('vi-VN')} đ</p>
          <p className="text-gray-700">{product.description}</p>
          
          {/* Chọn số lượng */}
          <div className="mt-4 flex items-center">
            <label className="mr-2">Số lượng:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 w-20 rounded"
            />
          </div>

          <div className="mt-4 space-x-2">
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Mua ngay
            </button>
          </div>

          {product.rentalPrice > 0 && <RentalForm product={product} />}
        </div>
      </div>
      <ReviewSection productId={product.id} reviews={product.reviews || []} />
    </div>
  );
}