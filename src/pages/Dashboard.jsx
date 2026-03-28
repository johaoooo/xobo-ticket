import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faCheckCircle,
  faClock,
  faPlus,
  faKey,
  faEnvelope,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import Badge from '../components/Badge'
import api from '../services/api'

export default function Dashboard({ stands, onNav, user }) {
  const [stats, setStats] = useState({ total: 0, valides: 0, attente: 0 })
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [selectedStand, setSelectedStand] = useState(null)
  const [validationCode, setValidationCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stands/stats/')
        setStats(response.data)
      } catch (err) {
        console.error('Erreur stats:', err)
      }
    }
    fetchStats()
  }, [])

  const handleValidateStand = async (e) => {
    e.preventDefault()
    if (!validationCode) {
      setError('Veuillez entrer le code de validation')
      return
    }

    setValidating(true)
    setError('')

    try {
      await api.post(`/stands/${selectedStand.id}/activate/`, {
        password: validationCode
      })
      alert('✅ Stand activé avec succès !')
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.error || 'Code de validation incorrect')
    } finally {
      setValidating(false)
    }
  }

  const openValidationModal = (stand) => {
    setSelectedStand(stand)
    setValidationCode('')
    setError('')
    setShowValidationModal(true)
  }

  const statCards = [
    { label: 'Total Stands', value: stats.total || 0, icon: faStore, color: '#3b82f6', sub: 'enregistrés' },
    { label: 'Validés', value: stats.valides || 0, icon: faCheckCircle, color: '#10b981', sub: 'statut validé' },
    { label: 'En attente', value: stats.attente || 0, icon: faClock, color: '#f59e0b', sub: 'à valider' },
  ]

  const isOwner = user?.role === 'user'

  // Filtrage correct : par user ID, pas par email du stand
  const myStands = isOwner ? stands.filter(s => s.user === user?.id) : stands.slice(0, 5)

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Tableau de bord</h2>
        <p>Vue d'ensemble de votre plateforme XoboTicket</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label">
              <FontAwesomeIcon icon={stat.icon} style={{ marginRight: 6 }} />
              {stat.label}
            </div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Mes stands</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
              {isOwner ? 'Vos stands personnels' : 'Les 5 plus récents'}
            </div>
          </div>
          {!isOwner && (
            <button className="btn btn-primary btn-sm" onClick={() => onNav('ajouter')}>
              <FontAwesomeIcon icon={faPlus} />
              Ajouter un stand
            </button>
          )}
        </div>

        {myStands.length === 0 ? (
          <div className="empty">
            <div className="icon">📭</div>
            <p>Aucun stand enregistré.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Stand</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Propriétaire</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Statut</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myStands.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontWeight: 600 }}>{s.nom}</span>
                    </td>
                    <td style={{ padding: '12px' }}>{s.prenom_prop} {s.nom_prop}</td>
                    <td style={{ padding: '12px' }}><Badge status={s.statut} /></td>
                    <td style={{ padding: '12px' }}>
                      {isOwner && s.statut === 'en_attente' && s.has_temp_password && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openValidationModal(s)}
                          style={{ background: '#f59e0b', borderColor: '#f59e0b' }}
                        >
                          <FontAwesomeIcon icon={faKey} style={{ marginRight: 5 }} />
                          Saisir mon code
                        </button>
                      )}
                      {isOwner && s.statut === 'en_attente' && !s.has_temp_password && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                          ⏳ En attente de validation admin
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showValidationModal && selectedStand && (
        <div className="modal-overlay" onClick={() => setShowValidationModal(false)}>
          <div className="modal" style={{ width: 450, maxWidth: '95%' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 16 }}>🔐</div>
            <h3 style={{ marginBottom: 8 }}>Validation de votre stand</h3>
            <p style={{ marginBottom: 20, color: 'var(--text2)' }}>
              <strong>{selectedStand.nom}</strong><br />
              Entrez le code reçu par email pour activer votre stand.
            </p>

            <form onSubmit={handleValidateStand}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ marginBottom: 8, display: 'block' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />
                  Code de validation
                </label>
                <input
                  type="text"
                  value={validationCode}
                  onChange={(e) => setValidationCode(e.target.value)}
                  placeholder="Entrez le code reçu par email"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                  autoFocus
                  disabled={validating}
                />
                <small style={{ color: 'var(--text2)', marginTop: 5, display: 'block' }}>
                  Code envoyé à : <strong>{selectedStand.email}</strong>
                </small>
              </div>

              {error && (
                <div style={{
                  color: 'var(--red)',
                  fontSize: '0.875rem',
                  padding: '10px',
                  background: '#fee2e2',
                  borderRadius: 8,
                  marginBottom: 16
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowValidationModal(false)}
                  disabled={validating}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={validating}
                >
                  {validating ? (
                    <><span className="spinner" /> Validation...</>
                  ) : (
                    <><FontAwesomeIcon icon={faCheck} /> Valider mon stand</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
