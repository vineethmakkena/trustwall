import TestimonialWallCard from './TestimonialWallCard'

export default function TestimonialGrid({ testimonials, accentColor }) {
  return <div className="wall-testimonial-grid">{testimonials.map((testimonial) => <TestimonialWallCard key={testimonial.id} testimonial={testimonial} accentColor={accentColor} />)}</div>
}
