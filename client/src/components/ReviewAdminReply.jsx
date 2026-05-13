import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '../lib/api';

function getReplyAnonId() {
  const k = 'annakshetram_reply_anon';
  try {
    let id = localStorage.getItem(k);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `a-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(k, id);
    }
    return id;
  } catch {
    return `f-${Date.now()}`;
  }
}

function likedStorageKey(reviewId) {
  return `review_reply_liked_${reviewId}`;
}

/**
 * Minimal admin reply + like UI under a customer review.
 * @param {{ reviewId: string, adminReply?: string, replyLikes?: number, compact?: boolean }} props
 */
export default function ReviewAdminReply({ reviewId, adminReply, replyLikes: initialLikes = 0, compact }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(likedStorageKey(reviewId)) === '1');
    } catch {
      setLiked(false);
    }
  }, [reviewId]);

  if (!adminReply || !String(adminReply).trim()) return null;

  const onLike = async () => {
    if (liked || loading) return;
    setLoading(true);
    try {
      const res = await api.post(`/reviews/${reviewId}/reply-like`, { anonId: getReplyAnonId() });
      const { replyLikes: next, alreadyLiked } = res.data.data;
      setLikes(next);
      setLiked(true);
      try {
        localStorage.setItem(likedStorageKey(reviewId), '1');
      } catch { /* ignore */ }
      if (alreadyLiked) setLiked(true);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-3 rounded-lg bg-primary/[0.04] border border-primary/10 ${compact ? 'px-2.5 py-2' : 'px-3 py-2.5'}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-wide text-primary/80 mb-1 ${compact ? '' : ''}`}>
        Team reply
      </p>
      <p className={`text-text-secondary leading-relaxed ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
        {adminReply.trim()}
      </p>
      <div className={`flex items-center gap-1.5 ${compact ? 'mt-1.5' : 'mt-2'}`}>
        <button
          type="button"
          onClick={onLike}
          disabled={liked || loading}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
            liked
              ? 'text-rose-600 bg-rose-50'
              : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50/80'
          } disabled:opacity-60`}
          aria-label={liked ? 'Liked' : 'Like team reply'}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} strokeWidth={liked ? 0 : 2} />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
}
