import { AlertCircle, LoaderCircle, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import EmptySpaces from '../components/spaces/EmptySpaces'
import SpaceCard from '../components/spaces/SpaceCard'
import api from '../lib/api'

export default function Spaces() {
  const location = useLocation()
  const navigate = useNavigate()
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(() => location.state?.success || null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true
    const loadSpaces = async () => {
      try {
        const response = await api.get('/spaces')
        if (active) setSpaces(response.data.data || [])
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load your spaces.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadSpaces()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (location.state?.success) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  const handleDelete = async (id) => {
    setDeletingId(id)
    setError(null)
    try {
      await api.delete(`/spaces/${id}`)
      setSpaces((current) => current.filter((space) => space._id !== id))
      setSuccess('Space deleted successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete this space.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="page-status"><LoaderCircle className="spin" size={22} /><span>Loading your spaces...</span></div>

  return (
    <div className="page-stack">
      <div className="page-heading"><div><span className="eyebrow">Workspace</span><h1>Spaces</h1><p>Keep each collection focused, easy to share, and ready to grow.</p></div><Link className="button button--coral" to="/spaces/new"><Plus size={17} /> New space</Link></div>
      {success && <div className="inline-notice inline-notice--success" role="status">{success}</div>}
      {error && <div className="inline-notice inline-notice--error" role="alert"><AlertCircle size={17} />{error}</div>}
      {spaces.length === 0 ? <EmptySpaces /> : <div className="spaces-grid">{spaces.map((space) => <SpaceCard key={space._id} space={space} onDelete={handleDelete} deleting={deletingId === space._id} />)}</div>}
    </div>
  )
}
