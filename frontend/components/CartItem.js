export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center border-b py-4">
      <img src={item.product.images?.[0]?.url || '/placeholder.jpg'} alt={item.product.name} className="w-20 h-20 object-cover mr-4" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p>Số lượng: {item.quantity}</p>
        <p>Giá: {item.product.price.toLocaleString()} đ</p>
      </div>
      <button onClick={() => onRemove(item.id)} className="text-red-500">Xóa</button>
    </div>
  );
}