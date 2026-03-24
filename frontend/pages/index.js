import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Gọi AI service để lấy gợi ý
      axios.post('http://localhost:8000/recommend', {
        user_id: user.id,
        history: [] // có thể lấy từ backend nếu có
      })
        .then(res => {
          // res.data.recommendations là mảng product ids
          if (res.data.recommendations?.length) {
            // Lấy chi tiết sản phẩm từ backend
            return Promise.all(res.data.recommendations.map(id => axios.get(`/products/${id}`)));
          }
          return [];
        })
        .then(products => setRecommended(products.map(p => p.data)))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div>
      {/* Hero section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">CameraStore</h1>
        <p className="text-xl mb-8">Mua và thuê máy ảnh chất lượng cao</p>
        <a href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold">
          Khám phá ngay
        </a>
      </section>

      {/* Recommended section */}
      {user && recommended.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Gợi ý dành cho bạn</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {recommended.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}