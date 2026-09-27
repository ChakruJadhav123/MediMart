import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Medicines from './Medicines'
import * as api from '../api'
import toast from 'react-hot-toast'

// Mock api
vi.mock('../api', () => ({
  medicineAPI: {
    getAll: vi.fn(),
    getCategories: vi.fn()
  }
}))

describe('Medicines Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toast.dismiss()
  })

  it('renders pagination and loads page 1 on click', async () => {
    // Mock page 0 (first page)
    api.medicineAPI.getAll.mockResolvedValueOnce({
      data: {
        data: {
          content: [{ id: 1, name: 'Paracetamol' }],
          totalPages: 2,
          totalElements: 20,
          number: 0
        }
      }
    })
    api.medicineAPI.getCategories.mockResolvedValue({ data: { data: ['Analgesics'] } })

    render(
      <MemoryRouter initialEntries={['/medicines?page=0']}>
        <Medicines />
      </MemoryRouter>
    )

    // Wait for load
    await waitFor(() => expect(screen.getByText('Paracetamol')).toBeInTheDocument())

    // Check pagination shows 2 pages
    expect(screen.getAllByRole('button')).toHaveLength(4) // prev,1,2,next

    // Mock page 1
    api.medicineAPI.getAll.mockResolvedValueOnce({
      data: {
        data: {
          content: [{ id: 13, name: 'Ibuprofen' }],
          totalPages: 2,
          totalElements: 20,
          number: 1
        }
      }
    })

    // Click page 2 (index 1)
    const pageButtons = screen.getAllByRole('button')
    fireEvent.click(pageButtons[2]) // button '2'

    await waitFor(() => expect(screen.getByText('Ibuprofen')).toBeInTheDocument())
    expect(api.medicineAPI.getAll).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }))
  })

  it('shows error toast on API fail', async () => {
    api.medicineAPI.getAll.mockRejectedValueOnce({ response: { data: { message: 'Server error' } } })
    api.medicineAPI.getCategories.mockResolvedValue({ data: { data: [] } })

    render(
      <MemoryRouter initialEntries={['/medicines']}>
        <Medicines />
      </MemoryRouter>
    )

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Server error'))
  })
})
