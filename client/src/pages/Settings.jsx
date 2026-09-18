import { LoaderCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import DangerZone from '../components/settings/DangerZone'
import PasswordSettings from '../components/settings/PasswordSettings'
import ProfileSettings from '../components/settings/ProfileSettings'

export default function Settings() {
  const { user, loading, checkAuth } = useAuth()

  if (loading) return <div className="page-status"><LoaderCircle className="spin" size={22} /><span>Loading settings...</span></div>

  return <div className="page-stack settings-page"><div className="page-heading"><div><span className="eyebrow">Workspace</span><h1>Settings</h1><p>Keep your owner profile and account security current.</p></div></div><ProfileSettings key={user?.updatedAt || user?.id} user={user} onSaved={() => checkAuth()} /><PasswordSettings /><DangerZone /></div>
}
