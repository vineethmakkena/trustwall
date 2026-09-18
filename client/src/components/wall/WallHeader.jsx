import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function WallHeader({ space, accentColor }) {
  return (
    <header className="wall-header">
      <Link className="wall-header__brand" to="/" aria-label="TrustWall home"><ShieldCheck size={17} /> TrustWall</Link>
      <div className="wall-header__rule" />
      <Link className="button wall-header__cta" to={`/collect/${space.slug}`} style={{ backgroundColor: accentColor }}>Leave a testimonial <ArrowRight size={16} /></Link>
    </header>
  )
}
