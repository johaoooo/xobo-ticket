import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  PlusCircle,
  List,
  LogOut,
  Sun,
  Moon,
  Store,
  UserCircle,
  ChevronRight,
  Users
} from 'lucide-react'

const getNavItems = (role) => [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { id: 'ajouter',   icon: PlusCircle,      label: 'Ajouter un stand', hideFor: 'admin' },
  { id: 'liste',     icon: List,            label: 'Liste des stands' },
  { id: 'users',     icon: Users,           label: 'Propriétaires',    showFor: 'admin' },
]

export default function Sidebar({ page, onNav, user, onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase()

  const navItems = getNavItems(user?.role).filter(n =>
    (!n.hideFor || n.hideFor !== user?.role) &&
    (!n.showFor || n.showFor === user?.role)
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Store size={22} color="#fff" />
        </div>
        <div>
          <h1 className="sidebar-title">Xobo<span style={{ fontWeight: 400 }}>Ticket</span></h1>
          <p className="sidebar-subtitle">Gestion des stands</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Menu</p>
        {navItems.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            onClick={() => onNav(id)}
            className={`sidebar-item ${page === id ? 'active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {page === id && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
          </div>
        ))}
      </nav>

      <div className="sidebar-theme" onClick={toggleTheme}>
        {theme === 'light'
          ? <><Moon size={16} /> Mode sombre</>
          : <><Sun  size={16} /> Mode clair</>
        }
        <div className={`theme-pill ${theme === 'dark' ? 'on' : ''}`} />
      </div>

      <div className="sidebar-profile" onClick={() => onNav('profil')}>
        <div className="sidebar-avatar">
          {user.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : <span>{initials}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong className="sidebar-profile-name">{user.first_name} {user.last_name}</strong>
          <span className="sidebar-profile-email">{user.email}</span>
        </div>
        <UserCircle size={16} style={{ color: 'var(--text3)', flexShrink: 0 }} />
      </div>

      <button className="sidebar-logout" onClick={onLogout}>
        <LogOut size={16} />
        Déconnexion
      </button>
    </aside>
  )
}
