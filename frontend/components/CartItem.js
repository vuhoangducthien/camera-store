export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-6 p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-3xl transition-all hover:bg-white/80 group">
      {/* Product Image */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-100">
        <img 
          src={item.product.images?.[0]?.url || '/placeholder.jpg'} 
          alt={item.product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{item.product.name}</h3>
          <button 
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all"
            title="Xóa khỏi giỏ hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xl font-black text-blue-600">
            {item.product.price.toLocaleString('vi-VN')} <span className="text-xs uppercase ml-1">đ</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-100/50 rounded-2xl p-1 border border-gray-200">
            <button 
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
            <button 
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}