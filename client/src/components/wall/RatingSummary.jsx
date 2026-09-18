import { Star } from 'lucide-react'

export default function RatingSummary({ averageRating, totalReviews, accentColor }) {
  return (
    <section className="wall-rating-summary" aria-label="Review summary">
      <div className="wall-rating-summary__score"><strong>{averageRating.toFixed(1)}</strong><div className="wall-stars" style={{ color: accentColor }} aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'} />)}</div><span>Based on {totalReviews} approved {totalReviews === 1 ? 'review' : 'reviews'}</span></div>
    </section>
  )
}
