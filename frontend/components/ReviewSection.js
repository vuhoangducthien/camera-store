import { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection({ productId, reviews: initialReviews }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/reviews', { productId, rating, comment });
      setReviews([res.data, ...reviews]);
      setComment('');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h3>
      {user && (
        <form onSubmit={submitReview} className="mb-6">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 mr-2">
            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} sao</option>)}
          </select>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Nhận xét..." className="border p-2 w-full" required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Gửi đánh giá</button>
        </form>
      )}
      <div>
        {reviews.map(r => (
          <div key={r.id} className="border-b py-2">
            <p><strong>{r.user?.name}</strong> - {r.rating} sao</p>
            <p>{r.comment}</p>
            <p className="text-sm text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}