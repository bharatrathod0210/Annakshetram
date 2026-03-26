import { useState, useEffect } from 'react';
import { Star, Trash2, Pencil, X, Save, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/admin');
      setReviews(res.data.data.reviews);
    } catch { toast.error('Failed to load reviews'); }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch { toast.error('Delete failed'); }
  };

  const toggleApprove = async (r) => {
    try {
      await api.put(`/reviews/${r.reviewId}`, { isApproved: !r.isApproved });
      toast.success(r.isApproved ? 'Review hidden' : 'Review approved');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  const startEdit = (r) => {
    setEditing(r.reviewId);
    setEditForm({ name: r.name, location: r.location || '', rating: r.rating, text: r.text, isApproved: r.isApproved });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/reviews/${editing}`, editForm);
      toast.success('Review updated');
      setEditing(null);
      fetchReviews();
    } catch { toast.error('Update failed'); }
    setSaving(false);
  };

  const approved = reviews.filter(r => r.isApproved).length;
  const pending = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800">Reviews</h1>
          <p className="text-gray-500 text-sm mt-0.5">{approved} visible · {pending} pending approval</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-medium">
          Review link: <span className="font-mono text-xs bg-white px-2 py-0.5 rounded-lg border border-primary/20 ml-1">/review</span>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Edit Review</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                  <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setEditForm({ ...editForm, rating: s })}>
                      <Star className={`w-6 h-6 transition-colors ${s <= editForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Review Text</label>
                <textarea value={editForm.text} onChange={e => setEditForm({ ...editForm, text: e.target.value })}
                  rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="approved" checked={editForm.isApproved}
                  onChange={e => setEditForm({ ...editForm, isApproved: e.target.checked })}
                  className="w-4 h-4 accent-primary" />
                <label htmlFor="approved" className="text-sm text-gray-700">Show on website</label>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-primary text-cream py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No reviews yet.</p>
          <p className="text-gray-300 text-xs mt-1">Share <span className="font-mono">/review</span> link with customers</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Review</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Rating</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map(r => (
                <tr key={r.reviewId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{r.name}</p>
                    {r.location && <p className="text-gray-400 text-xs">{r.location}</p>}
                    <p className="text-gray-300 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell max-w-xs">
                    <p className="text-gray-600 text-xs line-clamp-2">{r.text}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StarDisplay rating={r.rating} />
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleApprove(r)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        r.isApproved ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      }`}>
                      {r.isApproved ? <><Eye className="w-3 h-3" /> Visible</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(r)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r.reviewId)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
