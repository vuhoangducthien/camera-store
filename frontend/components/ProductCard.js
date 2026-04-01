import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.images?.[0]?.url || '/placeholder.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>
        {product.rentalPrice && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg">
              Có cho thuê
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-xl mb-1 text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-2xl font-black text-blue-600">{product.price.toLocaleString()} đ</span>
          {product.rentalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {/* Giả định giá thuê hiển thị nhỏ hơn nếu cần */}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <span className="text-sm text-gray-500 font-medium italic">
            {product.rentalPrice ? `Thuê: ${product.rentalPrice.toLocaleString()}đ/ngày` : 'Chỉ bán'}
          </span>
          <Link 
            href={`/product/${product.id}`} 
            className="bg-gray-900 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors shadow-md"
            aria-label="Xem chi tiết"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="ArrowRightIcon" />
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}