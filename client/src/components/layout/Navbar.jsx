import { ArrowRight, Menu, ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/spaces') ||
    location.pathname.startsWith('/settings')

  if (isDashboard) {
    return (
      <header className="dashboard-navbar">
        <button
          className="icon-button menu-trigger"
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="dashboard-navbar__title">
          <span className="eyebrow">Workspace</span>
          <strong>TrustWall</strong>
        </div>
        <div className="dashboard-navbar__user">
          <span className="avatar avatar--small">{user?.name?.charAt(0) || 'O'}</span>
          <span className="dashboard-navbar__name">{user?.name || 'Owner'}</span>
        </div>
      </header>
    )
  }

  return (
    <header className="site-navbar">
      <Link className="brand" to="/" aria-label="TrustWall home">
        <span className="brand__mark"><ShieldCheck size={19} strokeWidth={2.5} /></span>
        <span>TrustWall</span>
      </Link>
      <nav className="site-navbar__links" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#principles">Built for trust</a>
      </nav>
      <div className="site-navbar__actions">
        {user ? (
          <Link className="text-button" to="/dashboard">Open workspace <ArrowRight size={16} /></Link>
        ) : (
          <>
            <Link className="text-button" to="/login">Sign in</Link>
            <Link className="button button--dark button--compact" to="/register">Start collecting <ArrowRight size={16} /></Link>
          </>
        )}
      </div>
    </header>
  )
}
