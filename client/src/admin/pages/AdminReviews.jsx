import { useState, useEffect } from 'react';
import { Star, Trash2, Pencil, Plus, Copy, Check, Link2, X, Save } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const BASE_CLIENT = import.meta.env.VITE_CLIENT_URL || window.location.origin;

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
  const [showGenerate, setShowGenerate] = useState(false);
  const [genForm, setGenForm] = useState({ name: '', location: '' });
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
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

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!genForm.name.trim()) return toast.error('Name is required');
    setGenerating(true);
    try {
      const res = await api.post('/reviews/generate-link', genForm);
      setGeneratedLink(res.data.data.link);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate link');
    }
    setGenerating(false);
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch { toast.error('Delete failed'); }
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

  const submitted = reviews.filter(r => r.text);
  const pending = reviews.filter(r => !r.text);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800">Reviews</h1>
          <p className="text-gray-500 text-sm mt-0.5">{submitted.length} submitted · {pending.length} pending</p>
        </div>
        <button
          onClick={() => { setShowGenerate(true); setGeneratedLink(''); setGenForm({ name: '', location: '' }); }}
          className="flex items-center gap-2 bg-primary text-cream px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Generate Link
        </button>
      </div>

      {/* Generate Link Modal */}
      {showGenerate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Link2 className="w-4 h-4 text-primary" /> Generate Review Link</h2>
              <button onClick={() => setShowGenerate(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {!generatedLink ? (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={genForm.name}
                      onChange={e => setGenForm({ ...genForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="text"
                      value={genForm.location}
                      onChange={e => setGenForm({ ...genForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="e.g. Bangalore"
                    />
                  </div>
                  <button type="submit" disabled={generating} className="w-full bg-primary text-cream py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {generating ? 'Generating...' : 'Generate Link'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-700 text-sm font-medium mb-2">Link generated successfully!</p>
                    <p className="text-xs text-gray-500 break-all bg-white border border-gray-200 rounded-lg p-3 font-mono">{generatedLink}</p>
                  </div>
                  <button
                    onClick={() => copyLink(generatedLink)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-cream py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button onClick={() => { setGeneratedLink(''); setGenForm({ name: '', location: '' }); }} className="w-full text-gray-500 text-sm hover:text-gray-700 py-2">
                    Generate Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Reviews Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No reviews yet. Generate a link to get started.</p>
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
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Link</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map(r => (
                <tr key={r.reviewId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{r.name}</p>
                    {r.location && <p className="text-gray-400 text-xs">{r.location}</p>}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell max-w-xs">
                    {r.text ? (
                      <p className="text-gray-600 text-xs line-clamp-2">{r.text}</p>
                    ) : (
                      <span className="text-gray-300 text-xs italic">Not submitted yet</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {r.text ? <StarDisplay rating={r.rating} /> : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    {!r.text ? (
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full">Pending</span>
                    ) : r.isApproved ? (
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">Visible</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">Hidden</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {r.token && (
                      <button
                        onClick={() => copyLink(`${BASE_CLIENT}/review/${r.token}`)}
                        className="flex items-center gap-1 text-primary hover:text-primary/70 text-xs transition-colors"
                        title="Copy review link"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    )}
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
