import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', ctaText: 'Shop Now', ctaLink: '/products', isActive: 'true', order: '0' });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await api.get('/admin/banners/all'); setBanners(res.data.data.banners); } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ title: '', subtitle: '', ctaText: 'Shop Now', ctaLink: '/products', isActive: 'true', order: '0' }); setImage(null); setEditing(null); setShowForm(false); };

  const handleEdit = (b) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle, ctaText: b.ctaText, ctaLink: b.ctaLink, isActive: b.isActive ? 'true' : 'false', order: b.order.toString() });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (editing) {
        await api.put(`/admin/banners/${editing.bannerId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner updated!');
      } else {
        if (!image) { toast.error('Please add an image'); setSaving(false); return; }
        await api.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner created!');
      }
      resetForm(); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (bannerId) => {
    if (!confirm('Delete this banner?')) return;
    try { await api.delete(`/admin/banners/${bannerId}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Error deleting'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Banners</h1>
          <p className="text-gray-500 text-sm">Manage hero section banners</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium shadow-warm">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 font-heading">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Banner headline" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Subtitle</label>
                <input className="input-field" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Optional subtitle text" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">CTA Button Text</label>
                <input className="input-field" value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">CTA Link</label>
                <input className="input-field" value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Order</label>
                <input type="number" className="input-field" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <select className="input-field" value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Banner Image {!editing && '*'}</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="input-field cursor-pointer" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add Banner'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-lg h-24 animate-pulse shadow-sm" />)
        ) : banners.map(b => (
          <div key={b.bannerId} className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex gap-4 items-center hover:shadow-md transition-shadow ${b.isDeleted ? 'opacity-40' : ''}`}>
            {b.image ? (
              <img src={`http://localhost:5000${b.image}`} alt="" className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-24 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Image className="w-6 h-6 text-primary/40" /></div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{b.title}</p>
              <p className="text-xs text-gray-400">{b.subtitle}</p>
              <div className="flex gap-2 mt-1">
                <span className={`badge text-xs ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                <span className="badge bg-gray-100 text-gray-500 text-xs">Order: {b.order}</span>
              </div>
            </div>
            {!b.isDeleted && (
              <div className="flex gap-2">
                <button onClick={() => handleEdit(b)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(b.bannerId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {banners.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-lg">
            <Image className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No banners yet. Add your first hero banner!</p>
          </div>
        )}
      </div>
    </div>
  );
}
