import { CalendarDays, Building2, Star } from 'lucide-react'
import ModerationActions from './ModerationActions'
import StatusBadge from '../ui/StatusBadge'

const formatDate = (value) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))

export default function TestimonialCard({ testimonial, onAction, busy }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-card__top"><StatusBadge status={testimonial.status} /><span className="testimonial-card__date"><CalendarDays size={13} /> {formatDate(testimonial.submittedAt)}</span></div>
      <div className="testimonial-card__person"><span className="avatar avatar--coral">{testimonial.customerName.charAt(0).toUpperCase()}</span><div><h2>{testimonial.customerName}</h2>{testimonial.company && <p><Building2 size={13} /> {testimonial.company}{testimonial.jobTitle ? ` · ${testimonial.jobTitle}` : ''}</p>}</div></div>
      <div className="testimonial-card__rating" aria-label={`${testimonial.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />)}</div>
      <p className="testimonial-card__review">“{testimonial.review}”</p>
      <div className="testimonial-card__footer"><ModerationActions testimonial={testimonial} onAction={onAction} busy={busy} /></div>
    </article>
  )
}
