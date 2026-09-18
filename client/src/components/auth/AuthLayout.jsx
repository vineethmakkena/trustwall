import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthLayout({ eyebrow, title, intro, children, footer }) {
  return (
    <main className="auth-page">
      <div className="auth-page__aside">
        <Link className="brand brand--light" to="/" aria-label="TrustWall home">
          <span className="brand__mark"><ShieldCheck size={19} /></span>
          TrustWall
        </Link>
        <div>
          <span className="eyebrow eyebrow--light">A better kind of proof</span>
          <h1>Make trust part of the room.</h1>
          <p>Collect the perspective that makes your work easier to believe.</p>
        </div>
        <span className="auth-page__footer">Built for customer-led teams.</span>
      </div>
      <section className="auth-card" aria-labelledby="auth-title">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="auth-title">{title}</h2>
        <p className="auth-card__intro">{intro}</p>
        {children}
        {footer}
      </section>
    </main>
  )
}
