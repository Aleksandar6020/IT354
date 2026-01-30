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
    <nav className="navbar">
      <div className="container navbarInner">
        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/manuls">Manuls</Link>
          {!currentUser && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {currentUser && role === 'admin' && (
            <>
              <Link to="/admin">Admin</Link>
              <button type="button" className="button buttonSecondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          {currentUser && role === 'user' && (
            <button type="button" className="button buttonSecondary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
