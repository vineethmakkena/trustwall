export default function RatingDistribution({ distribution, totalReviews, accentColor }) {
  return (
    <section className="wall-distribution" aria-label="Rating distribution">
      <span className="eyebrow">Rating breakdown</span>
      <div className="wall-distribution__rows">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating] || 0
          const width = totalReviews ? `${(count / totalReviews) * 100}%` : '0%'
          return <div className="wall-distribution__row" key={rating}><span>{rating}</span><div className="wall-distribution__track"><span style={{ backgroundColor: accentColor, width }} /></div><small>{count}</small></div>
        })}
      </div>
    </section>
  )
}
