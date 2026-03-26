import { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import logo from '../assets/English.png';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', location: '', rating: 5, text: '' });
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return toast.error('Please write your review');
    setSubmitting(true);
    try {
      await api.post('/reviews', form);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0505] via-[#6B1414] to-[#0d0202] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Annakshetram" className="h-16 w-auto object-contain" />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary px-6 py-5 text-center">
            <h1 className="font-heading font-bold text-cream text-xl">Share Your Experience</h1>
            <p className="text-cream/60 text-sm mt-1">Your feedback means the world to us</p>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🙏</div>
                <p className="font-heading font-bold text-primary text-xl mb-2">Thank You!</p>
                <p className="text-gray-500 text-sm mb-6">Your review has been submitted and will be visible after approval.</p>
                <button onClick={() => navigate('/')} className="bg-primary text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                  Visit Our Store
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="e.g. Priya Sharma" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="e.g. Bangalore" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform hover:scale-110">
                        <Star className={`w-8 h-8 transition-colors ${(hover || form.rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                  <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })}
                    rows={4} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    placeholder="Tell us about your experience..." />
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full bg-primary text-cream py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
