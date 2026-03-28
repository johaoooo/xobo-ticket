import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import AddStand from './pages/AddStand'
import StandList from './pages/StandList'
import Profile from './pages/Profile'
import UserList from './pages/Users'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import api from './services/api'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [stands, setStands] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      fetchStands()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchStands = async () => {
    try {
      const response = await api.get('/stands/')
      setStands(response.data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3100)
  }

  const handleAdd = async (formData) => {
    try {
      const response = await api.post('/stands/', formData)
      setStands([response.data, ...stands])
      showToast('Stand ajouté — en attente de validation.')
      setPage('liste')
    } catch (error) {
      showToast(error.response?.data?.error || 'Erreur', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/stands/${id}/`)
      setStands(stands.filter(s => s.id !== id))
      showToast('Stand supprimé.', 'error')
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleEdit = async (form) => {
    try {
      const response = await api.put(`/stands/${form.id}/`, form)
      setStands(stands.map(s => s.id === form.id ? response.data : s))
      showToast('Stand mis à jour.')
    } catch (error) {
      showToast('Erreur lors de la modification', 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser)
    showToast('Profil mis à jour.')
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  if (!user) return <AuthPage onLogin={setUser} />

  return (
    <div className="app-shell">
      <Sidebar page={page} onNav={setPage} user={user} onLogout={handleLogout} />
      <main className="main-content">
        {page === 'dashboard' && <Dashboard stands={stands} onNav={setPage} user={user} />}
        {page === 'ajouter'   && <AddStand onAdd={handleAdd} onNav={setPage} />}
        {page === 'liste'     && <StandList stands={stands} onDelete={handleDelete} onEdit={handleEdit} user={user} />}
        {page === 'profil' && <Profile user={user} onUpdate={handleProfileUpdate} />}
        {page === 'users' && <UserList user={user} />}
        {page === 'users' && <UserList user={user} />}
      </main>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
