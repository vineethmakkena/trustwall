import { Check, RotateCcw } from 'lucide-react'

export default function SubmissionSuccess({ onSubmitAnother }) {
  return (
    <section className="collect-success" aria-live="polite">
      <div className="collect-success__icon"><Check size={27} /></div>
      <span className="eyebrow">Thank you</span>
      <h2>Your story is on its way.</h2>
      <p>We have received your testimonial. It will be reviewed before it appears publicly.</p>
      <button className="button button--quiet" type="button" onClick={onSubmitAnother}><RotateCcw size={16} /> Submit another</button>
    </section>
  )
}
