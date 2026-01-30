// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import LoginPage from '../pages/LoginPage.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('LoginPage', () => {
  it('renders form and validates email', async () => {
    global.fetch = vi.fn()
    window.alert = vi.fn()

    render(
      <AuthContext.Provider value={{ login: vi.fn() }}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>
    )

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(global.fetch).not.toHaveBeenCalled()
  })
})
