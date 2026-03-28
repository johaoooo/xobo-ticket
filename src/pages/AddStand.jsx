import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faStore, 
  faEnvelope, 
  faLock, 
  faUser, 
  faAddressCard,
  faLocationDot,
  faTimes,
  faSave
} from '@fortawesome/free-solid-svg-icons'

export default function AddStand({ onAdd, onNav }) {
  const [form, setForm] = useState({
    nom: '', email: '', password: '', nom_prop: '', prenom_prop: '', adresse: '',
  })
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.password || !form.nom_prop || !form.prenom_prop) {
      alert('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      onAdd(form)
      setLoading(false)
      onNav('liste')
    }, 700)
  }

  const fields = [
    { label: 'Nom du stand', name: 'nom', icon: faStore, placeholder: 'Ex: Stand Alimentation Bio', full: true, required: true },
    { label: 'Email', name: 'email', icon: faEnvelope, type: 'email', placeholder: 'contact@stand.com', required: true },
    { label: 'Mot de passe', name: 'password', icon: faLock, type: 'password', placeholder: 'Mot de passe du stand', required: true },
    { label: 'Nom du propriétaire', name: 'nom_prop', icon: faUser, placeholder: 'Nom', required: true },
    { label: 'Prénom du propriétaire', name: 'prenom_prop', icon: faAddressCard, placeholder: 'Prénom', required: true },
    { label: 'Adresse', name: 'adresse', icon: faLocationDot, placeholder: 'Adresse physique du stand', full: true },
  ]

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Ajouter un Stand</h2>
        <p>Remplissez le formulaire pour enregistrer un nouveau stand.</p>
      </div>

      <div className="card">
        <div className="form-grid">
          {fields.map(field => (
            <div key={field.name} className={`form-group ${field.full ? 'full' : ''}`}>
              <label>
                <FontAwesomeIcon icon={field.icon} style={{ marginRight: 8 }} />
                {field.label} {field.required && '*'}
              </label>
              <input
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={set(field.name)}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
            ⏳ Le statut sera automatiquement mis à{' '}
            <strong style={{ color: 'var(--orange)' }}>En attente</strong> après soumission.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => onNav('liste')}>
              <FontAwesomeIcon icon={faTimes} />
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Enregistrement...</>
              ) : (
                <><FontAwesomeIcon icon={faSave} /> Soumettre le stand</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
