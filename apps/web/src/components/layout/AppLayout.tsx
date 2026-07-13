import {
  Bell,
  ChefHat,
  ChevronDown,
  CookingPot,
  House,
  ScanLine,
  Search,
} from 'lucide-react'

import {
  NavLink,
  Outlet,
  useLocation,
} from 'react-router'


const navigationItems = [
  {
    label: 'Inicio',
    path: '/',
    icon: House,
  },
  {
    label: 'Escanear',
    path: '/escanear',
    icon: ScanLine,
  },
  {
    label: 'Recetas',
    path: '/recetas',
    icon: CookingPot,
  },
]

const pageTitles: Record<string, string> = {
  '/': 'Inicio',
  '/escanear': 'Escanear ingredientes',
  '/recetas': 'Recetas recomendadas',
}


export function AppLayout() {
  const location = useLocation()

  const currentTitle =
    pageTitles[location.pathname] ?? 'Meal Matcher'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__logo">
            <ChefHat size={24} />
          </div>

          <div>
            <strong className="brand__title">Meal</strong>
            <span className="brand__subtitle">Matcher</span>
          </div>
        </div>

        <nav className="sidebar__navigation">
          {navigationItems.map(({ label, path, icon: Icon }) => (
  <NavLink
    key={path}
    to={path}
    end={path === '/'}
    className={({ isActive }) =>
      `sidebar__item ${
        isActive ? 'sidebar__item--active' : ''
      }`
    }
  >
    <Icon size={21} strokeWidth={2} />
    <span>{label}</span>
  </NavLink>
))}

        </nav>

        <div className="model-card">
          <div className="model-card__header">
            <div className="model-card__icon">AI</div>

            <div>
              <strong>Modelo activo</strong>
              <span>Precisión 94.8 %</span>
            </div>
          </div>

          <div className="model-card__progress">
            <span />
          </div>

          <small>Última actualización</small>
          <strong>Hoy, sesión local</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <h1>{currentTitle}</h1>

          <div className="topbar__actions">
            <label className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Buscar recetas..."
                aria-label="Buscar recetas"
              />
            </label>

            <button
              className="icon-button"
              type="button"
              aria-label="Notificaciones"
            >
              <Bell size={19} />
            </button>

            <button className="profile-button" type="button">
              <span className="profile-button__avatar">JT</span>

              <span className="profile-button__information">
                <strong>Usuario local</strong>
                <small>Meal Matcher</small>
              </span>

              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>
      </section>
    </div>
  )
}