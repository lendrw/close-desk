import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'

import { getCurrentUser, restoreSession } from './session'

type AuthenticationStatus = 'checking' | 'authenticated' | 'unauthenticated'

export function ProtectedRoute() {
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>(() =>
    getCurrentUser() ? 'authenticated' : 'checking',
  )

  useEffect(() => {
    let isActive = true

    async function checkSession() {
      if (getCurrentUser()) {
        setAuthStatus('authenticated')
        return
      }

      const isSessionRestored = await restoreSession()

      if (isActive) {
        setAuthStatus(isSessionRestored ? 'authenticated' : 'unauthenticated')
      }
    }

    void checkSession()

    return () => {
      isActive = false
    }
  }, [])

  if (authStatus === 'checking') {
    return (
      <main className="app-shell">
        <section className="app-card">
          <p className="app-eyebrow">Sessão</p>
          <p className="app-description" role="status">
            Restaurando sessão...
          </p>
        </section>
      </main>
    )
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
