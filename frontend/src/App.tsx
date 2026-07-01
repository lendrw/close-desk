import { Link, Route, Routes } from 'react-router'

import { AuthenticatedLayout } from './app/AuthenticatedLayout'
import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
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
    <section className="content-card">
      <p className="app-eyebrow">Indicadores</p>
      <h1 className="content-title">Dashboard</h1>
      <p className="app-description">Os indicadores serão exibidos aqui.</p>
    </section>
  )
}

function TicketListPage() {
  return (
    <section className="content-card">
      <p className="app-eyebrow">Chamados</p>
      <h1 className="content-title">Lista de chamados</h1>
      <p className="app-description">Os chamados serão exibidos aqui.</p>
    </section>
  )
}

function NewTicketPage() {
  return (
    <section className="content-card">
      <p className="app-eyebrow">Novo chamado</p>
      <h1 className="content-title">Criar chamado</h1>
      <p className="app-description">
        O formulário de chamado será exibido aqui.
      </p>
    </section>
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
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<NewTicketPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
