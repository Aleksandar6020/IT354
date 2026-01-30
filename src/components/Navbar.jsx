import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function Navbar() {
  const { currentUser, role, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/manuls">Manuls</Link>
      {!currentUser && (
        <>
          {' '}| <Link to="/login">Login</Link> |{' '}
          <Link to="/register">Register</Link>
        </>
      )}
      {currentUser && role === 'admin' && (
        <>
          {' '}| <Link to="/admin">Admin</Link> |{' '}
          <button type="button" onClick={handleLogout}>Logout</button>
        </>
      )}
      {currentUser && role === 'user' && (
        <>
          {' '}| <button type="button" onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  )
}

export default Navbar
