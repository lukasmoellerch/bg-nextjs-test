import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { eq } from 'drizzle-orm'

// Use test database directly
import { db } from '@/lib/db.test.config'
import { todos } from '@/lib/schema'

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// Import real actions (not mocked)
const { addTodo, toggleTodo, deleteTodo } = await vi.importActual<typeof import('../actions')>('../actions')

describe('Server Actions', () => {
  beforeEach(async () => {
    // Clear all todos before each test
    await db.delete(todos).run()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('addTodo', () => {
    it('adds a new todo to the database', async () => {
      await addTodo('Test todo')
      
      const allTodos = await db.select().from(todos).all()
      expect(allTodos).toHaveLength(1)
      expect(allTodos[0].text).toBe('Test todo')
      expect(allTodos[0].completed).toBe(false)
    })

    it('trims whitespace from todo text', async () => {
      await addTodo('  Test todo with spaces  ')
      
      const allTodos = await db.select().from(todos).all()
      expect(allTodos[0].text).toBe('Test todo with spaces')
    })

    it('does not add empty todos', async () => {
      await addTodo('')
      await addTodo('   ')
      
      const allTodos = await db.select().from(todos).all()
      expect(allTodos).toHaveLength(0)
    })
  })

  describe('toggleTodo', () => {
    it('toggles todo completion status', async () => {
      // Add a todo first
      const [todo] = await db.insert(todos).values({ text: 'Test todo' }).returning()
      
      // Toggle to completed
      await toggleTodo(todo.id, true)
      let [updatedTodo] = await db.select().from(todos).where(eq(todos.id, todo.id)).all()
      expect(updatedTodo.completed).toBe(true)
      
      // Toggle back to incomplete
      await toggleTodo(todo.id, false)
      ;[updatedTodo] = await db.select().from(todos).where(eq(todos.id, todo.id)).all()
      expect(updatedTodo.completed).toBe(false)
    })
  })

  describe('deleteTodo', () => {
    it('deletes a todo from the database', async () => {
      // Add a todo first
      const [todo] = await db.insert(todos).values({ text: 'Test todo' }).returning()
      
      // Verify it exists
      let allTodos = await db.select().from(todos).all()
      expect(allTodos).toHaveLength(1)
      
      // Delete it
      await deleteTodo(todo.id)
      
      // Verify it's gone
      allTodos = await db.select().from(todos).all()
      expect(allTodos).toHaveLength(0)
    })
  })
})