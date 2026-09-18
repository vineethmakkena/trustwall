import { Star } from 'lucide-react'

export default function RatingOverview({ averageRating, ratingDistribution, totalApproved }) {
  return (
    <section className="dashboard-panel rating-overview">
      <div className="dashboard-panel__heading"><div><span className="eyebrow">Customer sentiment</span><h2>Rating overview</h2></div><span className="rating-overview__total">{totalApproved} approved</span></div>
      <div className="rating-overview__main"><strong>{averageRating.toFixed(1)}</strong><div><div className="rating-stars" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'} />)}</div><span>Average rating</span></div></div>
      <div className="dashboard-rating-bars">{[5, 4, 3, 2, 1].map((rating) => { const count = ratingDistribution[rating] || 0; const width = totalApproved ? `${(count / totalApproved) * 100}%` : '0%'; return <div className="dashboard-rating-row" key={rating}><span>{rating}<Star size={11} fill="currentColor" /></span><div><i style={{ width }} /></div><small>{count}</small></div> })}</div>
    </section>
  )
}
