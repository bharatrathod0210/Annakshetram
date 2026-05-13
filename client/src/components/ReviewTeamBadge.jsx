import { Heart } from 'lucide-react';

/** Shown when at least one admin has liked the customer's review */
export default function ReviewTeamBadge({ count, compact }) {
  const n = Number(count) || 0;
  if (n <= 0) return null;
  return (
    <p
      className={`text-primary/80 font-medium flex items-center gap-1 ${
        compact ? 'text-[10px] mt-1' : 'text-xs mt-1'
      }`}
    >
      <Heart className={compact ? 'w-3 h-3 fill-current shrink-0' : 'w-3.5 h-3.5 fill-current shrink-0'} strokeWidth={0} />
      <span>{compact ? `${n}` : `${n === 1 ? 'Team appreciates this review' : `Team appreciates · ${n}`}`}</span>
    </p>
  );
}
