import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faTrash,
  faCheck,
  faKey
} from '@fortawesome/free-solid-svg-icons'
import Badge from '../components/Badge'
import { DeleteModal, EditModal } from '../components/Modal'
import api from '../services/api'

export default function StandList({ stands, onDelete, onEdit, user }) {
  const [deleteModal, setDeleteModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [loading, setLoading] = useState({})
  const [validationModal, setValidationModal] = useState(null)
  const [standPassword, setStandPassword] = useState('')
  const [comment, setComment] = useState('')

  const openValidationModal = (stand) => {
    setStandPassword('')
    setComment('')
    setValidationModal(stand)
  }

  const validateStand = async (stand, password, commentText) => {
    if (!password) {
      alert('Veuillez définir un mot de passe pour ce stand')
      return
    }

    setLoading(prev => ({ ...prev, [stand.id]: true }))

    try {
      await api.post(`/stands/${stand.id}/validate/`, {
        validation_password: password,
        comment: commentText
      })
      alert(`✅ Stand validé !\n\nMot de passe envoyé par email : ${password}`)
      window.location.reload()
    } catch (error) {
      alert(`❌ Erreur: ${error.response?.data?.error || 'Impossible de valider le stand'}`)
    } finally {
      setLoading(prev => ({ ...prev, [stand.id]: false }))
      setValidationModal(null)
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Liste des Stands</h2>
        <p>{stands.length} stand(s) enregistré(s)</p>
      </div>

      {stands.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="icon">🏪</div>
            <p>Aucun stand enregistré pour l'instant.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Stand</th>
                  <th>Propriétaire</th>
                  <th>Adresse / Email</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stands.map((s, i) => (
                  <tr key={s.id} className="animate-slide" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td><span className="stand-num">#{String(i + 1).padStart(3, '0')}</span></td>
                    <td><div className="stand-name">{s.nom}</div></td>
                    <td>{s.prenom_prop} {s.nom_prop}</td>
                    <td>
                      <div style={{ fontSize: '0.75rem' }}>{s.adresse || <span style={{ color: 'var(--text2)' }}>—</span>}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>{s.email}</div>
                    </td>
                    <td><Badge status={s.statut} /></td>
                    <td>
                      <div className="actions">
                        {isAdmin && s.statut === 'en_attente' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => openValidationModal(s)}
                            disabled={loading[s.id]}
                            title="Valider ce stand"
                          >
                            <FontAwesomeIcon icon={faKey} />
                            {loading[s.id] ? '...' : 'Valider'}
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditModal(s)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal(s)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {validationModal && (
        <div className="modal-overlay" onClick={() => setValidationModal(null)}>
          <div className="modal animate-in" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="lock-icon">🔐</div>
            <h3>Valider le stand</h3>
            <p>
              <strong>{validationModal.nom}</strong><br />
              Propriétaire : {validationModal.prenom_prop} {validationModal.nom_prop}<br />
              Email : {validationModal.email}
            </p>

            <div className="form-group">
              <label>🔑 Définir un mot de passe pour ce stand *</label>
              <input
                type="text"
                value={standPassword}
                onChange={(e) => setStandPassword(e.target.value)}
                placeholder="Ex: stand123"
                autoFocus
              />
              <small style={{ color: 'var(--text2)' }}>Ce mot de passe sera envoyé au propriétaire par email.</small>
            </div>

            <div className="form-group">
              <label>📝 Commentaire (optionnel)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                placeholder="Ajoutez un commentaire..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setValidationModal(null)}>
                Annuler
              </button>
              <button
                className="btn btn-success"
                onClick={() => validateStand(validationModal, standPassword, comment)}
                disabled={loading[validationModal?.id]}
              >
                <FontAwesomeIcon icon={faCheck} />
                Valider et envoyer l'email
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && <EditModal stand={editModal} onClose={() => setEditModal(null)} onSave={onEdit} />}
      {deleteModal && <DeleteModal stand={deleteModal} onClose={() => setDeleteModal(null)} onDelete={onDelete} />}
    </div>
  )
}
