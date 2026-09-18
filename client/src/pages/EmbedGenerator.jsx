import { AlertCircle, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EmbedCode from '../components/embed/EmbedCode'
import EmbedOptions from '../components/embed/EmbedOptions'
import EmbedPreview from '../components/embed/EmbedPreview'
import api from '../lib/api'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
const initialOptions = { type: 'grid', theme: 'light', count: 3, showRating: true, showAvatars: true, radius: '8' }

const safeSlug = (value) => encodeURIComponent(String(value).replace(/[^a-z0-9-]/gi, ''))

function makeEmbedCode(slug, options) {
  const config = JSON.stringify({ type: options.type, theme: options.theme, count: options.count, showRating: options.showRating, showAvatars: options.showAvatars, radius: Number(options.radius) })
  const publicUrl = `${apiBaseUrl}/public/spaces/${safeSlug(slug)}/wall`
  return `<div data-trustwall-embed></div>\n<script>\n(function(){\n  const root=document.querySelector('[data-trustwall-embed]');\n  const config=${config};\n  const apiUrl=${JSON.stringify(publicUrl)};\n  if(!root)return;\n  fetch(apiUrl).then(function(response){return response.json();}).then(function(payload){\n    const testimonials=(payload.data.testimonials||[]).slice(0,config.count);\n    const escape=function(value){return String(value).replace(/[&<>\\\"']/g,function(character){return {'&':'&amp;','<':'&lt;','>':'&gt;','\\\"':'&quot;',"'":'&#39;'}[character];});};\n    root.innerHTML='<div style="font-family:system-ui;display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">'+testimonials.map(function(item){return '<article style="border:1px solid #e4e7e1;border-radius:'+config.radius+'px;padding:18px;background:'+(config.theme==='dark'?'#182520':'#fff')+';color:'+(config.theme==='dark'?'#fff':'#182520')+'">'+(config.showRating?'<div aria-label="'+escape(item.rating)+' out of 5 stars">'+'★'.repeat(item.rating)+'</div>':'')+'<p>“'+escape(item.review)+'”</p><strong>'+escape(item.customerName)+'</strong>'+(item.company?'<small style="display:block;opacity:.7">'+escape(item.company)+'</small>':'')+'</article>';}).join('')+'</div>';\n  }).catch(function(){root.textContent='TrustWall testimonials are unavailable.';});\n})();\n</script>`
}

export default function EmbedGenerator() {
  const [spaces, setSpaces] = useState([])
  const [selectedSpace, setSelectedSpace] = useState('')
  const [wall, setWall] = useState(null)
  const [options, setOptions] = useState(initialOptions)
  const [loading, setLoading] = useState(true)
  const [wallLoading, setWallLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/spaces').then((response) => { const values = response.data.data || []; setSpaces(values); setSelectedSpace(values[0]?._id || '') }).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load your spaces.')).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const space = spaces.find((item) => item._id === selectedSpace)
    if (!space) { queueMicrotask(() => setWall(null)); return undefined }
    let active = true
    queueMicrotask(() => setWallLoading(true))
    api.get(`/public/spaces/${encodeURIComponent(space.slug)}/wall`).then((response) => { if (active) setWall(response.data.data) }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || 'Unable to load public testimonials.') }).finally(() => { if (active) setWallLoading(false) })
    return () => { active = false }
  }, [selectedSpace, spaces])

  const selectedSpaceData = spaces.find((space) => space._id === selectedSpace)
  const code = useMemo(() => selectedSpaceData ? makeEmbedCode(selectedSpaceData.slug, options) : '', [selectedSpaceData, options])

  if (loading) return <div className="page-status"><LoaderCircle className="spin" size={22} /><span>Loading embed generator...</span></div>
  if (error && !spaces.length) return <div className="page-status page-status--error"><AlertCircle size={22} /><p>{error}</p></div>

  return <div className="page-stack embed-generator"><div className="page-heading"><div><span className="eyebrow">Share your proof</span><h1>Embed generator</h1><p>Bring approved customer stories into your website without exposing private workspace data.</p></div><span className="embed-generator__mark"><ShieldCheck size={18} /> Public-safe by design</span></div>{error && <div className="inline-notice inline-notice--error" role="alert"><AlertCircle size={17} />{error}</div>}<div className="embed-builder"><EmbedOptions spaces={spaces} selectedSpace={selectedSpace} onSpaceChange={setSelectedSpace} options={options} onChange={(key, value) => setOptions((current) => ({ ...current, [key]: value }))} /><section className="embed-preview"><div className="embed-preview__heading"><div><span className="eyebrow">Live preview</span><h2>How it will look</h2></div>{wallLoading && <LoaderCircle className="spin" size={17} />}</div><EmbedPreview wall={wall} options={options} /></section></div>{selectedSpaceData && <EmbedCode code={code} apiUrl={apiBaseUrl} />}<div className="embed-instructions"><strong>How to use it</strong><span>Choose a space and style, copy the snippet, then paste it into an HTML block or your site template. The widget reads only the public Wall of Love endpoint, so changes to approved testimonials appear automatically.</span></div></div>
}
