import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function ProtectedRoute({ requiredRole, children }) {
  const { currentUser, role } = useContext(AuthContext)

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
