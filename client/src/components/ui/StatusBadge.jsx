const labels = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
}

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status}`}>{labels[status] || status}</span>
}
