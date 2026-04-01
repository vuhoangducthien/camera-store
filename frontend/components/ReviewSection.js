import { useEffect, useRef, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ReviewSection({ productId, reviews: initialReviews }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState('');
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const sentimentTimerRef = useRef(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Vui lòng chọn số sao');
    setLoading(true);
    try {
      const res = await axios.post('/reviews', { productId, rating, comment });
      setReviews([{ ...res.data, user: { name: user.name } }, ...reviews]);
      setComment('');
      setSentiment('');
      toast.success('Cảm ơn bạn đã đánh giá!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const text = comment.trim();
    if (sentimentTimerRef.current) clearTimeout(sentimentTimerRef.current);

    if (!text) {
      setSentiment('');
      setSentimentLoading(false);
      return;
    }

    // Debounce to avoid calling sentiment API on every keystroke.
    setSentimentLoading(true);
    sentimentTimerRef.current = setTimeout(async () => {
      try {
        const res = await axios.post('/ai/sentiment', { text });
        setSentiment(res.data?.sentiment || 'neutral');
      } catch {
        setSentiment('neutral');
      } finally {
        setSentimentLoading(false);
      }
    }, 450);

    return () => {
      if (sentimentTimerRef.current) clearTimeout(sentimentTimerRef.current);
    };
  }, [comment]);

  const getSentimentBadge = () => {
    if (!sentiment) return null;
    if (sentiment === 'positive') return { text: 'Positive', cls: 'bg-green-100 text-green-700 border-green-200' };
    if (sentiment === 'negative') return { text: 'Negative', cls: 'bg-red-100 text-red-700 border-red-200' };
    return { text: 'Neutral', cls: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  return (
    <div className="space-y-12">
      {/* Review Header & Summary */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 p-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center space-x-8">
            <div className="text-center relative">
              <div className="text-6xl font-black text-gray-900 tracking-tighter leading-none">{averageRating}</div>
              <div className="flex items-center justify-center mt-3 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm inline-block">{reviews.length} đánh giá</p>
            </div>
            <div className="h-20 w-px bg-gray-200 hidden md:block"></div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Đánh giá từ khách hàng</h3>
              <p className="text-sm text-gray-500 font-medium max-w-xs">Tất cả nhận xét đều từ những người đã thực sự trải nghiệm sản phẩm này.</p>
            </div>
          </div>
          
          {user && (
            <button 
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-xl shadow-gray-900/10 hover:bg-black transition-all transform hover:scale-[1.05] active:scale-95 flex items-center gap-3 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>VIẾT ĐÁNH GIÁ</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Review List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            reviews.map((r, idx) => (
              <div key={r.id} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 animate-fadeIn transition-all hover:shadow-2xl hover:shadow-gray-200/60" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                      {r.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{r.user?.name || 'Người dùng'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400 bg-yellow-400/5 px-2 py-0.5 rounded-lg border border-yellow-400/10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${star <= r.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <svg className="absolute -top-4 -left-4 w-10 h-10 text-gray-50 opacity-50" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8H6c0 2.2 1.8 4 4 4v4c-4.4 0-8-3.6-8-8V8h8zm14 0v8h-4c0 2.2 1.8 4 4 4v4c-4.4 0-8-3.6-8-8V8h8z"/></svg>
                  <p className="text-gray-600 font-medium leading-relaxed text-lg relative z-10 pl-2">
                    {r.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Form */}
        <div className="lg:col-span-1 sticky top-24">
          {user ? (
            <div id="review-form" className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Viết đánh giá</h3>
              <form onSubmit={submitReview} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Xếp hạng của bạn</label>
                  <div className="flex items-center justify-center space-x-3 bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100 transition-all focus-within:bg-white focus-within:border-yellow-200 focus-within:shadow-lg focus-within:shadow-yellow-100/50">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all transform hover:scale-125 active:scale-90 ${rating >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-current" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhận xét chi tiết</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {sentimentLoading ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Đang phân tích...</span>
                      ) : (
                        (() => {
                          const badge = getSentimentBadge();
                          if (!badge) return null;
                          return (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge.cls}`}>
                              {badge.text}
                            </span>
                          );
                        })()
                      )}
                    </div>
                  </div>
                  <textarea 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="Sản phẩm này tuyệt vời như thế nào? Hãy cho chúng tôi biết cảm nhận của bạn nhé..." 
                    className="w-full bg-gray-50 border border-gray-100 p-6 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none font-medium text-gray-700 transition-all min-h-[180px] resize-none shadow-inner" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>GỬI ĐÁNH GIÁ NGAY</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[2.5rem] text-center space-y-6 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
              
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tight">Chia sẻ cảm nhận?</h3>
                <p className="text-blue-100 font-medium">Đăng nhập để tham gia cộng đồng đánh giá sản phẩm của chúng tôi.</p>
              </div>
              <button 
                onClick={() => router.push('/login')}
                className="w-full bg-white text-blue-600 py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-gray-50 transition-all transform hover:scale-[1.05] active:scale-95 relative z-10"
              >
                ĐĂNG NHẬP NGAY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
