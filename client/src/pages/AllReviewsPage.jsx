import { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-accent' : 'text-gray-200'}`} fill="currentColor" />
      ))}
    </div>
  );
}

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews')
      .then(r => setReviews(r.data.data.reviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-cream/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="ornament mb-3"><span className="text-accent text-sm">✦</span></div>
          <h1 className="section-title">What Our Families Say</h1>
          <p className="section-subtitle">Real experiences from real people across India</p>

          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-heading font-bold text-primary">{avg}</span>
                <StarDisplay rating={Math.round(avg)} />
                <span className="text-gray-400 text-xs mt-1">{reviews.length} reviews</span>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="flex flex-col items-center gap-1">
                {[5,4,3,2,1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-2">{star}</span>
                      <Star className="w-3 h-3 text-accent" fill="currentColor" />
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Write a review CTA */}
        <div className="flex justify-center mb-10">
          <Link to="/review" className="flex items-center gap-2 bg-primary text-cream px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-warm">
            <MessageCircle className="w-4 h-4" /> Write a Review
          </Link>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-6 animate-pulse">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, s) => <div key={s} className="w-4 h-4 bg-gray-100 rounded" />)}</div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/5 mb-5" />
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 bg-gray-100 rounded-full" />
                  <div><div className="h-3 bg-gray-100 rounded w-20 mb-1" /><div className="h-2 bg-gray-100 rounded w-14" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">No reviews yet</p>
            <p className="text-gray-300 text-sm mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={r.reviewId} className="bg-white rounded-xl border border-border shadow-card p-6 hover:-translate-y-1 transition-all duration-300">
                <StarDisplay rating={r.rating} />
                <p className="text-text-secondary text-sm leading-relaxed my-4 italic">"{r.text}"</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-9 h-9 bg-gradient-maroon rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{r.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{r.name}</p>
                    {r.location && <p className="text-text-light text-xs">{r.location}</p>}
                  </div>
                  <span className="ml-auto text-gray-300 text-xs">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
