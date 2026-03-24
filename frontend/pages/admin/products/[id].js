import withAdmin from '../../../components/withAdmin';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      axios
        .get(`/products/${id}`)
        .then((res) => {
          setProduct(res.data);
          setError('');
        })
        .catch((err) => {
          const message = err?.response?.data?.message || 'Khong tai duoc san pham.';
          setError(message);
          setProduct(null);
        });
    }
  }, [id]);

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      </AdminLayout>
    );
  }

  if (!product) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm initialData={product} />
    </AdminLayout>
  );
}

export default withAdmin(EditProduct);