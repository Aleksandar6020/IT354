// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import AdminPage from '../pages/AdminPage.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ProtectedRoute', () => {
  it('blocks non-admin user', async () => {
    render(
      <AuthContext.Provider value={{ currentUser: { id: 2 }, role: 'user' }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
    expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument()
  })

  it('allows admin user', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    render(
      <AuthContext.Provider value={{ currentUser: { id: 1 }, role: 'admin' }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /admin panel/i })).toBeInTheDocument()
    })
  })
})
