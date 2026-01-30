// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ManulDetailsPage from '../pages/ManulDetailsPage.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ManulDetailsPage', () => {
  it('shows loading, renders manul, and like button works', async () => {
    const manul = {
      id: 1,
      name: 'Batu',
      photoUrl: 'https://example.com/batu.jpg',
      longStory: 'Story',
      likesCount: 1,
    }

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => manul,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...manul, likesCount: 2 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

    render(
      <AuthContext.Provider value={{ currentUser: { id: 1, role: 'user' } }}>
        <MemoryRouter initialEntries={['/manuls/1']}>
          <Routes>
            <Route path="/manuls/:id" element={<ManulDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Batu' })).toBeInTheDocument()
    })

    const likeButton = screen.getByRole('button', { name: /like/i })
    fireEvent.click(likeButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /unlike/i })).toBeInTheDocument()
    })
  })
})
