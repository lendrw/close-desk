import { Link, Route, Routes } from 'react-router'

import { AuthenticatedLayout } from './app/AuthenticatedLayout'
import { LoginPage } from './features/auth/LoginPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'
import { RegisterPage } from './features/auth/RegisterPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TicketListPage } from './features/tickets/TicketListPage'
import './App.css'
import { NewTicketPage } from './features/tickets/NewTicketPage'
import { TicketDetailPage } from './features/tickets/TicketDetailPage'
import { EditTicketPage } from './features/tickets/EditTicketPage'

function HomePage() {
  return (
    <main className="app-shell home-shell">
      <section className="app-card home-card">
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
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
          <Route path="/tickets/new" element={<NewTicketPage />} />
          <Route path="/tickets/:ticketId/edit" element={<EditTicketPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
