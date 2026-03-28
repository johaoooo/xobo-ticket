import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faCamera, 
  faKey, 
  faSave,
  faIdCard,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons'
import api from '../services/api'

export default function Profile({ user, onUpdate }) {
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleProfileUpdate = async () => {
    setLoading(true)
    setMessage('')
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key])
      })
      if (avatar) formData.append('avatar', avatar)
      
      const response = await api.put('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onUpdate(response.data)
      setMessage('Profil mis à jour avec succès')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Erreur lors de la mise à jour')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.old_password || !passwordData.new_password) {
      setMessage('Veuillez remplir tous les champs')
      setMessageType('error')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await api.post('/auth/change-password/', passwordData)
      setMessage('Mot de passe changé avec succès')
      setMessageType('success')
      setPasswordData({ old_password: '', new_password: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.old_password?.[0] || 'Erreur lors du changement')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Mon profil</h2>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div className="profile-grid">
        {/* Section Avatar */}
        <div className="card profile-photo-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-lg">
              {avatar ? (
                <img src={URL.createObjectURL(avatar)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : user?.avatar ? (
                <img src={`http://localhost:8002${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ color: '#fff' }} />
              )}
            </div>
            <label className="profile-photo-btn">
              <FontAwesomeIcon icon={faCamera} size="xs" />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
          </div>
          <h4 style={{ marginTop: 16, marginBottom: 4 }}>{user?.username}</h4>
          <div className={`role-badge ${user?.role === 'admin' ? 'admin' : 'user'}`}>
            {user?.role === 'admin' ? '👑 Administrateur' : '👤 Utilisateur'}
          </div>
        </div>

        {/* Section Formulaire */}
        <div className="card">
          {message && (
            <div className={`profile-msg ${messageType}`}>
              {message}
            </div>
          )}

          <div className="profile-section-title">
            <FontAwesomeIcon icon={faIdCard} />
            Informations personnelles
          </div>

          <div className="profile-form-grid">
            <div className="form-group">
              <label>Prénom</label>
              <input 
                value={form.first_name} 
                onChange={(e) => setForm({ ...form, first_name: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input 
                value={form.last_name} 
                onChange={(e) => setForm({ ...form, last_name: e.target.value })} 
              />
            </div>
            <div className="form-group full">
              <label>Email</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleProfileUpdate} 
            disabled={loading}
            style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faSave} />
            Enregistrer les modifications
          </button>

          <div className="divider" />

          <div className="profile-section-title">
            <FontAwesomeIcon icon={faKey} />
            Changer le mot de passe
          </div>

          <div className="form-group">
            <label>Ancien mot de passe</label>
            <input
              type="password"
              value={passwordData.old_password}
              onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handlePasswordChange} 
            disabled={loading}
            style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faKey} />
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  )
}
