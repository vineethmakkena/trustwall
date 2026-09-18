import { AlertCircle, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SubmissionSuccess from '../components/testimonials/SubmissionSuccess'
import TestimonialForm from '../components/testimonials/TestimonialForm'
import api from '../lib/api'

const fallbackAccent = '#7c3aed'

function isSafeColor(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallbackAccent
}

export default function PublicCollect() {
  const { slug } = useParams()
  const [space, setSpace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let active = true
    const loadSpace = async () => {
      try {
        const response = await api.get(`/public/spaces/${encodeURIComponent(slug)}`)
        if (active) setSpace(response.data.data)
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'This collection is not available right now.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadSpace()
    return () => { active = false }
  }, [slug])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setSubmitError(null)
    setUploadProgress(0)
    try {
      await api.post(`/public/spaces/${encodeURIComponent(slug)}/testimonials`, values, {
        onUploadProgress: (event) => {
          if (event.total) setUploadProgress(Math.round((event.loaded / event.total) * 100))
        },
      })
      setSubmitted(true)
    } catch (requestError) {
      setSubmitError(requestError.response?.data?.message || 'We could not send your testimonial. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <main className="collect-status"><LoaderCircle className="spin" size={24} /><span>Opening the collection...</span></main>
  if (error || !space) return <main className="collect-status collect-status--error"><AlertCircle size={27} /><h1>Collection unavailable</h1><p>{error || 'This collection could not be found.'}</p></main>

  const accentColor = isSafeColor(space.primaryColor)

  return (
    <main className="collect-page" style={{ '--collect-accent': accentColor }}>
      <div className="collect-page__glow" style={{ backgroundColor: accentColor }} />
      <header className="collect-header"><span className="collect-brand"><ShieldCheck size={17} /> TrustWall</span><span className="collect-header__label">Customer story collection</span></header>
      <div className="collect-layout">
        <section className="collect-welcome"><div className="collect-welcome__brand">{space.logoUrl ? <img src={space.logoUrl} alt="" /> : <span>{(space.brandName || space.name).charAt(0).toUpperCase()}</span>}<strong>{space.brandName || space.name}</strong></div><h1>{space.welcomeTitle || 'Share your experience'}</h1><p>{space.welcomeMessage || space.description || 'Your perspective helps others understand what it is like to work with us.'}</p><div className="collect-welcome__rule" style={{ backgroundColor: accentColor }} /><span className="collect-welcome__note">A real experience is worth sharing.</span></section>
        <section className="collect-panel">{submitted ? <SubmissionSuccess onSubmitAnother={() => { setSubmitted(false); setSubmitError(null); setUploadProgress(0) }} /> : <TestimonialForm onSubmit={handleSubmit} submitting={submitting} uploadProgress={uploadProgress} error={submitError} accentColor={accentColor} />}</section>
      </div>
      <footer className="collect-footer">Powered by TrustWall · Your words remain yours.</footer>
    </main>
  )
}
