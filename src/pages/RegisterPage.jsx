import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.includes('@') || email.startsWith('@') || email.endsWith('@')) {
      alert('Email must contain @ in the middle')
      return
    }

    const atIndex = email.indexOf('@')
    if (!email.slice(atIndex).includes('.')) {
      alert('Email must contain a dot after @')
      return
    }
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      navigate('/login')
    } else {
      alert('Registration failed')
    }
  }

  return (
    <div className="container">
      <h1>Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="formRow">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formRow">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="button" type="submit">Register</button>
      </form>
    </div>
  )
}

export default RegisterPage
