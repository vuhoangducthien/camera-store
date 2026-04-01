import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import ProductList from '../components/ProductList';
import { useRouter } from 'next/router';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const categories = [
    'Máy ảnh Mirrorless',
    'Ống kính Prime',
    'Phụ kiện Studio',
    'Gimbal & Drone'
  ];

  const brands = ['Sony', 'Canon', 'Fujifilm', 'Nikon', 'DJI', 'Zhiyun'];

  useEffect(() => {
    const queryString = router.asPath.split('?')[1] || '';
    const params = new URLSearchParams(queryString);
    const categoryQuery = params.get('category') || '';
    const brandQuery = params.get('brand') || '';
    setSelectedCategory(categoryQuery);
    setSelectedBrand(brandQuery);
  }, [router.asPath]);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/products')
      .then((res) => {
        setProducts(res.data);
        setError('');
      })
      .catch((err) => {
        setError('Không thể tải danh sách sản phẩm.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter(p => 
        p.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }
    if (selectedBrand) {
      result = result.filter(p => 
        p.brand?.toLowerCase().trim() === selectedBrand.toLowerCase().trim()
      );
    }
    setFilteredProducts(result);
  }, [selectedCategory, selectedBrand, products]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    router.push('/products');
  };

  return (
    <div className="pb-20">
      {/* Header section */}
      <section className="mb-12 py-16 bg-gray-900 -mx-4 px-4 text-center rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Cửa hàng thiết bị</h1>
          <p className="text-gray-400 max-w-xl mx-auto font-medium tracking-wide">Khám phá bộ sưu tập máy ảnh và ống kính chuyên nghiệp hàng đầu thế giới</p>
        </div>
      </section>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 flex-shrink-0 space-y-10">
          {/* Category Filter */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
              LOẠI THIẾT BỊ
            </h3>
            <div className="space-y-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-between group ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
              THƯƠNG HIỆU
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand === selectedBrand ? '' : brand)}
                  className={`px-3 py-3 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all duration-300 border-2 ${selectedBrand === brand ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-white border-gray-50 text-gray-400 hover:border-purple-200 hover:text-purple-600'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {(selectedCategory || selectedBrand) && (
            <button 
              onClick={clearFilters}
              className="w-full py-4 text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl transition-colors border-2 border-dashed border-red-100"
            >
              XÓA BỘ LỌC
            </button>
          )}
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Result Info */}
          <div className="flex items-center justify-between mb-10 px-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Hiển thị <span className="text-gray-900">{filteredProducts.length}</span> sản phẩm
            </p>
            {(selectedCategory || selectedBrand) && (
              <div className="flex gap-2">
                {selectedCategory && (
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black rounded-full border border-blue-100">
                    {selectedCategory}
                  </span>
                )}
                {selectedBrand && (
                  <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-xs font-black rounded-full border border-purple-100">
                    {selectedBrand}
                  </span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-8 rounded-3xl text-center">
              <p className="text-red-600 font-bold">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <div className="py-40 text-center flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest">Không tìm thấy sản phẩm nào</p>
              <button onClick={clearFilters} className="text-blue-600 font-bold hover:underline">Thử lại với các bộ lọc khác</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
