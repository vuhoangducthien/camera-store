import withAdmin from '../../../components/withAdmin';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';

function NewProduct() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </AdminLayout>
  );
}

export default withAdmin(NewProduct);