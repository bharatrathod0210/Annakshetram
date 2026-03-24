import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, Star, Package } from 'lucide-react';
import api from '../../lib/api';
import { BASE_URL } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', longDescription: '', categoryId: '', price: '', mrp: '', unit: '500g', stock: '', isFeatured: false, tags: '' });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([api.get('/products/admin/all'), api.get('/categories/admin/all')]);
      setProducts(prodRes.data.data.products);
      setCategories(catRes.data.data.categories);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', longDescription: '', categoryId: '', price: '', mrp: '', unit: '500g', stock: '', isFeatured: false, tags: '' });
    setImages([]);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, longDescription: p.longDescription || '', categoryId: p.categoryId, price: p.price, mrp: p.mrp, unit: p.unit, stock: p.stock, isFeatured: p.isFeatured, tags: p.tags?.join(', ') || '' });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(f => fd.append('images', f));
      if (editing) {
        await api.put(`/products/${editing.productId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
    setSaving(false);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Delete this product? It will be soft-deleted.')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Error deleting product'); }
  };

  const handleRestore = async (productId) => {
    try {
      await api.put(`/products/${productId}`, { isDeleted: false }, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product restored');
      fetchData();
    } catch { toast.error('Error restoring product'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Products</h1>
          <p className="text-gray-500 text-sm">{products.filter(p => !p.isDeleted).length} active products</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium shadow-warm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 font-heading">{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Product name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
                <select className="input-field" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.filter(c => !c.isDeleted).map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Short Description *</label>
                <textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Brief description" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Long Description</label>
                <textarea className="input-field h-28 resize-none" value={form.longDescription} onChange={e => setForm({ ...form, longDescription: e.target.value })} placeholder="Detailed description" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Price (₹) *</label>
                <input type="number" className="input-field" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">MRP (₹) *</label>
                <input type="number" className="input-field" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} required placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Unit</label>
                <input className="input-field" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="500g, 1L, etc." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Stock</label>
                <input type="number" className="input-field" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Tags (comma-separated)</label>
                <input className="input-field" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="organic, gluten-free, satvik" />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-primary" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center gap-1"><Star className="w-4 h-4 text-accent" /> Featured Product</label>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Images (max 5)</label>
                <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files))} className="input-field cursor-pointer" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Product</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-12" /></td>
                    <td className="px-5 py-4"><div className="h-6 bg-gray-100 rounded w-16" /></td>
                    <td className="px-5 py-4"><div className="h-8 bg-gray-100 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : products.map(p => (
                <tr key={p.productId} className={`hover:bg-gray-50 transition-colors ${p.isDeleted ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={`${BASE_URL}${p.images[0]}`} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-primary/40" /></div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.unit} {p.isFeatured && <span className="text-accent ml-1">⭐ Featured</span>}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-primary">{formatPrice(p.price)}</td>
                  <td className="px-5 py-4">{p.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${p.isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {p.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!p.isDeleted ? (
                        <>
                          <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.productId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <button onClick={() => handleRestore(p.productId)} className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded-lg">Restore</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
