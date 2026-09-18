import { AlertCircle, ChevronLeft, ChevronRight, LoaderCircle, MessageSquareQuote } from 'lucide-react'
import { useEffect, useState } from 'react'
import TestimonialCard from '../components/testimonials/TestimonialCard'
import TestimonialFilters from '../components/testimonials/TestimonialFilters'
import TestimonialTable from '../components/testimonials/TestimonialTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import api from '../lib/api'

const actionConfig = {
  approve: { method: 'patch', path: (id) => `/testimonials/${id}/approve`, message: 'Testimonial approved.' },
  reject: { method: 'patch', path: (id) => `/testimonials/${id}/reject`, message: 'Testimonial rejected.' },
  archive: { method: 'patch', path: (id) => `/testimonials/${id}/archive`, message: 'Testimonial archived.' },
  feature: { method: 'patch', path: (id) => `/testimonials/${id}/feature`, message: 'Feature status updated.', body: (value) => ({ isFeatured: value }) },
  like: { method: 'patch', path: (id) => `/testimonials/${id}/like`, message: 'Like status updated.', body: (value) => ({ isLiked: value }) },
  delete: { method: 'delete', path: (id) => `/testimonials/${id}`, message: 'Testimonial deleted.' },
}

export default function Testimonials() {
  const [spaces, setSpaces] = useState([])
  const [selectedSpace, setSelectedSpace] = useState('')
  const [testimonials, setTestimonials] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [loadingSpaces, setLoadingSpaces] = useState(true)
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)

  useEffect(() => {
    let active = true
    const loadSpaces = async () => {
      try {
        const response = await api.get('/spaces')
        if (active) {
          const nextSpaces = response.data.data || []
          setSpaces(nextSpaces)
          setSelectedSpace((current) => current || nextSpaces[0]?._id || '')
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load your spaces.')
      } finally {
        if (active) setLoadingSpaces(false)
      }
    }
    loadSpaces()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!selectedSpace) {
      queueMicrotask(() => setTestimonials([]))
      return undefined
    }

    let active = true
    const loadTestimonials = async () => {
      setError(null)
      try {
        const params = new URLSearchParams({
          status,
          page: String(pagination.page),
          limit: String(pagination.limit),
        })
        if (search.trim()) params.set('search', search.trim())
        const response = await api.get(`/spaces/${selectedSpace}/testimonials?${params.toString()}`)
        if (active) {
          setTestimonials(response.data.data.testimonials || [])
          setPagination((current) => ({ ...current, ...response.data.data.pagination }))
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load testimonials.')
      } finally {
        if (active) setLoadingTestimonials(false)
      }
    }
    loadTestimonials()
    return () => { active = false }
  }, [selectedSpace, status, search, pagination.page, pagination.limit])

  const changeFilter = (update) => {
    setLoadingTestimonials(true)
    setPagination((current) => ({ ...current, page: 1 }))
    update()
  }

  const changePage = (page) => {
    setLoadingTestimonials(true)
    setPagination((current) => ({ ...current, page }))
  }

  const requestAction = (action) => {
    if (action.destructive) setConfirmAction(action)
    else executeAction(action)
  }

  const executeAction = async (action) => {
    const config = actionConfig[action.type]
    setConfirmAction(null)
    setBusyId(action.testimonial.id)
    setError(null)
    setSuccess(null)

    try {
      const response = await api[config.method](config.path(action.testimonial.id), config.body?.(action.value))
      if (action.type === 'delete') {
        setTestimonials((current) => current.filter((item) => item.id !== action.testimonial.id))
      } else {
        setTestimonials((current) => current.map((item) => item.id === action.testimonial.id ? response.data.data : item))
      }
      setSuccess(config.message)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update this testimonial.')
    } finally {
      setBusyId(null)
    }
  }

  const selectedSpaceName = spaces.find((space) => space._id === selectedSpace)?.name
  const pageTitle = selectedSpaceName ? `${selectedSpaceName} testimonials` : 'Testimonials'

  if (loadingSpaces) {
    return <div className="page-status"><LoaderCircle className="spin" size={22} /><span>Loading your spaces...</span></div>
  }

  if (spaces.length === 0) {
    return <div className="empty-dashboard empty-dashboard--short"><div className="empty-dashboard__icon"><MessageSquareQuote size={25} /></div><h2>Create a space first.</h2><p>Testimonials will appear here once customers have something to respond to.</p></div>
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><span className="eyebrow">Moderation</span><h1>{pageTitle}</h1><p>Review the words your customers are ready to share.</p></div>
      </div>
      <TestimonialFilters
        spaces={spaces}
        selectedSpace={selectedSpace}
        onSpaceChange={(value) => {
          setLoadingTestimonials(true)
          setSelectedSpace(value)
          setPagination((current) => ({ ...current, page: 1 }))
        }}
        status={status}
        onStatusChange={(value) => changeFilter(() => setStatus(value))}
        search={search}
        onSearchChange={(value) => changeFilter(() => setSearch(value))}
      />
      {success && <div className="inline-notice inline-notice--success" role="status">{success}</div>}
      {error && <div className="inline-notice inline-notice--error" role="alert"><AlertCircle size={17} />{error}</div>}
      {loadingTestimonials ? <div className="page-status"><LoaderCircle className="spin" size={22} /><span>Loading testimonials...</span></div> : testimonials.length === 0 ? <div className="empty-dashboard empty-dashboard--short"><div className="empty-dashboard__icon"><MessageSquareQuote size={25} /></div><h2>No testimonials here.</h2><p>Try another filter or invite a customer to share their experience.</p></div> : <>
        <TestimonialTable testimonials={testimonials} onAction={requestAction} busyId={busyId} />
        <div className="testimonial-cards">{testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} onAction={requestAction} busy={busyId === testimonial.id} />)}</div>
        <div className="pagination"><span>Showing page {pagination.page} of {pagination.totalPages || 1} · {pagination.total} total</span><div><button className="icon-button" type="button" onClick={() => changePage(pagination.page - 1)} disabled={pagination.page <= 1} aria-label="Previous page"><ChevronLeft size={18} /></button><button className="icon-button" type="button" onClick={() => changePage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} aria-label="Next page"><ChevronRight size={18} /></button></div></div>
      </>}
      {confirmAction && <ConfirmDialog title={`${confirmAction.type === 'delete' ? 'Delete' : confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)} testimonial?`} message={confirmAction.type === 'delete' ? 'This will permanently remove the testimonial from this space.' : 'This changes how the testimonial is handled in your moderation workflow.'} confirmLabel={confirmAction.type === 'delete' ? 'Delete testimonial' : `${confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)} testimonial`} onConfirm={() => executeAction(confirmAction)} onCancel={() => setConfirmAction(null)} loading={busyId === confirmAction.testimonial.id} />}
    </div>
  )
}
