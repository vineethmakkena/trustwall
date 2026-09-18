import { CalendarDays, MessageSquareQuote, Star } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

const formatDate = (value) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value))

export default function RecentTestimonials({ testimonials }) {
  return (
    <section className="dashboard-panel recent-testimonials"><div className="dashboard-panel__heading"><div><span className="eyebrow">Latest activity</span><h2>Recent testimonials</h2></div><MessageSquareQuote size={20} /></div>{testimonials.length === 0 ? <div className="dashboard-panel__empty"><MessageSquareQuote size={22} /><p>No testimonials have arrived yet.</p></div> : <div className="recent-testimonials__list">{testimonials.map((testimonial) => <article className="recent-testimonial" key={testimonial.id}><span className="avatar avatar--coral">{testimonial.customerName.charAt(0).toUpperCase()}</span><div className="recent-testimonial__content"><div className="recent-testimonial__top"><strong>{testimonial.customerName}</strong><StatusBadge status={testimonial.status} /></div><p>{testimonial.review}</p><div className="recent-testimonial__meta"><span>{testimonial.company || 'Independent customer'}</span><span className="recent-testimonial__rating">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />)}</span><span><CalendarDays size={11} /> {formatDate(testimonial.submittedAt)}</span></div></div></article>)}</div>}</section>
  )
}
