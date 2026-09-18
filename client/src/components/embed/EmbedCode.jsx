import { Check, Code2, Copy } from 'lucide-react'
import { useState } from 'react'

export default function EmbedCode({ code, apiUrl }) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return <section className="embed-code"><div className="embed-code__heading"><div><span className="eyebrow">Ready to share</span><h2>Embed code</h2></div><Code2 size={20} /></div><p>Paste this snippet where you want your approved TrustWall testimonials to appear. It fetches public data from <code>{apiUrl}</code>.</p><div className="embed-code__block"><pre><code>{code}</code></pre><button className="button button--coral embed-code__copy" type="button" onClick={copyCode}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy Embed Code'}</button></div><div className="embed-code__note"><strong>Security note.</strong> This is public embed code: it only exposes approved testimonials and public space branding. Anyone who has the snippet can request that public data, so never put private keys, owner data, or authenticated endpoints in it.</div></section>
}
