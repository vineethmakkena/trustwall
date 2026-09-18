import { Edit3, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SpaceCard({ space, onDelete, deleting }) {
  const handleDelete = () => {
    const confirmed = window.confirm(`Delete “${space.name}”? This cannot be undone.`)
    if (confirmed) onDelete(space._id)
  }

  return (
    <article className="space-card">
      <div className="space-card__accent" style={{ backgroundColor: space.primaryColor || '#7c3aed' }} />
      <div className="space-card__body">
        <div className="space-card__topline">
          <span className={`status-badge status-badge--${space.status}`}>{space.status === 'active' ? 'Active' : 'Archived'}</span>
        </div>
        <div className="space-card__identity">
          {space.logoUrl ? <img className="space-card__logo" src={space.logoUrl} alt="" /> : <span className="space-card__logo space-card__logo--fallback">{space.name.charAt(0).toUpperCase()}</span>}
          <div><h2>{space.name}</h2><p>/{space.slug}</p></div>
        </div>
        <p className="space-card__description">{space.description || 'No description added yet.'}</p>
        <div className="space-card__footer">
          <span className="space-card__date">{space.brandName || 'Untitled brand'}</span>
          <div className="space-card__actions">
            <Link className="icon-button" to={`/spaces/${space._id}/edit`} aria-label={`Edit ${space.name}`} title="Edit space"><Edit3 size={16} /></Link>
            <button className="icon-button space-card__delete" type="button" onClick={handleDelete} disabled={deleting} aria-label={`Delete ${space.name}`} title="Delete space"><Trash2 size={16} /></button>
          </div>
        </div>
      </div>
    </article>
  )
}
