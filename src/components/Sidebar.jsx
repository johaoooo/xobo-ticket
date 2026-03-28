import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartLine, 
  faPlus, 
  faList, 
  faSignOutAlt,
  faStore,
  faSun,
  faMoon,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

export default function Sidebar({ page, onNav, user, onLogout }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const navItems = [
    { id: 'dashboard', icon: faChartLine, label: 'Tableau de bord' },
    { id: 'ajouter', icon: faPlus, label: 'Ajouter un stand' },
    { id: 'liste', icon: faList, label: 'Liste des stands' },
  ]

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', icon: faShieldAlt, label: 'Administration' })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FontAwesomeIcon icon={faStore} size="lg" style={{ color: '#fff' }} />
        </div>
        <div>
          <div className="sidebar-title">Xobo<span style={{ fontWeight: 400 }}>Ticket</span></div>
          <div className="sidebar-subtitle">Gestion des stands</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(n => (
          <div
            key={n.id}
            onClick={() => onNav(n.id)}
            className={`sidebar-item ${page === n.id ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={n.icon} style={{ width: 18 }} />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-theme" onClick={toggleTheme}>
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
        <div className={`theme-pill ${theme === 'dark' ? 'on' : ''}`} />
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.nom?.charAt(0) || user?.username?.charAt(0)}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <span className="sidebar-profile-name">{user?.nom || user?.username}</span>
          <span className="sidebar-profile-email">{user?.email}</span>
        </div>
      </div>

      <button className="sidebar-logout" onClick={onLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        Déconnexion
      </button>
    </aside>
  )
}
