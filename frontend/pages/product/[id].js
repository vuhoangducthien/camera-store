import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import ReviewSection from '../../components/ReviewSection';
import RentalForm from '../../components/RentalForm';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
      // Fetch related products
      const relatedRes = await axios.get(`/products?category=${res.data.category}`);
      setRelatedProducts(relatedRes.data.filter(p => p.id !== res.data.id).slice(0, 4));
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
      fetchCart(); // Cập nhật số lượng giỏ hàng toàn cục
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
      const res = await axios.post('/orders/direct', { productId: product.id, quantity });
      router.push(`/checkout?orderId=${res.data.id}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="text-blue-600 font-bold hover:underline">Quay lại cửa hàng</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <img 
                  src={product.images?.[0]?.url || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            
            {/* Additional Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.046A11.955 11.955 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chính hãng 100%</p>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bảo hành 12 tháng</p>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Giao hàng toàn quốc</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/20">
                  {product.brand}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="flex items-center text-green-500 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Còn hàng ({product.stock})
                  </span>
                ) : (
                  <span className="flex items-center text-red-500 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                    Hết hàng
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-end space-x-3">
                <p className="text-4xl font-black text-blue-600 tracking-tighter">
                  {product.price.toLocaleString('vi-VN')} <span className="text-lg uppercase">đ</span>
                </p>
                {product.oldPrice && (
                  <p className="text-xl text-gray-400 line-through font-medium pb-1">
                    {product.oldPrice.toLocaleString('vi-VN')} đ
                  </p>
                )}
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-gray-500 leading-relaxed font-medium">
              {product.description?.length > 200 
                ? `${product.description.substring(0, 200)}...` 
                : product.description}
            </p>

            {/* Purchase Controls */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Số lượng mua</span>
                <div className="flex items-center bg-gray-100/50 rounded-2xl p-1 border border-gray-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${quantity >= product.stock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>THÊM VÀO GIỎ</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-gray-900/10 hover:bg-black transition-all flex items-center justify-center space-x-3 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>MUA NGAY</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Rental Section */}
            {product.rentalPrice > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-[2rem] border border-green-100 shadow-lg shadow-green-600/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">Dịch vụ cho thuê</h3>
                      <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Tiết kiệm chi phí</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-600 tracking-tight">
                      {product.rentalPrice.toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">/ mỗi ngày</p>
                  </div>
                </div>
                <RentalForm product={product} />
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section (Description & Reviews) */}
        <div className="mt-24 space-y-12">
          <div className="flex items-center space-x-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'description' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Mô tả chi tiết
              {activeTab === 'description' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Đánh giá ({product.reviews?.length || 0})
              {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
            </button>
          </div>

          <div className="animate-fadeIn">
            {activeTab === 'description' ? (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                  {product.description.split('\n').map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>
              </div>
            ) : (
              <ReviewSection productId={product.id} reviews={product.reviews || []} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 space-y-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Sản phẩm liên quan</h2>
                <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Có thể bạn cũng thích</p>
              </div>
              <Link href="/products" className="text-blue-600 font-bold hover:underline flex items-center space-x-2">
                <span>Xem tất cả</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
