import { KeyRound, LoaderCircle, Save } from 'lucide-react'
import { useState } from 'react'
import PasswordInput from '../ui/PasswordInput'
import api from '../../lib/api'

export default function PasswordSettings() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); setError(null); setSuccess(null)
    if (!values.currentPassword || !values.newPassword) return setError('Current and new passwords are required.')
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.newPassword)) return setError('New password must be 8+ characters with uppercase, lowercase, and a number.')
    if (values.newPassword !== values.confirmPassword) return setError('New passwords do not match.')
    setLoading(true)
    try { await api.patch('/auth/me/password', { currentPassword: values.currentPassword, newPassword: values.newPassword }); setValues({ currentPassword: '', newPassword: '', confirmPassword: '' }); setSuccess('Password changed successfully.') } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to change your password.') } finally { setLoading(false) }
  }
  return <section className="settings-card"><div className="settings-card__heading"><div className="settings-card__icon"><KeyRound size={20} /></div><div><span className="eyebrow">Account security</span><h2>Password</h2><p>Choose a password you do not use elsewhere.</p></div></div><form className="settings-form" onSubmit={submit}><PasswordInput label="Current password" name="currentPassword" value={values.currentPassword} onChange={update} autoComplete="current-password" /><PasswordInput label="New password" name="newPassword" value={values.newPassword} onChange={update} autoComplete="new-password" /><PasswordInput label="Confirm new password" name="confirmPassword" value={values.confirmPassword} onChange={update} autoComplete="new-password" />{error && <p className="form-message form-message--error" role="alert">{error}</p>}{success && <p className="form-message form-message--success" role="status">{success}</p>}<button className="button button--dark" type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}{loading ? 'Changing password...' : 'Change password'}</button></form></section>
}
