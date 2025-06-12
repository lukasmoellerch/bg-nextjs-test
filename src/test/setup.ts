import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock the database to use test database
vi.mock('@/lib/db', () => {
  return vi.importActual('@/lib/db.test.config')
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock server actions
vi.mock('@/app/actions', () => ({
  addTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
}))