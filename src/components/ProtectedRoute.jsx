import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function ProtectedRoute({ allowedRoles, children }) {
  const auth = useAppStore((state) => state.auth)

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to={`/${auth.role}/dashboard`} replace />
  }

  return children
}
