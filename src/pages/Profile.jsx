import { useState, useRef } from 'react'
import { Camera, Save, Lock, User, Mail, Phone } from 'lucide-react'
import api from '../services/api'

export default function Profile({ user, onUpdate }) {
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name:  user.last_name  || '',
    email:      user.email      || '',
    telephone:  user.telephone  || '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' })
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null)
  const [avatarFile, setAvatarFile]       = useState(null)
  const [saving, setSaving]   = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [msg, setMsg] = useState(null)
  const fileRef = useRef()

  const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() || user.username?.charAt(0).toUpperCase()

  const showMsg = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const data = new FormData()
      data.append('first_name', form.first_name)
      data.append('last_name',  form.last_name)
      data.append('email',      form.email)
      data.append('telephone',  form.telephone)
      if (avatarFile) data.append('avatar', avatarFile)

      const res = await api.patch('/users/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      localStorage.setItem('user', JSON.stringify(res.data))
      onUpdate(res.data)
      showMsg('success', 'Profil mis à jour avec succès.')
    } catch (err) {
      showMsg('error', err.response?.data?.error || 'Erreur lors de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePassword = async () => {
    if (passwords.newPw !== passwords.confirm) {
      showMsg('error', 'Les mots de passe ne correspondent pas.')
      return
    }
    setSavingPw(true)
    try {
      await api.post('/users/change-password/', {
        current_password: passwords.current,
        new_password:     passwords.newPw,
      })
      setPasswords({ current: '', newPw: '', confirm: '' })
      showMsg('success', 'Mot de passe modifié avec succès.')
    } catch (err) {
      showMsg('error', err.response?.data?.error || 'Mot de passe actuel incorrect.')
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Mon profil</h2>
        <p>Gérez vos informations personnelles</p>
      </div>

      {msg && <div className={`profile-msg ${msg.type}`}>{msg.text}</div>}

      <div className="profile-grid">
        {/* Photo card */}
        <div className="card profile-photo-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-lg">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{initials}</span>
              }
            </div>
            <button className="profile-photo-btn" onClick={() => fileRef.current.click()}>
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
          </div>
          <h3 style={{ marginTop: 16, fontWeight: 600 }}>{user.first_name} {user.last_name}</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{user.email}</p>
          <span className={`role-badge ${user.role}`}>
            {user.role === 'admin' ? '👑 Administrateur' : '🏪 Propriétaire'}
          </span>
        </div>

        {/* Formulaires */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <h4 className="profile-section-title">
              <User size={16} /> Informations personnelles
            </h4>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>Prénom</label>
                <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label><Mail size={12} style={{ marginRight: 4 }} />Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label><Phone size={12} style={{ marginRight: 4 }} />Téléphone</label>
                <input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+229 XX XX XX XX" />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ marginTop: 16 }}>
              <Save size={14} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

          <div className="card">
            <h4 className="profile-section-title">
              <Lock size={16} /> Changer le mot de passe
            </h4>
            <div className="form-group">
              <label>Mot de passe actuel</label>
              <input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
            </div>
            <div className="profile-form-grid" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input type="password" value={passwords.newPw} onChange={e => setPasswords({ ...passwords, newPw: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirmer</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSavePassword} disabled={savingPw} style={{ marginTop: 16 }}>
              <Lock size={14} />
              {savingPw ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
