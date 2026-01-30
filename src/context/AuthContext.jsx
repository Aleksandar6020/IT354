import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      setCurrentUser(user)
      setRole(user.role || null)
    }
  }, [])

  const login = (user) => {
    setCurrentUser(user)
    setRole(user.role || null)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setCurrentUser(null)
    setRole(null)
    localStorage.removeItem('user')
  }

  const value = { currentUser, role, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
