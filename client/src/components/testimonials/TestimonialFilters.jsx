import { Search, SlidersHorizontal } from 'lucide-react'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
]

export default function TestimonialFilters({ spaces, selectedSpace, onSpaceChange, status, onStatusChange, search, onSearchChange }) {
  return (
    <section className="testimonial-filters" aria-label="Testimonial filters">
      <div className="testimonial-filters__space"><SlidersHorizontal size={16} /><label htmlFor="testimonial-space">Space</label><select id="testimonial-space" value={selectedSpace} onChange={(event) => onSpaceChange(event.target.value)}><option value="">Select a space</option>{spaces.map((space) => <option value={space._id} key={space._id}>{space.name}</option>)}</select></div>
      <div className="testimonial-filters__controls"><div className="filter-tabs" role="group" aria-label="Filter by status">{filters.map((filter) => <button className={status === filter.value ? 'filter-tab filter-tab--active' : 'filter-tab'} type="button" key={filter.value} onClick={() => onStatusChange(filter.value)} aria-pressed={status === filter.value}>{filter.label}</button>)}</div><label className="search-field"><Search size={16} /><span className="sr-only">Search testimonials</span><input type="search" placeholder="Search testimonials" value={search} onChange={(event) => onSearchChange(event.target.value)} /></label></div>
    </section>
  )
}
