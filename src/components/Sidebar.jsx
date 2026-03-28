import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { ChevronLeft, ChevronRight, LayoutDashboard, Plus, List, ShieldAlert, Users, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Sidebar({ page, onNav, user, onLogout, collapsed, onToggle }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
  const isDark = theme === 'dark'

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'ajouter',   icon: Plus,            label: 'Ajouter un stand' },
    { id: 'liste',     icon: List,            label: 'Liste des stands' },
  ]
  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', icon: ShieldAlert, label: 'Administration' })
    navItems.push({ id: 'users', icon: Users,       label: 'Utilisateurs' })
  }

  const initials = (user?.first_name?.charAt(0) || '') + (user?.last_name?.charAt(0) || '') || user?.username?.charAt(0) || '?'

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>

      {/* Logo + bouton toggle */}
      <div className="sidebar-logo">
        {!collapsed && (
          <>
            <div className="sidebar-logo-icon">
              <FontAwesomeIcon icon={faStore} style={{ color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="sidebar-title">Xobo<span style={{ fontWeight: 400 }}>Ticket</span></div>
              <div className="sidebar-subtitle">Gestion des stands</div>
            </div>
          </>
        )}
        <button className="sidebar-toggle-btn" onClick={onToggle} title={collapsed ? 'Déplier' : 'Replier'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(n => (
          <div
            key={n.id}
            onClick={() => onNav(n.id)}
            className={`sidebar-item ${page === n.id ? 'active' : ''}`}
            title={collapsed ? n.label : ''}
          >
            <n.icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{n.label}</span>}
          </div>
        ))}
      </nav>

      {/* Toggle thème */}
      <div className="theme-toggle-wrapper" onClick={toggleTheme} title={isDark ? 'Mode clair' : 'Mode sombre'}>
        <div className="theme-toggle-track">
          <div className={`theme-toggle-thumb ${isDark ? 'dark' : ''}`}>
            {isDark ? <Moon size={8} /> : <Sun size={8} />}
          </div>
        </div>
        {!collapsed && <span className="theme-toggle-label">{isDark ? 'Mode sombre' : 'Mode clair'}</span>}
      </div>

      {/* Profil */}
      <div
        className={`sidebar-profile ${page === 'profil' ? 'active' : ''}`}
        onClick={() => onNav('profil')}
        title={collapsed ? 'Mon profil' : ''}
      >
        <div className="sidebar-avatar">{initials}</div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <span className="sidebar-profile-name">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
            </span>
            <span className="sidebar-profile-email">{user?.email}</span>
            <span className="sidebar-profile-role">
              {user?.role === 'admin' ? '⚡ Administrateur' : '👤 Propriétaire'}
            </span>
          </div>
        )}
      </div>

      {/* Déconnexion */}
      <button className="sidebar-logout" onClick={onLogout} title={collapsed ? 'Déconnexion' : ''}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        {!collapsed && 'Déconnexion'}
      </button>
    </aside>
  )
}
