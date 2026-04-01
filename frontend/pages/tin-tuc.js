import { useMemo, useState } from 'react';

export default function TinTuc() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('Tất cả');

  const posts = useMemo(
    () => [
      {
        slug: 'huong-dan-chup-anh',
        title: 'Hướng dẫn chụp ảnh cơ bản cho người mới',
        date: '2026-04-01',
        tags: ['Nhiếp ảnh', 'Hướng dẫn'],
        excerpt: 'Tổng hợp các khái niệm quan trọng như khẩu độ, tốc độ, ISO và cách áp dụng vào thực tế.',
        url: 'https://photographer.vn/huong-dan-chup-anh/',
      },
      {
        slug: 'cach-chup-anh-may-anh-ky-thuat-so',
        title: 'Cách chụp ảnh bằng máy ảnh kỹ thuật số (cầm máy, lấy nét, bố cục)',
        date: '2026-03-31',
        tags: ['Hướng dẫn', 'Kỹ thuật'],
        excerpt: 'Bài hướng dẫn cơ bản: cách cầm máy đúng, thiết lập thông số và mẹo để ảnh không bị nhòe.',
        url: 'https://anhkythuatso.vn/cach-chup-anh-bang-may-anh-ky-thuat-so',
      },
      {
        slug: 'photography-tips-beginners',
        title: '20 Tips for Photography Beginners',
        date: '2026-03-30',
        tags: ['Nhiếp ảnh', 'Mẹo'],
        excerpt: 'Các mẹo chụp ảnh dành cho người mới: bố cục, ánh sáng, góc chụp và thói quen thực hành.',
        url: 'https://www.photoworkout.com/photography-tips-beginners/',
      },
      {
        slug: 'essential-photography-tips-2026',
        title: 'Essential Photography Tips for Beginners (2026 Guide)',
        date: '2026-03-29',
        tags: ['Kỹ thuật', 'Mẹo'],
        excerpt: 'Hướng dẫn thực hành nhanh về khẩu độ, DOF, flash và thiết lập cơ bản để ảnh đẹp hơn.',
        url: 'https://themframes.com/features/photography-tips-for-beginners/',
      },
      {
        slug: 'beginners-guide-photography',
        title: 'Beginner’s Guide to Photography: Capturing Your First Great Shots',
        date: '2026-03-28',
        tags: ['Nhiếp ảnh', 'Cơ bản'],
        excerpt: 'Nhập môn nhiếp ảnh: hiểu khẩu độ, tốc độ, ISO và các nguyên tắc bố cục phổ biến.',
        url: 'https://perceptivx.com/beginners-guide-to-photography-capturing-your-first-great-shots/',
      },
    ],
    []
  );

  const tags = useMemo(() => {
    const set = new Set(['Tất cả']);
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [posts]);

  const queryNormalized = query.trim().toLowerCase();
  const filtered = posts.filter((p) => {
    const tagOk = activeTag === 'Tất cả' || p.tags.includes(activeTag);
    if (!tagOk) return false;
    if (!queryNormalized) return true;
    const candidates = [p.title, p.excerpt, ...p.tags].map((v) => String(v).toLowerCase());
    return candidates.some((v) => v.includes(queryNormalized));
  });

  const getHost = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return 'external';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="relative p-10 md:p-14 bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/60 backdrop-blur text-blue-700 text-xs font-black uppercase tracking-widest">
                CameraStore Studio
              </div>
              <h1 className="mt-5 text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Tin tức
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Mẹo • Hướng dẫn • Cập nhật
                </span>
              </h1>
              <p className="mt-6 text-gray-600 font-medium leading-relaxed max-w-2xl">
                Danh sách tin tức được dẫn link tới các bài viết nhiếp ảnh bên ngoài. Bấm vào bài viết để mở trang tin thật.
              </p>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
                    </svg>
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm bài viết..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 border border-white/70 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none font-medium text-gray-900 transition-all"
                  />
                </div>
                <div className="rounded-2xl bg-white/80 border border-white/70 p-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng bài viết</p>
                  <p className="mt-2 text-3xl font-black text-gray-900 tracking-tight">{posts.length}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTag(t)}
                    className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      activeTag === t
                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/15'
                        : 'bg-white/80 text-gray-600 border-white/70 hover:text-blue-700 hover:border-blue-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((p) => (
                <a
                  key={p.slug}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-left group rounded-[2rem] border border-gray-100 bg-white hover:bg-gray-50/40 transition-all p-7 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{new Date(p.date).toLocaleDateString('vi-VN')}</p>
                      <p className="mt-3 text-xl font-black text-gray-900 tracking-tight leading-snug group-hover:text-blue-700 transition-colors">
                        {p.title}
                      </p>
                      <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-gray-300">
                        Nguồn: {getHost(p.url)}
                      </p>
                      <p className="mt-3 text-sm text-gray-600 font-medium leading-relaxed">{p.excerpt}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.tags.map((tg) => (
                          <span key={tg} className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/15 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0-7L10 14m-4 7h12a2 2 0 002-2V9" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không tìm thấy bài viết phù hợp</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
