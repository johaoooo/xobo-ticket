import { useState, useEffect } from 'react'
import { Users, Store, CheckCircle, Clock, Mail, Calendar } from 'lucide-react'
import api from '../services/api'

export default function UserList({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/users/list/')
      .then(r => setUsers(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.username}`
      .toLowerCase().includes(search.toLowerCase())
  )

  if (user?.role !== 'admin') return null

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2>Comptes enregistreurs</h2>
        <p>{users.length} propriétaire(s) enregistré(s)</p>
      </div>

      {/* Stats globales */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label"><Users size={14} style={{ marginRight: 6 }} />Propriétaires</div>
          <div className="stat-value" style={{ color: '#6366f1' }}>{users.length}</div>
          <div className="stat-sub">comptes actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Store size={14} style={{ marginRight: 6 }} />Total stands</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {users.reduce((a, u) => a + u.nb_stands, 0)}
          </div>
          <div className="stat-sub">tous statuts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><CheckCircle size={14} style={{ marginRight: 6 }} />Stands validés</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {users.reduce((a, u) => a + u.nb_valides, 0)}
          </div>
          <div className="stat-sub">activés</div>
        </div>
      </div>

      <div className="card">
        {/* Recherche */}
        <div style={{ marginBottom: 20 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un propriétaire..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--surface2)',
              color: 'var(--text)',
              fontSize: '0.875rem',
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">👤</div>
            <p>Aucun propriétaire trouvé.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(u => {
              const initials = `${u.first_name?.charAt(0) || ''}${u.last_name?.charAt(0) || ''}`.toUpperCase() || u.username?.charAt(0).toUpperCase()
              const dateJoined = new Date(u.date_joined).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

              return (
                <div key={u.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface2)',
                  transition: 'all 0.15s',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 46, height: 46,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 700, color: '#fff',
                    flexShrink: 0, overflow: 'hidden',
                  }}>
                    {u.avatar
                      ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      : initials
                    }
                  </div>

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {u.first_name} {u.last_name}
                      <span style={{ fontWeight: 400, color: 'var(--text3)', fontSize: '0.78rem', marginLeft: 8 }}>@{u.username}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Mail size={11} />{u.email}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} />Inscrit le {dateJoined}
                      </span>
                    </div>
                  </div>

                  {/* Stats stands */}
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <div style={{ textAlign: 'center', padding: '6px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.1)' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1' }}>{u.nb_stands}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>total</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{u.nb_valides}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>validés</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.1)' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{u.nb_attente}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>en attente</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
