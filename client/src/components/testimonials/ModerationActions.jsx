import { Archive, Check, Heart, Star, Trash2, X } from 'lucide-react'

export default function ModerationActions({ testimonial, onAction, busy }) {
  const action = (type, options = {}) => onAction({ type, testimonial, ...options })

  return (
    <div className="moderation-actions" aria-label={`Actions for ${testimonial.customerName}`}>
      {testimonial.status === 'pending' && <button className="icon-button moderation-actions__approve" type="button" onClick={() => action('approve')} disabled={busy} aria-label="Approve testimonial" title="Approve"><Check size={16} /></button>}
      {testimonial.status !== 'rejected' && testimonial.status !== 'archived' && <button className="icon-button moderation-actions__reject" type="button" onClick={() => action('reject', { destructive: true })} disabled={busy} aria-label="Reject testimonial" title="Reject"><X size={16} /></button>}
      {testimonial.status !== 'archived' && <button className="icon-button" type="button" onClick={() => action('archive', { destructive: true })} disabled={busy} aria-label="Archive testimonial" title="Archive"><Archive size={16} /></button>}
      <button className={`icon-button ${testimonial.isFeatured ? 'moderation-actions__active' : ''}`} type="button" onClick={() => action('feature', { value: !testimonial.isFeatured })} disabled={busy} aria-label={testimonial.isFeatured ? 'Unfeature testimonial' : 'Feature testimonial'} title={testimonial.isFeatured ? 'Unfeature' : 'Feature'}><Star size={16} fill={testimonial.isFeatured ? 'currentColor' : 'none'} /></button>
      <button className={`icon-button ${testimonial.isLiked ? 'moderation-actions__active' : ''}`} type="button" onClick={() => action('like', { value: !testimonial.isLiked })} disabled={busy} aria-label={testimonial.isLiked ? 'Unlike testimonial' : 'Like testimonial'} title={testimonial.isLiked ? 'Unlike' : 'Like'}><Heart size={16} fill={testimonial.isLiked ? 'currentColor' : 'none'} /></button>
      <button className="icon-button moderation-actions__delete" type="button" onClick={() => action('delete', { destructive: true })} disabled={busy} aria-label="Delete testimonial" title="Delete"><Trash2 size={16} /></button>
    </div>
  )
}
