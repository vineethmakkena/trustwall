import { FolderPlus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptySpaces() {
  return (
    <section className="empty-dashboard empty-dashboard--short">
      <div className="empty-dashboard__icon"><FolderPlus size={25} /></div>
      <h2>No spaces yet.</h2>
      <p>Your first space could be a product launch, a customer story collection, or a living wall of proof.</p>
      <Link className="button button--dark" to="/spaces/new"><Plus size={17} /> Create your first space</Link>
    </section>
  )
}
