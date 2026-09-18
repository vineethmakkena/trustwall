import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, loading }) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
        <button className="icon-button confirm-dialog__close" type="button" onClick={onCancel} aria-label="Close confirmation dialog"><X size={18} /></button>
        <div className="confirm-dialog__icon"><AlertTriangle size={22} /></div>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog__actions"><button className="button button--quiet" type="button" onClick={onCancel} disabled={loading}>Cancel</button><button className="button button--danger" type="button" onClick={onConfirm} disabled={loading}>{loading ? 'Working...' : confirmLabel}</button></div>
      </section>
    </div>
  )
}
