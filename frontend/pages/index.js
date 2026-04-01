import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy sản phẩm mới nhất
    axios.get('/products')
      .then(res => setLatestProducts(res.data.slice(0, 4)))
      .catch(err => console.log(err));

    if (user) {
      setLoading(true);
      axios.get('/ai/recommend')
        .then((res) => setRecommended(res.data?.recommended_products || []))
        .catch(() => {
          axios.post('/products/recommend', { history: [] })
            .then((fallback) => setRecommended(fallback.data?.products || []))
            .catch(() => setRecommended([]));
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-24 pb-32">
      {/* Hero section */}
      <section className="-mx-4 relative overflow-hidden bg-gray-900 text-white min-h-[70vh] flex items-center">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-left space-y-8 animate-fadeInLeft">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>Hệ thống cho thuê & mua bán máy ảnh số 1</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
                Ghi lại <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Khoảnh khắc
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
                Trải nghiệm thiết bị nhiếp ảnh hàng đầu thế giới. Chúng tôi mang đến giải pháp tối ưu cho mọi nhu cầu từ cá nhân đến chuyên nghiệp.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/products" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center space-x-2">
                  <span>Khám phá ngay</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/rentals" className="group bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-lg font-bold transition-all backdrop-blur-md">
                  Thuê thiết bị
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative animate-fadeInRight">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Camera" 
                  className="rounded-3xl shadow-2xl shadow-blue-500/20 border border-white/10"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl text-gray-900 animate-bounce delay-1000">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sẵn sàng</p>
                    <p className="text-sm font-black">+500 Thiết bị</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Recommended section */}
        {user && recommended.length > 0 && (
          <section className="mb-24">
            <div className="flex flex-col space-y-2 mb-12">
              <span className="text-blue-600 font-black text-sm uppercase tracking-[0.3em]">Cá nhân hóa</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Gợi ý dành cho bạn</h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {recommended.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Categories Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-gray-900">Danh mục chính</h2>
            <div className="hidden md:block h-[2px] flex-grow mx-8 bg-gray-100"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                name: 'Máy ảnh Mirrorless', 
                icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', 
                color: 'bg-blue-500',
                subs: ['Canon', 'Fujifilm', 'Nikon', 'Sony']
              },
              { 
                name: 'Ống kính Prime', 
                icon: 'M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', 
                color: 'bg-purple-500',
                subs: ['Canon', 'Fujifilm', 'Nikon', 'Sony']
              },
              { 
                name: 'Phụ kiện Studio', 
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', 
                color: 'bg-indigo-500',
                subs: ['Đèn Flash & Softbox', 'Chân máy & Monopod', 'Thẻ nhớ & Lưu trữ', 'Túi & Balo chuyên dụng', 'Pin & Bộ sạc chính hãng', 'Kính lọc (Filter) & Cap', 'Rig & Cage quay phim', 'Microphone & Âm thanh']
              },
              { 
                name: 'Gimbal & Drone', 
                icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9', 
                color: 'bg-pink-500',
                subs: ['DJI', 'Zhiyun', 'Zhiyun-Tech', 'Sony Airpeak']
              },
            ].map((cat, idx) => (
              <div key={idx} className="group relative overflow-visible p-8 rounded-3xl bg-white border border-gray-100 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-xl h-48 flex flex-col items-center justify-center text-center">
                <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                
                {/* Mega Menu / Dropdown on Hover */}
                <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-2xl p-4 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-50 scale-95 group-hover:scale-100 origin-top min-w-[220px]">
                  <div className={`grid ${cat.subs.length > 4 ? 'grid-cols-1 gap-1' : 'flex flex-col space-y-2'}`}>
                    {cat.subs.map((sub, sIdx) => (
                      <Link 
                        key={sIdx} 
                        href={`/products?category=${cat.name}&brand=${sub}`} 
                        className="text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-xl transition-all flex items-center justify-between group/item"
                      >
                        <span className="truncate pr-2">{sub}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Products section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-gray-900">Sản phẩm mới</h2>
            <Link href="/products" className="group flex items-center space-x-2 text-blue-600 font-bold">
              <span>Tất cả sản phẩm</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {latestProducts.length > 0 ? (
              latestProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
                Đang chuẩn bị những mẫu mới nhất cho bạn...
              </div>
            )}
          </div>
        </section>

        {/* Features section */}
        <section className="relative mt-32 py-24 bg-blue-600 rounded-[3rem] text-white overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full filter blur-3xl"></div>
          
          <div className="container mx-auto px-12 relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black">Tại sao chọn CameraStore?</h2>
              <p className="text-blue-100 max-w-2xl mx-auto opacity-80">Chúng tôi không chỉ bán thiết bị, chúng tôi đồng hành cùng đam mê của bạn.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/10 hover:bg-white/20 transition-all group">
                <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Chính hãng 100%</h3>
                <p className="text-blue-50/80 leading-relaxed">Mọi sản phẩm đều được kiểm định nghiêm ngặt và bảo hành chính hãng từ Sony, Canon, Fujifilm.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/10 hover:bg-white/20 transition-all group">
                <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Giá thuê linh hoạt</h3>
                <p className="text-blue-50/80 leading-relaxed">Tiết kiệm chi phí với các gói thuê theo ngày hoặc theo tuần. Thủ tục đơn giản, nhận máy ngay.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/10 hover:bg-white/20 transition-all group">
                <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Hỗ trợ bởi AI</h3>
                <p className="text-blue-50/80 leading-relaxed">Hệ thống gợi ý thông minh giúp bạn tìm được thiết bị phù hợp nhất với nhu cầu sử dụng.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
