import { AlertTriangle, LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

export default function DangerZone() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    const password = window.prompt('Enter your current password to permanently delete your TrustWall account:')
    if (password === null) return
    if (!password) return setError('Password is required to delete your account.')
    if (!window.confirm('Delete your account and all spaces and testimonials? This cannot be undone.')) return
    setDeleting(true); setError(null)
    try { await api.delete('/auth/me', { data: { password } }); navigate('/register', { replace: true }) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete your account.') } finally { setDeleting(false) }
  }

  return <section className="danger-zone"><div><span className="eyebrow">Irreversible actions</span><h2>Danger zone</h2><p>Deleting your account permanently removes your spaces and testimonials.</p></div><div className="danger-zone__actions"><button className="button button--quiet" type="button" onClick={async () => { await logout(); navigate('/login', { replace: true }) }}><LogOut size={16} /> Log out</button><button className="button button--danger" type="button" onClick={handleDelete} disabled={deleting}><Trash2 size={16} />{deleting ? 'Deleting...' : 'Delete account'}</button></div>{error && <p className="form-message form-message--error" role="alert"><AlertTriangle size={14} /> {error}</p>}</section>
}
