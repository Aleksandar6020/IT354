// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ManulsPage from '../pages/ManulsPage.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ManulsPage', () => {
  it('shows loading and then renders cards', async () => {
    const mockManuls = [
      {
        id: 1,
        name: 'Batu',
        shortDescription: 'Famous manul',
        photoUrl: 'https://example.com/batu.jpg',
      },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockManuls,
    })

    render(
      <MemoryRouter>
        <ManulsPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Batu')).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: /open/i })).toBeInTheDocument()
  })
})
