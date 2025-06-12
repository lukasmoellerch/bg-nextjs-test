import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodoForm from '../AddTodoForm'
import { addTodo } from '@/app/actions'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/app/actions')

describe('AddTodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form with placeholder text', () => {
    render(<AddTodoForm />)
    const input = screen.getByPlaceholderText('add task...')
    expect(input).toBeInTheDocument()
  })

  it('allows typing in the input field', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    
    const input = screen.getByPlaceholderText('add task...')
    await user.type(input, 'New todo item')
    
    expect(input).toHaveValue('New todo item')
  })

  it('submits the form when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    
    const input = screen.getByPlaceholderText('add task...')
    await user.type(input, 'Test todo{Enter}')
    
    await waitFor(() => {
      expect(addTodo).toHaveBeenCalledWith('Test todo')
    })
  })

  it('clears the input after successful submission', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    
    const input = screen.getByPlaceholderText('add task...')
    await user.type(input, 'Test todo{Enter}')
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('does not submit empty todos', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    
    const input = screen.getByPlaceholderText('add task...')
    await user.type(input, '   {Enter}') // Only spaces
    
    expect(addTodo).not.toHaveBeenCalled()
  })
})