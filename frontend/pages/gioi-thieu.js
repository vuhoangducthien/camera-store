import Link from 'next/link';

export default function GioiThieu() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="relative p-10 md:p-14 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/60 backdrop-blur text-blue-700 text-xs font-black uppercase tracking-widest">
                CameraStore Studio
              </div>
              <h1 className="mt-5 text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Giới thiệu
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  CameraStore Studio
                </span>
              </h1>
              <p className="mt-6 text-gray-600 font-medium leading-relaxed max-w-2xl">
                CameraStore là hệ thống mua & thuê thiết bị nhiếp ảnh giúp bạn chọn đúng sản phẩm theo nhu cầu, thao tác nhanh ở checkout, quản lý đơn mua/đơn thuê rõ ràng
                và có các tính năng hỗ trợ thông minh để trải nghiệm mượt hơn mỗi ngày.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="px-7 py-4 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/15 hover:bg-black transition-all"
                >
                  Xem sản phẩm
                </Link>
                <Link
                  href="/rentals"
                  className="px-7 py-4 rounded-2xl bg-white border border-gray-100 text-gray-700 text-xs font-black uppercase tracking-widest shadow-sm hover:border-blue-200 hover:text-blue-700 transition-all"
                >
                  Xem đơn thuê
                </Link>
                <Link
                  href="/profile"
                  className="px-7 py-4 rounded-2xl bg-white border border-gray-100 text-gray-700 text-xs font-black uppercase tracking-widest shadow-sm hover:border-blue-200 hover:text-blue-700 transition-all"
                >
                  Cập nhật hồ sơ
                </Link>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
              <div className="lg:col-span-3 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng quan</p>
                <h2 className="mt-3 text-2xl font-black text-gray-900 tracking-tight">Bạn sẽ làm được gì trên CameraStore?</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Mua sản phẩm', desc: 'Đặt mua trực tiếp, theo dõi đơn mua và tình trạng thanh toán theo từng đơn.' },
                    { title: 'Thuê theo lịch', desc: 'Chọn ngày thuê, xem lịch trống, đặt thuê và theo dõi trạng thái đơn thuê.' },
                    { title: 'Thanh toán cọc', desc: 'Thanh toán cọc cho đơn thuê để xác nhận, hiển thị thông tin rõ ràng như một trang checkout.' },
                    { title: 'Quản lý hồ sơ', desc: 'Cập nhật SĐT, địa chỉ, CCCD để dùng xuyên suốt khi mua và khi thuê.' },
                  ].map((f) => (
                    <div key={f.title} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5">
                      <p className="text-sm font-black text-gray-900">{f.title}</p>
                      <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 rounded-[2rem] border border-gray-100 bg-gray-900 p-8 text-white shadow-2xl shadow-gray-900/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Cam kết</p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">Minh bạch & dễ dùng</h3>
                <p className="mt-4 text-sm text-white/75 font-medium leading-relaxed">
                  Trạng thái đơn rõ ràng, thanh toán hiển thị chi tiết, quản trị xử lý theo luồng và kiểm tra lịch thuê để hạn chế trùng lịch.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { k: 'Đơn mua', v: 'Theo dõi trạng thái' },
                    { k: 'Đơn thuê', v: 'Kiểm tra lịch trống' },
                    { k: 'Checkout', v: 'Thông tin đầy đủ' },
                    { k: 'Hỗ trợ', v: 'Chat tư vấn nhanh' },
                  ].map((it) => (
                    <div key={it.k} className="rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{it.k}</p>
                      <p className="mt-2 text-sm font-black text-white">{it.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-[2rem] border border-gray-100 bg-gray-50/30 p-7">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mua nhanh</p>
                <p className="mt-3 text-lg font-black text-gray-900 tracking-tight">Checkout tối ưu</p>
                <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">
                  Đặt mua trực tiếp, theo dõi trạng thái đơn hàng, hiển thị thanh toán rõ ràng và chi tiết.
                </p>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-gray-50/30 p-7">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thuê linh hoạt</p>
                <p className="mt-3 text-lg font-black text-gray-900 tracking-tight">Theo ngày, theo lịch</p>
                <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">
                  Kiểm tra lịch trống, đặt thuê, thanh toán cọc, quản lý trạng thái và xử lý bởi quản trị.
                </p>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-gray-50/30 p-7">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI hỗ trợ</p>
                <p className="mt-3 text-lg font-black text-gray-900 tracking-tight">Gợi ý & tư vấn</p>
                <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">
                  Gợi ý sản phẩm dựa theo lịch sử, chatbot tư vấn nhanh theo nhu cầu và phân tích cảm xúc review.
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              <div className="lg:col-span-3 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Sứ mệnh</h2>
                </div>
                <p className="mt-4 text-gray-600 font-medium leading-relaxed">
                  Giúp người dùng chọn đúng thiết bị với chi phí phù hợp: ai cần mua thì mua nhanh, ai cần dùng ngắn hạn thì thuê dễ. Tập trung vào trải nghiệm
                  mượt, minh bạch và quản lý đơn rõ ràng.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { t: 'Trải nghiệm', d: 'Giao diện gọn, thao tác ít bước, phản hồi rõ ràng.' },
                    { t: 'Tin cậy', d: 'Luồng trạng thái nhất quán cho mua/thuê, dễ theo dõi.' },
                    { t: 'Mở rộng', d: 'Có nền tảng để bổ sung nhiều tính năng theo nhu cầu.' },
                  ].map((v) => (
                    <div key={v.t} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5">
                      <p className="text-sm font-black text-gray-900">{v.t}</p>
                      <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">{v.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Liên hệ</p>
                  <p className="mt-3 text-lg font-black text-gray-900 tracking-tight">CameraStore Studio</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-sm font-bold text-gray-900">Email</span>
                      <span className="text-sm font-medium text-gray-500">admin@camera.vn</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-sm font-bold text-gray-900">Hotline</span>
                      <span className="text-sm font-medium text-gray-500">0900 000 000</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-sm font-bold text-gray-900">Giờ làm việc</span>
                      <span className="text-sm font-medium text-gray-500">08:00 – 22:00</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Câu hỏi nhanh</p>
                  <p className="mt-3 text-lg font-black text-gray-900 tracking-tight">FAQ</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { q: 'Thuê cần những gì?', a: 'Bạn cần cập nhật SĐT, địa chỉ và CCCD trong hồ sơ để thao tác thanh toán/đặt thuê nhanh.' },
                      { q: 'Cọc thuê là bao nhiêu?', a: 'Cọc được tính theo tỷ lệ trên tổng tiền thuê và hiển thị rõ ở trang thanh toán cọc.' },
                      { q: 'Mua nhanh có cần qua giỏ hàng không?', a: 'Không. Bạn có thể bấm mua ngay để đi thẳng checkout.' },
                      { q: 'Chatbot tư vấn theo gì?', a: 'Chatbot dựa trên keyword nhu cầu để gợi ý nhanh, phù hợp cho tư vấn cơ bản.' },
                    ].map((it) => (
                      <div key={it.q} className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5">
                        <p className="text-sm font-black text-gray-900">{it.q}</p>
                        <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">{it.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-gray-100 bg-white p-10 shadow-sm">
              <div className="flex items-center justify-between gap-6 flex-col md:flex-row md:items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hướng dẫn</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-900 tracking-tight">Quy trình mua & thuê</h2>
                </div>
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/15 hover:bg-black transition-all"
                >
                  Bắt đầu ngay
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[2rem] border border-gray-100 bg-gray-50/40 p-7">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mua sản phẩm</p>
                  <ol className="mt-4 space-y-3 text-sm text-gray-700 font-medium">
                    <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">1</span>Chọn sản phẩm và bấm mua/checkout.</li>
                    <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">2</span>Kiểm tra thông tin nhận hàng và thanh toán.</li>
                    <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">3</span>Theo dõi đơn mua theo trạng thái: chờ xác nhận → giao → đã giao.</li>
                  </ol>
                </div>

                <div className="rounded-[2rem] border border-gray-100 bg-gray-50/40 p-7">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thuê thiết bị</p>
                  <ol className="mt-4 space-y-3 text-sm text-gray-700 font-medium">
                    <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">1</span>Chọn ngày thuê và kiểm tra lịch trống.</li>
                    <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">2</span>Tạo đơn thuê và thanh toán cọc để xác nhận.</li>
                    <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">3</span>Theo dõi đơn thuê: đang xử lý → đã duyệt → đã trả.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
