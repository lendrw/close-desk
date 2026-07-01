import { Link, Route, Routes, useNavigate } from 'react-router'

import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { RegisterPage } from './features/auth/RegisterPage'
import { logout } from './features/auth/session'
import './App.css'

function HomePage() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">CloseDesk</p>
        <h1 className="app-title">CloseDesk</h1>
        <p className="app-description">
          Gestão individual de chamados de clientes.
        </p>
        <div className="app-actions">
          <Link className="app-link" to="/login">
            Entrar
          </Link>
          <Link className="app-link app-link-secondary" to="/register">
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  )
}

function DashboardPage() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Indicadores</p>
        <h1 className="app-title">Dashboard</h1>
        <p className="app-description">Os indicadores serão exibidos aqui.</p>
        <div className="app-actions">
          <Link className="app-link app-link-secondary" to="/">
            Voltar para o início
          </Link>
          <button
            className="app-link auth-submit"
            onClick={handleLogout}
            type="button"
          >
            Sair
          </button>
        </div>
      </section>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Erro 404</p>
        <h1 className="app-title">Página não encontrada</h1>
        <Link className="app-link" to="/">
          Voltar para o início
        </Link>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
