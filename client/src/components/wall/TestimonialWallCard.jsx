import { BadgeCheck, Building2, CalendarDays, Star } from 'lucide-react'

const formatDate = (value) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))

export default function TestimonialWallCard({ testimonial, accentColor }) {
  return (
    <article className={`wall-testimonial-card ${testimonial.isFeatured ? 'wall-testimonial-card--featured' : ''}`}>
      {testimonial.isFeatured && <span className="wall-testimonial-card__featured" style={{ color: accentColor }}><BadgeCheck size={14} /> Featured story</span>}
      <div className="wall-testimonial-card__rating" style={{ color: accentColor }} aria-label={`${testimonial.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />)}</div>
      <blockquote>“{testimonial.review}”</blockquote>
      <div className="wall-testimonial-card__person">{testimonial.avatarUrl ? <img src={testimonial.avatarUrl} alt="" /> : <span className="wall-testimonial-card__avatar" style={{ backgroundColor: accentColor }}>{testimonial.customerName.charAt(0).toUpperCase()}</span>}<div><strong>{testimonial.customerName}</strong>{(testimonial.jobTitle || testimonial.company) && <span>{testimonial.jobTitle}{testimonial.jobTitle && testimonial.company ? ' · ' : ''}{testimonial.company}</span>}</div></div>
      <span className="wall-testimonial-card__date"><CalendarDays size={12} /> {formatDate(testimonial.submittedAt)}</span>
      {testimonial.company && !testimonial.jobTitle && <span className="wall-testimonial-card__company"><Building2 size={12} /> {testimonial.company}</span>}
    </article>
  )
}
