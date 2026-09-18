import { BarChart3, Code2, ExternalLink, LayoutDashboard, LogOut, MessageSquareQuote, Settings, ShieldCheck, X } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navigation = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Spaces', to: '/spaces', icon: MessageSquareQuote },
  { label: 'Testimonials', to: '/testimonials', icon: MessageSquareQuote },
  { label: 'Embed', to: '/embed', icon: Code2 },
  { label: 'Insights', to: '/dashboard', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const { logout, actionLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      onClose?.()
    }
  }

  return (
    <>
      {isOpen && <button className="sidebar-backdrop" type="button" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__top">
          <Link className="brand brand--sidebar" to="/dashboard" onClick={onClose}>
            <span className="brand__mark"><ShieldCheck size={19} strokeWidth={2.5} /></span>
            <span>TrustWall</span>
          </Link>
          <button className="icon-button sidebar__close" type="button" onClick={onClose} aria-label="Close navigation">
            <X size={19} />
          </button>
        </div>
        <div className="sidebar__workspace">
          <span className="workspace-dot" />
          <span>Personal workspace</span>
        </div>
        <nav className="sidebar__nav" aria-label="Workspace navigation">
          <span className="sidebar__label">Workspace</span>
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              to={to}
              end={to === '/dashboard'}
              key={label}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Insights' && <span className="sidebar__soon">Soon</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__bottom">
          <Link className="sidebar__help" to="/" onClick={onClose}>
            <ExternalLink size={16} />
            <span>View public wall</span>
          </Link>
          <button className="sidebar__logout" type="button" onClick={handleLogout} disabled={actionLoading}>
            <LogOut size={17} />
            <span>{actionLoading ? 'Signing out...' : 'Sign out'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
