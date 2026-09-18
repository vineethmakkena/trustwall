import { Building2, CalendarDays, Star } from 'lucide-react'
import ModerationActions from './ModerationActions'
import StatusBadge from '../ui/StatusBadge'

const formatDate = (value) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))

export default function TestimonialTable({ testimonials, onAction, busyId }) {
  return (
    <div className="testimonial-table-wrap">
      <table className="testimonial-table">
        <thead><tr><th>Customer</th><th>Review</th><th>Rating</th><th>Status</th><th>Submitted</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{testimonials.map((testimonial) => <tr key={testimonial.id}>
          <td><div className="table-customer"><span className="avatar avatar--coral">{testimonial.customerName.charAt(0).toUpperCase()}</span><div><strong>{testimonial.customerName}</strong>{testimonial.company && <span><Building2 size={12} /> {testimonial.company}</span>}</div></div></td>
          <td><p className="table-review">{testimonial.review}</p>{testimonial.jobTitle && <small>{testimonial.jobTitle}</small>}</td>
          <td><span className="table-rating" aria-label={`${testimonial.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />)}</span></td>
          <td><StatusBadge status={testimonial.status} /></td>
          <td><span className="table-date"><CalendarDays size={13} /> {formatDate(testimonial.submittedAt)}</span></td>
          <td><ModerationActions testimonial={testimonial} onAction={onAction} busy={busyId === testimonial.id} /></td>
        </tr>)}</tbody>
      </table>
    </div>
  )
}
