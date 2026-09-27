import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Checkout from './Checkout'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../api', () => ({
  orderAPI: { place: vi.fn() }
}))
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: { items: [{ id: 1, medicineName: 'Test Med', quantity: 1, subtotal: 100 }], totalAmount: 100 },
    clearCart: vi.fn()
  })
}))
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { fullName: 'Test', address: '123 Street' }
  })
}))

describe('Checkout Component', () => {
  it('renders the checkout page elements properly', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )
    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText(/Test Med/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/123 Street/i)).toBeInTheDocument()
  })
})
