import { ArrowRight, Check, Quote, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const principles = [
  'Collect feedback without chasing spreadsheets',
  'Turn real customer words into a credible wall',
  'Share proof that feels human and on-brand',
]

export default function Home() {
  return (
    <div className="public-shell">
      <Navbar />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="kicker"><Sparkles size={15} /> Social proof, without the scramble</span>
            <h1>Let your best customers tell the story.</h1>
            <p className="hero-copy__lede">TrustWall gives growing teams one thoughtful place to collect, shape, and share the words that move people to say yes.</p>
            <div className="hero-copy__actions">
              <Link className="button button--coral" to="/register">Create your wall <ArrowRight size={17} /></Link>
              <a className="text-button text-button--quiet" href="#how-it-works">See how it works <ArrowRight size={16} /></a>
            </div>
            <p className="hero-copy__note">No credit card. Start with the voices you already have.</p>
          </div>
          <div className="hero-art" aria-label="A testimonial collection preview">
            <div className="hero-art__grain" />
            <div className="quote-card quote-card--main">
              <div className="quote-card__top"><span className="quote-card__source">Customer story · 02</span><Quote size={20} /></div>
              <blockquote>“TrustWall helped us turn a handful of kind words into the clearest reason to choose us.”</blockquote>
              <div className="quote-card__person"><span className="avatar avatar--coral">M</span><span><strong>Maya Chen</strong><small>Founder, Northstar</small></span></div>
            </div>
            <div className="hero-art__stamp">TRUST<br />IS A<br /><em>practice</em></div>
            <div className="quote-card quote-card--back">“The most useful kind of marketing sounds like a customer.”</div>
          </div>
        </section>
        <section className="principles-section" id="how-it-works">
          <div className="section-intro"><span className="eyebrow">A calmer workflow</span><h2>From kind words to clear proof.</h2></div>
          <div className="principles-list">
            {principles.map((principle, index) => <div className="principle" key={principle}><span>0{index + 1}</span><p>{principle}</p><Check size={17} /></div>)}
          </div>
        </section>
        <section className="closing-section" id="principles">
          <div><span className="eyebrow">Your customers already know</span><h2>Make their confidence visible.</h2></div>
          <Link className="button button--dark" to="/register">Start collecting <ArrowRight size={17} /></Link>
        </section>
      </main>
    </div>
  )
}
