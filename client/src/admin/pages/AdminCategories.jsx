import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import api, { BASE_URL, imgUrl } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories/admin/all');
      setCategories(res.data.data.categories);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ name: '', description: '' }); setImage(null); setEditing(null); setShowForm(false); };

  const handleEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description }); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (editing) {
        await api.put(`/categories/${editing.categoryId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created!');
      }
      resetForm(); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${categoryId}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Error deleting'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.filter(c => !c.isDeleted).length} active categories</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium shadow-warm">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 font-heading">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Category name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Image</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="input-field cursor-pointer" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea className="input-field resize-none h-20" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-lg p-5 shadow-sm animate-pulse h-24" />)
        ) : categories.map(c => (
          <div key={c.categoryId} className={`bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex gap-4 items-center hover:shadow-md transition-shadow ${c.isDeleted ? 'opacity-50' : ''}`}>
            {c.image ? (
              <img src={imgUrl(c.image)} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Tag className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.description || 'No description'}</p>
              <span className={`inline-flex mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.isDeleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                {c.isDeleted ? 'Deleted' : 'Active'}
              </span>
            </div>
            {!c.isDeleted && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c.categoryId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
