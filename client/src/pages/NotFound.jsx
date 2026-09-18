import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="center-page">
      <div className="center-page__icon"><Compass size={28} /></div>
      <span className="eyebrow">404 / Not found</span>
      <h1>This page wandered off.</h1>
      <p>There is nothing here yet, but your workspace is still right where you left it.</p>
      <Link className="button button--dark" to="/"><ArrowLeft size={17} /> Back home</Link>
    </main>
  )
}
