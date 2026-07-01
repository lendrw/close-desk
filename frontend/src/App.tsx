import { Link, Route, Routes } from 'react-router'

import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
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
  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="app-eyebrow">Indicadores</p>
        <h1 className="app-title">Dashboard</h1>
        <p className="app-description">Os indicadores serão exibidos aqui.</p>
        <Link className="app-link" to="/">
          Voltar para o início
        </Link>
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
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
