import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import api from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    setLoading(true)
    setError('')
    setMessage('')
    
    try {
      const response = await api.post('/auth/reset-password/', {
        token,
        new_password: password,
        confirm_password: confirmPassword
      })
      
      setMessage(response.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
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
          <div className="subtitle">Nouveau mot de passe</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: 8 }} />
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: 8 }} />
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
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
            disabled={loading || !token}
          >
            {loading ? (
              <><span className="spinner" /> Réinitialisation...</>
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
