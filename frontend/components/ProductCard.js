import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover mb-2" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600">{product.price.toLocaleString()} đ</p>
      <p className="text-sm text-gray-500">Còn {product.stock} sản phẩm</p>
      <Link href={`/product/${product.id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Xem chi tiết
      </Link>
    </div>
  );
}