import { useState } from 'react'

const ADMIN_PASSWORD = 'admin123'

/* ── MODAL VALIDATION ── */
export function ValidationModal({ stand, onClose, onValidate }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleValidate = () => {
    if (!pw) { setError('Veuillez entrer le mot de passe.'); return }
    setLoading(true)
    setTimeout(() => {
      if (pw === ADMIN_PASSWORD) {
        onValidate(stand.id)
        onClose()
      } else {
        setError('Mot de passe incorrect.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-in">
        <div className="lock-icon">🔐</div>
        <h3>Valider le stand</h3>
        <p>Pour valider <strong style={{ color: 'var(--text)' }}>{stand.nom}</strong>, entrez le mot de passe administrateur.</p>
        <div className="form-group">
          <label>Mot de passe admin</label>
          <input
            type="password" placeholder="••••••••" value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleValidate()}
            autoFocus
          />
          {error && <span style={{ color: 'var(--red)', fontSize: '.8rem' }}>{error}</span>}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-success" onClick={handleValidate} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── MODAL SUPPRESSION ── */
export function DeleteModal({ stand, onClose, onDelete }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-in">
        <div className="lock-icon">🗑️</div>
        <h3>Supprimer le stand</h3>
        <p>
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong style={{ color: 'var(--text)' }}>{stand.nom}</strong> ?
          Cette action est irréversible.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-danger" onClick={() => { onDelete(stand.id); onClose() }}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}

/* ── MODAL ÉDITION ── */
export function EditModal({ stand, onClose, onSave }) {
  const [form, setForm] = useState({ ...stand })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-in" style={{ width: 520 }}>
        <h3>✏️ Modifier le stand</h3>
        <p>Modifiez les informations du stand <strong style={{ color: 'var(--text)' }}>{stand.nom}</strong>.</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom du stand</label>
            <input value={form.nom} onChange={set('nom')} placeholder="Nom du stand" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={form.email} onChange={set('email')} placeholder="email@stand.com" />
          </div>
          <div className="form-group">
            <label>Nom du propriétaire</label>
            <input value={form.nom_prop} onChange={set('nom_prop')} placeholder="Nom" />
          </div>
          <div className="form-group">
            <label>Prénom du propriétaire</label>
            <input value={form.prenom_prop} onChange={set('prenom_prop')} placeholder="Prénom" />
          </div>
          <div className="form-group full">
            <label>Adresse</label>
            <input value={form.adresse} onChange={set('adresse')} placeholder="Adresse du stand" />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={() => { onSave(form); onClose() }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
