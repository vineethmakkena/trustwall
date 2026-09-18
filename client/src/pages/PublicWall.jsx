import { AlertCircle, LoaderCircle, MessageSquareQuote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RatingDistribution from '../components/wall/RatingDistribution'
import RatingSummary from '../components/wall/RatingSummary'
import TestimonialGrid from '../components/wall/TestimonialGrid'
import WallHeader from '../components/wall/WallHeader'
import api from '../lib/api'

const fallbackAccent = '#7c3aed'

function getAccentColor(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallbackAccent
}

export default function PublicWall() {
  const { slug } = useParams()
  const [wall, setWall] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const loadWall = async () => {
      try {
        const response = await api.get(`/public/spaces/${encodeURIComponent(slug)}/wall`)
        if (active) setWall(response.data.data)
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'This Wall of Love is not available right now.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadWall()
    return () => { active = false }
  }, [slug])

  if (loading) return <main className="wall-status"><LoaderCircle className="spin" size={25} /><span>Opening the Wall of Love...</span></main>
  if (error || !wall) return <main className="wall-status wall-status--error"><AlertCircle size={28} /><h1>Wall unavailable</h1><p>{error || 'This Wall of Love could not be found.'}</p></main>

  const accentColor = getAccentColor(wall.space.primaryColor)
  const { statistics, testimonials } = wall

  return (
    <main className="wall-page" style={{ '--wall-accent': accentColor }}>
      <WallHeader space={wall.space} accentColor={accentColor} />
      <div className="wall-hero"><div className="wall-hero__brand">{wall.space.logoUrl ? <img src={wall.space.logoUrl} alt="" /> : <span style={{ backgroundColor: accentColor }}>{(wall.space.brandName || wall.space.name).charAt(0).toUpperCase()}</span>}<strong>{wall.space.brandName || wall.space.name}</strong></div><span className="eyebrow">A Wall of Love</span><h1>{wall.space.name}</h1><p>{wall.space.description || wall.space.welcomeMessage || 'See what customers are saying.'}</p></div>
      <div className="wall-summary"><RatingSummary averageRating={statistics.averageRating} totalReviews={statistics.totalApprovedReviews} accentColor={accentColor} /><RatingDistribution distribution={statistics.ratingDistribution} totalReviews={statistics.totalApprovedReviews} accentColor={accentColor} /></div>
      <section className="wall-reviews" aria-labelledby="wall-reviews-title"><div className="wall-reviews__heading"><div><span className="eyebrow">The good words</span><h2 id="wall-reviews-title">What people are saying.</h2></div><span className="wall-reviews__count">{statistics.totalApprovedReviews} approved {statistics.totalApprovedReviews === 1 ? 'story' : 'stories'}</span></div>{testimonials.length === 0 ? <div className="wall-empty"><div className="empty-dashboard__icon"><MessageSquareQuote size={25} /></div><h2>The first story starts here.</h2><p>Be the first to share an experience with {wall.space.brandName || wall.space.name}.</p></div> : <TestimonialGrid testimonials={testimonials} accentColor={accentColor} />}</section>
      <footer className="wall-footer">Powered by TrustWall · Built from real customer voices.</footer>
    </main>
  )
}
