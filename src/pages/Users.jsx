import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faStore, 
  faCheckCircle, 
  faClock, 
  faEnvelope, 
  faCalendar,
  faShieldAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import api from '../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users/')
      setUsers(response.data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="spinner" style={{ margin: '50px auto' }}></div>
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h2><FontAwesomeIcon icon={faUsers} /> Gestion des utilisateurs</h2>
        <p>Liste de tous les utilisateurs de la plateforme</p>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><FontAwesomeIcon icon={faUser} /> Utilisateur</th>
                <th><FontAwesomeIcon icon={faEnvelope} /> Email</th>
                <th><FontAwesomeIcon icon={faShieldAlt} /> Rôle</th>
                <th><FontAwesomeIcon icon={faCalendar} /> Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.username}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-valid' : 'badge-pending'}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
