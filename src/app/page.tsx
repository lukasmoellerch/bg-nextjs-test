import { db } from '@/lib/db';
import { todos } from '@/lib/schema';
import TodoList from '@/app/components/TodoList';
import AddTodoForm from '@/app/components/AddTodoForm';

export default async function Home() {
  // Fetch todos on the server
  const allTodos = await db.select().from(todos).all();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ position: 'relative', zIndex: 1 }}>
      <div className="w-full max-w-2xl">
        {/* Command prompt for adding tasks */}
        <AddTodoForm />

        {/* Divider */}
        <div style={{ 
          margin: 'calc(var(--char-height) * 1) 0',
          borderBottom: '1px solid var(--foreground-dim)',
          opacity: 0.5
        }}></div>

        {/* Todo list */}
        <TodoList initialTodos={allTodos} />

        {/* Status line */}
        <div style={{ 
          marginTop: 'calc(var(--char-height) * 2)',
          paddingTop: 'calc(var(--char-height) * 0.5)',
          borderTop: '1px solid var(--foreground-dim)',
          opacity: 0.5
        }}>
          <span className="dim">
            {allTodos.length} task{allTodos.length !== 1 ? 's' : ''} | 
            {' '}{allTodos.filter(t => t.completed).length} completed
          </span>
        </div>
      </div>
    </div>
  );
}
