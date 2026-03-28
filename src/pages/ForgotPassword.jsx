import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import api from '../services/api'

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Veuillez entrer votre email')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await api.post('/auth/forgot-password/', { email })
      setMessage(response.data.message)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="logo">XoboTicket</div>
          <div className="subtitle">Réinitialisation du mot de passe</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{
              color: 'var(--red)',
              fontSize: '0.875rem',
              padding: '12px',
              background: '#fee2e2',
              borderRadius: 12,
              border: '1px solid #fecaca',
              marginBottom: 16
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              color: 'var(--green)',
              fontSize: '0.875rem',
              padding: '12px',
              background: '#d1fae5',
              borderRadius: 12,
              border: '1px solid #a7f3d0',
              marginBottom: 16
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 14 }}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Envoi en cours...</>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
              Retour à la connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
