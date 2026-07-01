import { Link, Route, Routes } from "react-router";

import "./App.css";

function HomePage() {
  return (
    <main id="center">
      <section>
        <h1>CloseDesk</h1>
        <p>Gestão individual de chamados de clientes.</p>
        <Link to="/dashboard">Ver dashboard</Link>
      </section>
    </main>
  );
}

function DashboardPage() {
  return (
    <main id="center">
      <section>
        <h1>Dashboard</h1>
        <p>Os indicadores serão exibidos aqui.</p>
        <Link to="/">Voltar para o início</Link>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main id="center">
      <section>
        <h1>Página não encontrada</h1>
        <Link to="/">Voltar para o início</Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
