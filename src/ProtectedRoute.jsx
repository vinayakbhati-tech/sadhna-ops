import { Navigate } from 'react-router-dom'
import { getRole } from './utils'

function ProtectedRoute({ children, adminOnly }) {
  const role = getRole()

  if (!role) {
    return <Navigate to="/" replace />
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute