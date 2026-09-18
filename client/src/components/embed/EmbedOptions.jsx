import { Grid2X2, Images, LayoutTemplate, Moon, Sun } from 'lucide-react'

const types = [
  { value: 'grid', label: 'Grid', icon: Grid2X2 },
  { value: 'carousel', label: 'Carousel', icon: Images },
  { value: 'badge', label: 'Badge', icon: LayoutTemplate },
]

export default function EmbedOptions({ spaces, selectedSpace, onSpaceChange, options, onChange }) {
  return (
    <section className="embed-options">
      <div className="embed-options__section"><span className="eyebrow">Source</span><label htmlFor="embed-space">Space</label><select id="embed-space" value={selectedSpace} onChange={(event) => onSpaceChange(event.target.value)}><option value="">Select a space</option>{spaces.map((space) => <option value={space._id} key={space._id}>{space.name}</option>)}</select></div>
      <div className="embed-options__section"><span className="eyebrow">Format</span><div className="embed-type-options">{types.map(({ value, label, icon: Icon }) => <button className={options.type === value ? 'embed-type embed-type--active' : 'embed-type'} type="button" key={value} onClick={() => onChange('type', value)} aria-pressed={options.type === value}><Icon size={17} /><span>{label}</span></button>)}</div></div>
      <div className="embed-options__section"><span className="eyebrow">Appearance</span><div className="embed-theme-options"><button className={options.theme === 'light' ? 'embed-theme embed-theme--active' : 'embed-theme'} type="button" onClick={() => onChange('theme', 'light')}><Sun size={15} /> Light</button><button className={options.theme === 'dark' ? 'embed-theme embed-theme--active' : 'embed-theme'} type="button" onClick={() => onChange('theme', 'dark')}><Moon size={15} /> Dark</button></div><label className="embed-option-row" htmlFor="embed-count">Testimonials <select id="embed-count" value={options.count} onChange={(event) => onChange('count', Number(event.target.value))}><option value="3">3</option><option value="6">6</option><option value="9">9</option></select></label><label className="embed-option-row" htmlFor="embed-radius">Border radius <select id="embed-radius" value={options.radius} onChange={(event) => onChange('radius', event.target.value)}><option value="0">Square</option><option value="8">Soft</option><option value="16">Rounded</option></select></label><label className="embed-check"><input type="checkbox" checked={options.showRating} onChange={(event) => onChange('showRating', event.target.checked)} /> <span>Show rating</span></label><label className="embed-check"><input type="checkbox" checked={options.showAvatars} onChange={(event) => onChange('showAvatars', event.target.checked)} /> <span>Show avatars</span></label></div>
    </section>
  )
}
