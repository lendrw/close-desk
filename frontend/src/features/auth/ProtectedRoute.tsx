import { Navigate, Outlet } from 'react-router'

import { getCurrentUser } from './session'

export function ProtectedRoute() {
  if (!getCurrentUser()) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
