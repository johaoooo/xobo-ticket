export default function Badge({ status }) {
  return status === 'valide'
    ? <span className="badge badge-valid"><span className="badge-dot" />Validé</span>
    : <span className="badge badge-pending"><span className="badge-dot" />En attente</span>
}
