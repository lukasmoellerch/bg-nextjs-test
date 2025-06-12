import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../TodoList'
import { toggleTodo, deleteTodo } from '@/app/actions'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { Todo } from '@/lib/schema'

vi.mock('@/app/actions')

const mockTodos: Todo[] = [
  { id: 1, text: 'Test todo 1', completed: false },
  { id: 2, text: 'Test todo 2', completed: true },
  { id: 3, text: 'Test todo 3', completed: false },
]

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all todos', () => {
    render(<TodoList initialTodos={mockTodos} />)
    
    expect(screen.getByText(/Test todo 1/)).toBeInTheDocument()
    expect(screen.getByText(/Test todo 2/)).toBeInTheDocument()
    expect(screen.getByText(/Test todo 3/)).toBeInTheDocument()
  })

  it('displays todo numbers correctly', () => {
    render(<TodoList initialTodos={mockTodos} />)
    
    expect(screen.getByText('[01]')).toBeInTheDocument()
    expect(screen.getByText('[02]')).toBeInTheDocument()
    expect(screen.getByText('[03]')).toBeInTheDocument()
  })

  it('shows completed todos with strikethrough', () => {
    render(<TodoList initialTodos={mockTodos} />)
    
    const completedTodo = screen.getByText(/Test todo 2/).closest('button')
    expect(completedTodo).toHaveStyle('text-decoration: line-through')
  })

  it('shows incomplete todos without strikethrough', () => {
    render(<TodoList initialTodos={mockTodos} />)
    
    const incompleteTodo = screen.getByText(/Test todo 1/).closest('button')
    expect(incompleteTodo).toHaveStyle('text-decoration: none')
  })

  it('toggles todo completion when clicked', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockTodos} />)
    
    const todoButton = screen.getByText(/Test todo 1/).closest('button')
    await user.click(todoButton!)
    
    expect(toggleTodo).toHaveBeenCalledWith(1, true)
  })

  it('toggles completed todo to incomplete', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockTodos} />)
    
    const todoButton = screen.getByText(/Test todo 2/).closest('button')
    await user.click(todoButton!)
    
    expect(toggleTodo).toHaveBeenCalledWith(2, false)
  })

  it('deletes todo when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockTodos} />)
    
    const deleteButtons = screen.getAllByText('[DEL]')
    await user.click(deleteButtons[0])
    
    expect(deleteTodo).toHaveBeenCalledWith(1)
  })

  it('renders empty list when no todos', () => {
    render(<TodoList initialTodos={[]} />)
    
    // Should not find any todo items
    expect(screen.queryByText(/\[0[0-9]\]/)).not.toBeInTheDocument()
  })

  it('displays correct checkbox state', () => {
    render(<TodoList initialTodos={mockTodos} />)
    
    // Check for unchecked todos
    const uncheckedTodos = screen.getAllByText(/\[ \]/, { exact: false })
    expect(uncheckedTodos).toHaveLength(2)
    
    // Check for checked todos
    const checkedTodos = screen.getAllByText(/\[X\]/, { exact: false })
    expect(checkedTodos).toHaveLength(1)
  })
})