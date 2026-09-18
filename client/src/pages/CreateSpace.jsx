import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpaceForm from '../components/spaces/SpaceForm'
import api from '../lib/api'

export default function CreateSpace() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/spaces', values)
      navigate('/spaces', { replace: true, state: { success: 'Space created successfully.' } })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create this space. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">Spaces</span><h1>Create a space</h1><p>Give your next collection a focused, welcoming home.</p></div></div><SpaceForm onSubmit={handleSubmit} submitting={submitting} submitError={error} submitLabel="Create space" /></div>
}
