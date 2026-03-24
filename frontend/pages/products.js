import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import ProductList from '../components/ProductList';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/products')
      .then((res) => {
        setProducts(res.data);
        setError('');
      })
      .catch((err) => {
        const message = err?.response?.data?.message || 'Khong tai duoc danh sach san pham.';
        setError(message);
        setProducts([]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>
      {error && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <ProductList products={products} />
    </div>
  );
}