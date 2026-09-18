import { Star } from 'lucide-react'

const getPreviewTestimonials = (testimonials, count) => testimonials.slice(0, count)

export default function EmbedPreview({ wall, options }) {
  if (!wall) return <div className="embed-preview__empty"><span className="eyebrow">Live preview</span><h2>Select a space to begin.</h2><p>Your approved testimonials will appear here.</p></div>

  const cards = getPreviewTestimonials(wall.testimonials, options.count)
  const isDark = options.theme === 'dark'
  const previewStyle = { '--embed-radius': `${options.radius}px`, '--embed-accent': wall.space.primaryColor || '#7c3aed' }

  return <div className={`embed-preview__canvas embed-preview__canvas--${options.type} ${isDark ? 'embed-preview__canvas--dark' : ''}`} style={previewStyle}><div className="embed-preview__label">{wall.space.brandName || wall.space.name}<span>Preview</span></div>{options.type === 'badge' ? <div className="embed-badge"><strong>{wall.statistics.averageRating.toFixed(1)}</strong><div>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><span>{wall.statistics.totalApprovedReviews} customer reviews</span></div> : cards.length ? <div className="embed-preview__cards">{cards.map((testimonial) => <article className="embed-preview-card" key={testimonial.id}>{options.showAvatars && (testimonial.avatarUrl ? <img src={testimonial.avatarUrl} alt="" /> : <span className="embed-preview-card__avatar">{testimonial.customerName.charAt(0)}</span>)}<div>{options.showRating && <div className="embed-preview-card__rating">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill={star <= testimonial.rating ? 'currentColor' : 'none'} />)}</div>}<p>“{testimonial.review}”</p><strong>{testimonial.customerName}</strong>{testimonial.company && <small>{testimonial.company}</small>}</div></article>)}</div> : <p className="embed-preview__none">No approved testimonials yet.</p>}</div>
}
