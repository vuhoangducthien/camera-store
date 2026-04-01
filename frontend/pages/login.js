import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (submitting) return;
      setSubmitting(true);
      await login(email, password);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute inset-0 auth-animated-bg" />
      <div className="absolute inset-0 auth-grid opacity-60" />

      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl auth-float-slow" />
      <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl auth-float-medium" />

      <div className="relative z-10 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="hidden lg:flex flex-col justify-between rounded-[2.5rem] p-12 bg-white/35 border border-white/40 backdrop-blur-xl shadow-2xl shadow-gray-900/5">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <span className="font-black tracking-tight">CS</span>
                </div>
                <div className="leading-tight">
                  <div className="text-lg font-black tracking-tight text-gray-900">CameraStore</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Studio</div>
                </div>
              </div>

              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Chào mừng trở lại
              </h1>
              <p className="text-gray-600 font-medium leading-relaxed">
                Đăng nhập để quản lý đơn mua, thuê thiết bị và nhận gợi ý sản phẩm phù hợp.
              </p>
            </div>

            <div className="pt-10 border-t border-white/40 flex items-center justify-between">
              <Link href="/" className="text-sm font-black text-gray-700 hover:text-blue-600 transition-colors">
                ← Quay về Trang chủ
              </Link>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Bảo mật • Nhanh chóng
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] p-10 md:p-12 bg-white/70 border border-white/60 backdrop-blur-xl shadow-2xl shadow-gray-900/10">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Đăng nhập</h2>
              <p className="text-sm text-gray-500 font-medium mt-2">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="font-black text-blue-600 hover:text-blue-700 transition-colors">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                    required
                    autoComplete="email"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0l-8 0m12 8H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3 .895 3 2v2H9v-2c0-1.105 1.343-2 3-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V8a5 5 0 0110 0v3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 19h10" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-2xl shadow-blue-600/25 hover:bg-blue-700 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>ĐANG ĐĂNG NHẬP...</span>
                  </>
                ) : (
                  <>
                    <span>ĐĂNG NHẬP</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-4">
                <Link href="/" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">
                  Trang chủ
                </Link>
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
