import { AlertCircle, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SpaceForm from '../components/spaces/SpaceForm'
import api from '../lib/api'

export default function EditSpace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const loadSpace = async () => {
      try {
        const response = await api.get(`/spaces/${id}`)
        if (active) setSpace(response.data.data)
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load this space.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadSpace()
    return () => { active = false }
  }, [id])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError(null)
    try {
      await api.patch(`/spaces/${id}`, values)
      navigate('/spaces', { replace: true, state: { success: 'Space updated successfully.' } })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update this space. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page-status"><LoaderCircle className="spin" size={22} /><span>Loading space...</span></div>
  if (error && !space) return <div className="page-status page-status--error"><AlertCircle size={22} /><p>{error}</p></div>

  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">Spaces</span><h1>Edit space</h1><p>Keep the story and the welcome experience aligned.</p></div></div><SpaceForm space={space} onSubmit={handleSubmit} submitting={submitting} submitError={error} submitLabel="Save changes" /></div>
}
