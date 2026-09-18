import { CheckCircle2, Copy, ExternalLink, FileText, FolderPlus, LoaderCircle, MessageSquareQuote, Plus, Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingOverview from '../components/dashboard/RatingOverview'
import RecentTestimonials from '../components/dashboard/RecentTestimonials'
import StatCard, { StatCardSkeleton } from '../components/dashboard/StatCard'
import api from '../lib/api'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([api.get('/dashboard/overview'), api.get('/spaces')])
      .then(([overviewResponse, spacesResponse]) => {
        if (!active) return
        setOverview(overviewResponse.data.data)
        setSpaces(spacesResponse.data.data || [])
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Unable to load your dashboard.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const firstSpace = spaces[0]
  const collectionUrl = firstSpace ? `${window.location.origin}/collect/${firstSpace.slug}` : null

  const copyCollectionLink = async () => {
    if (!collectionUrl) return
    await navigator.clipboard.writeText(collectionUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  if (error) return <div className="page-status page-status--error"><Quote size={22} /><p>{error}</p></div>

  return (
    <div className="page-stack dashboard-overview">
      <div className="page-heading dashboard-heading"><div><span className="eyebrow">Overview</span><h1>Good to see you, {user?.name?.split(' ')[0] || 'owner'}.</h1><p>A clear view of the trust your customers are building with you.</p></div><Link className="button button--coral" to="/spaces/new"><Plus size={17} /> Create a space</Link></div>
      {loading ? <div className="dashboard-stat-grid">{[1, 2, 3, 4].map((item) => <StatCardSkeleton key={item} />)}</div> : <div className="dashboard-stat-grid"><StatCard label="Total spaces" value={overview.totalSpaces} icon={FolderPlus} tone="sage" detail="Collections in your workspace" /><StatCard label="Total testimonials" value={overview.totalTestimonials} icon={MessageSquareQuote} tone="butter" detail="All submitted stories" /><StatCard label="Pending review" value={overview.pendingTestimonials} icon={FileText} tone="coral" detail="Waiting for your review" /><StatCard label="Approved" value={overview.approvedTestimonials} icon={CheckCircle2} tone="mint" detail="Ready to share publicly" /></div>}
      {loading ? <div className="dashboard-content-grid"><div className="dashboard-panel dashboard-skeleton" /><div className="dashboard-panel dashboard-skeleton" /></div> : <div className="dashboard-content-grid"><RatingOverview averageRating={overview.averageRating} ratingDistribution={overview.ratingDistribution} totalApproved={overview.approvedTestimonials} /><RecentTestimonials testimonials={overview.recentTestimonials || []} /></div>}
      <section className="quick-actions"><div><span className="eyebrow">Keep momentum</span><h2>What would you like to do?</h2></div><div className="quick-actions__grid"><Link className="quick-action" to="/spaces/new"><span><FolderPlus size={19} /></span><strong>Create Space</strong><small>Start a new collection</small></Link><Link className="quick-action" to="/testimonials"><span><MessageSquareQuote size={19} /></span><strong>View Testimonials</strong><small>Moderate incoming stories</small></Link>{firstSpace ? <Link className="quick-action" to={`/wall/${firstSpace.slug}`}><span><ExternalLink size={19} /></span><strong>Open Public Wall</strong><small>See your social proof</small></Link> : <button className="quick-action" type="button" disabled><span><ExternalLink size={19} /></span><strong>Open Public Wall</strong><small>Create a space first</small></button>}<button className="quick-action" type="button" onClick={copyCollectionLink} disabled={!collectionUrl}><span>{copied ? <CheckCircle2 size={19} /> : <Copy size={19} />}</span><strong>{copied ? 'Link Copied' : 'Copy Collection Link'}</strong><small>{collectionUrl ? 'Share your testimonial form' : 'Create a space first'}</small></button></div></section>
      {loading && <div className="dashboard-loading-note"><LoaderCircle className="spin" size={15} /> Updating your overview...</div>}
    </div>
  )
}
