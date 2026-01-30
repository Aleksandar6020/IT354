import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (event) => {
    event.preventDefault()


    const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    const response = await fetch(`http://localhost:3001/users?${query}`)
    const users = await response.json()

    if (users.length > 0) {
      login(users[0])
      navigate('/manuls')
    } else {
      alert('Invalid email or password')
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="formRow">
          <label className="label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="formRow">
          <label className="label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button className="button" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
