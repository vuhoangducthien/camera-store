import { useRef, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';

export default function ReviewModal({ order, onClose, onSuccess }) {
  const [reviews, setReviews] = useState({}); // { productId: { rating: 5, comment: '' } }
  const [submitting, setSubmitting] = useState(false);
  const timersRef = useRef({});

  const getFallbackImage = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset="1" stop-color="#f9fafb"/></linearGradient></defs><rect width="96" height="96" rx="20" fill="url(#g)"/><path d="M30 62l12-14 10 12 6-7 8 9" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="38" r="6" fill="#cbd5e1"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  if (!order) return null;

  const handleRatingChange = (productId, rating) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment }
    }));

    if (timersRef.current[productId]) clearTimeout(timersRef.current[productId]);
    const text = String(comment || '').trim();
    if (!text) {
      setReviews((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], sentiment: undefined },
      }));
      return;
    }

    // Debounce sentiment calls per product.
    timersRef.current[productId] = setTimeout(async () => {
      try {
        const res = await axios.post('/ai/sentiment', { text });
        setReviews((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], sentiment: res.data?.sentiment || 'neutral' },
        }));
      } catch {
        setReviews((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], sentiment: 'neutral' },
        }));
      }
    }, 450);
  };

  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return null;
    if (sentiment === 'positive') return { text: 'Positive', cls: 'bg-green-100 text-green-700 border-green-200' };
    if (sentiment === 'negative') return { text: 'Negative', cls: 'bg-red-100 text-red-700 border-red-200' };
    return { text: 'Neutral', cls: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const handleSubmit = async () => {
    // Check if at least one review is filled
    const productsToReview = order.items.filter(item => reviews[item.productId]?.rating);
    if (productsToReview.length === 0) {
      return toast.error('Vui lòng chọn số sao đánh giá cho ít nhất một sản phẩm');
    }

    setSubmitting(true);
    try {
      for (const item of productsToReview) {
        await axios.post('/reviews', {
          productId: item.productId,
          rating: reviews[item.productId].rating,
          comment: reviews[item.productId].comment || ''
        });
      }
      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đánh giá thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Đánh giá sản phẩm</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Đơn hàng: #{order.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-8 scrollbar-thin space-y-8">
          {order.items.map((item) => (
            <div key={item.id} className="space-y-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product?.images?.[0]?.url || getFallbackImage()} 
                    alt={item.product?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Đã mua {item.quantity} sản phẩm</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chất lượng sản phẩm</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(item.productId, star)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        reviews[item.productId]?.rating >= star 
                          ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/20 scale-110' 
                          : 'bg-white text-gray-300 border border-gray-100 hover:border-yellow-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chia sẻ nhận xét</p>
                {(() => {
                  const badge = getSentimentBadge(reviews[item.productId]?.sentiment);
                  if (!badge) return null;
                  return (
                    <div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                  );
                })()}
                <textarea
                  value={reviews[item.productId]?.comment || ''}
                  onChange={(e) => handleCommentChange(item.productId, e.target.value)}
                  placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này nhé..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none text-sm font-medium min-h-[100px] resize-none transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-4 rounded-2xl bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-10 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform hover:scale-[1.02] flex items-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang gửi...</span>
              </>
            ) : (
              <span>Gửi đánh giá</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
