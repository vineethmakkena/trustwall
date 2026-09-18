import { ArrowUpRight } from 'lucide-react'

export default function StatCard({ label, value, icon: Icon, tone = 'sage', detail }) {
  return (
    <article className={`dashboard-stat dashboard-stat--${tone}`}>
      <div className="dashboard-stat__top"><span>{label}</span><span className="dashboard-stat__icon"><Icon size={17} /></span></div>
      <strong>{value}</strong>
      {detail ? <p>{detail}</p> : <ArrowUpRight className="dashboard-stat__arrow" size={16} />}
    </article>
  )
}

export function StatCardSkeleton() {
  return <article className="dashboard-stat dashboard-stat--skeleton"><span /><strong /><small /></article>
}
