import { Camera, LoaderCircle, Save, UserRound } from 'lucide-react'
import { useState } from 'react'
import api from '../../lib/api'

export default function ProfileSettings({ user, onSaved }) {
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(user?.avatar || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const chooseAvatar = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) return setError('Choose a JPG, PNG, or WEBP image.')
    if (selected.size > 5 * 1024 * 1024) return setError('Avatar images must be 5 MB or smaller.')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError(null)
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    if (!name.trim()) return setError('Name is required.')
    setLoading(true); setError(null); setSuccess(null)
    try {
      let avatarUrl = avatar
      if (file) {
        const formData = new FormData()
        formData.append('avatar', file)
        const uploadResponse = await api.post('/uploads/avatar', formData)
        avatarUrl = uploadResponse.data.data.url
      }
      const response = await api.patch('/auth/me/profile', { name: name.trim(), avatar: avatarUrl })
      onSaved(response.data.user)
      setAvatar(avatarUrl); setFile(null); setSuccess('Profile updated successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update your profile.')
    } finally { setLoading(false) }
  }

  return <section className="settings-card"><div className="settings-card__heading"><div className="settings-card__icon"><UserRound size={20} /></div><div><span className="eyebrow">Personal details</span><h2>Profile</h2><p>Update how your workspace identifies you.</p></div></div><form className="settings-form" onSubmit={saveProfile}><div className="settings-avatar"><div className="settings-avatar__image">{preview ? <img src={preview} alt="Profile preview" /> : <Camera size={22} />}</div><label className="button button--quiet" htmlFor="profile-avatar"><Camera size={15} /> Change avatar<input id="profile-avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseAvatar} hidden /></label></div><label>Name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label><label>Email<input value={user?.email || ''} readOnly aria-readonly="true" /><small>Email changes are not available yet.</small></label>{error && <p className="form-message form-message--error" role="alert">{error}</p>}{success && <p className="form-message form-message--success" role="status">{success}</p>}<button className="button button--coral" type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}{loading ? 'Saving...' : 'Save profile'}</button></form></section>
}
