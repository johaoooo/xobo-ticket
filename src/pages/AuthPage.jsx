import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import api from '../services/api'
import ForgotPassword from './ForgotPassword'

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '' 
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => { 
    setForm(f => ({ ...f, [k]: e.target.value }))
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const response = await api.post('/auth/login/', {
          username: form.username,
          password: form.password
        })
        
        const { access, refresh, user } = response.data
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        localStorage.setItem('user', JSON.stringify(user))
        onLogin(user)
      } else {
        const response = await api.post('/auth/register/', {
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name
        })
        
        const { access, refresh, user } = response.data
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        localStorage.setItem('user', JSON.stringify(user))
        onLogin(user)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <FontAwesomeIcon icon={faStore} size="3x" style={{ color: '#3b82f6' }} />
          <div className="logo">XoboTicket</div>
          <div className="subtitle">Plateforme de gestion des stands</div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
                  Prénom
                </label>
                <input value={form.first_name} onChange={set('first_name')} placeholder="Votre prénom" />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
                  Nom
                </label>
                <input value={form.last_name} onChange={set('last_name')} placeholder="Votre nom" />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />
                  Email
                </label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="vous@exemple.com" />
              </div>
            </>
          )}

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
              Nom d'utilisateur
            </label>
            <input value={form.username} onChange={set('username')} placeholder="Nom d'utilisateur" />
          </div>

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: 8 }} />
              Mot de passe
            </label>
            <input 
              type="password" 
              value={form.password} 
              onChange={set('password')} 
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
            }}>{error}</div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 14 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Chargement...</>
            ) : (
              mode === 'login' ? 'Se connecter' : "S'inscrire"
            )}
          </button>

          {mode === 'login' && (
            <>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textDecoration: 'underline'
                  }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text2)',
                textAlign: 'center',
                padding: '10px',
                background: 'var(--surface2)',
                borderRadius: 12,
              }}>
                🔑 Compte démo : <strong>admin</strong> / <strong>admin123</strong>
              </div>
            </>
          )}
        </div>

        <div className="auth-switch">
          {mode === 'login'
            ? <>Pas encore de compte ? <a onClick={() => { setMode('register'); setError('') }}>S'inscrire</a></>
            : <>Déjà un compte ? <a onClick={() => { setMode('login'); setError('') }}>Se connecter</a></>
          }
        </div>
      </div>
    </div>
  )
}
