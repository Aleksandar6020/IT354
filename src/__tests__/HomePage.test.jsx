// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage.jsx'

import { describe, it, expect } from 'vitest'

describe('HomePage', () => {
  it('renders title and description', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /manuls/i })).toBeInTheDocument()
    expect(
      screen.getByText(/pallas's cats are small wild cats/i)
    ).toBeInTheDocument()
  })
})
