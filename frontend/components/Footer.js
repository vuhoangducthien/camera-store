import Link from 'next/link';

export default function Footer() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');
  const boCongThuongSrc = `${backendOrigin}/assets/${encodeURIComponent('công thương.png')}`;

  return (
    <footer className="bg-[#0f0f0f] text-gray-400 py-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Thương hiệu & Liên hệ */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter mb-1">CameraStore</h2>
              <div className="h-0.5 w-8 bg-blue-600 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-blue-600/10 transition-colors flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-0.5">Địa chỉ</h4>
                  <p className="text-xs leading-relaxed text-gray-400">
                    69/68 Đ. Đặng Thuỳ Trâm, An Nhơn,<br />
                    Hồ Chí Minh 70000, Việt Nam
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-blue-600/10 transition-colors flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-0.5">Hotline</h4>
                  <p className="text-lg font-black text-blue-500 tracking-tight leading-none">0978690823</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2: Giờ làm việc */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">Hoạt động</h3>
            <div className="space-y-3">
              <div className="relative p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-500">T2 – T6</span>
                    <span className="text-white font-mono">09:30 – 19:00</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-500">T7 - CN</span>
                    <span className="text-white font-mono">09:30 – 17:00</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-start">
                <img 
                  src={boCongThuongSrc}
                  alt="Bộ Công Thương" 
                  className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Cột 3 & 4: Chính sách & Thông tin */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">Chính sách</h3>
              <ul className="space-y-2.5">
                {['Thanh toán', 'Vận chuyển', 'Bảo hành'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-xs hover:text-blue-500 transition-colors flex items-center">
                      <span className="w-1 h-1 rounded-full bg-blue-600 mr-2.5"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">Thông tin</h3>
              <ul className="space-y-2.5">
                {['Cửa hàng', 'Bảo mật', 'Điều khoản'].map((item, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-xs hover:text-blue-500 transition-colors flex items-center">
                      <span className="w-1 h-1 rounded-full bg-purple-600 mr-2.5"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
        
        {/* Bản quyền */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] tracking-widest uppercase text-gray-600">
          <p>© {new Date().getFullYear()} CameraStore Studio.</p>
          <div className="flex space-x-4 font-bold">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
