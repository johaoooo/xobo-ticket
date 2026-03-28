import { useState } from 'react'
import { User, Mail, Camera, Lock, Save, Shield, Eye, EyeOff } from 'lucide-react'
import api from '../services/api'

export default function Profile({ user, onUpdate }) {
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
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
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const showMsg = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3500)
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => { if (form[key]) formData.append(key, form[key]) })
      if (avatar) formData.append('avatar', avatar)
      const response = await api.put('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onUpdate(response.data)
      showMsg('Profil mis à jour avec succès', 'success')
    } catch {
      showMsg('Erreur lors de la mise à jour', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.old_password || !passwordData.new_password) {
      showMsg('Veuillez remplir tous les champs', 'error')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/change-password/', passwordData)
      showMsg('Mot de passe changé avec succès', 'success')
      setPasswordData({ old_password: '', new_password: '' })
    } catch (error) {
      showMsg(error.response?.data?.old_password?.[0] || 'Erreur lors du changement', 'error')
    } finally {
      setLoading(false)
    }
  }

  const initials = (user?.first_name?.charAt(0) || '') + (user?.last_name?.charAt(0) || '') || user?.username?.charAt(0) || '?'

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Mon profil</h2>
        <p>Gérez vos informations personnelles</p>
      </div>

      {message && (
        <div className={`profile-msg ${messageType}`}>
          {messageType === 'success' ? '✓' : '✕'} {message}
        </div>
      )}

      <div className="profile-layout">

        {/* Carte avatar */}
        <div className="card profile-avatar-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-lg">
              {avatar ? (
                <img src={URL.createObjectURL(avatar)} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : user?.avatar ? (
                <img src={`${import.meta.env.VITE_API_URL}${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{initials}</span>
              )}
            </div>
            <label className="avatar-upload-btn" title="Changer la photo">
              <Camera size={14} />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setAvatar(e.target.files[0])} />
            </label>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
            <div className={`role-pill ${user?.role === 'admin' ? 'admin' : 'user'}`}>
              <Shield size={10} />
              {user?.role === 'admin' ? 'Administrateur' : 'Propriétaire'}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Infos personnelles */}
          <div className="card">
            <div className="profile-section-title">
              <User size={15} />
              Informations personnelles
            </div>

            <div className="profile-form-grid">
              <div className="form-group">
                <label>Prénom</label>
                <input
                  placeholder="Votre prénom"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  placeholder="Votre nom"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
              <div className="form-group full">
                <label>Adresse email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ paddingLeft: 36 }}
                  />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleProfileUpdate} disabled={loading} style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
              <Save size={14} />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>

          {/* Mot de passe */}
          <div className="card">
            <div className="profile-section-title">
              <Lock size={15} />
              Changer le mot de passe
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label>Ancien mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showOld ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    style={{ paddingRight: 40 }}
                  />
                  <span onClick={() => setShowOld(!showOld)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text3)' }}>
                    {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    style={{ paddingRight: 40 }}
                  />
                  <span onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text3)' }}>
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </span>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handlePasswordChange} disabled={loading} style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
              <Lock size={14} />
              {loading ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
