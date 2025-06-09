import { db } from '@/lib/db';
import { todos } from '@/lib/schema';
import TodoList from '@/app/components/TodoList';
import AddTodoForm from '@/app/components/AddTodoForm';

export default async function Home() {
  // Fetch todos on the server
  const allTodos = await db.select().from(todos).all();

  return (
    <div className="min-h-screen bg-secondary py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-muted text-lg">
            Stay organized and get things done
          </p>
        </div>

        {/* Add Todo Card */}
        <div className="card mb-6 animate-fade-in">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Add New Task</h2>
          </div>
          <AddTodoForm />
        </div>

        {/* Todo List Card */}
        <div className="card animate-fade-in">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                {allTodos.length} total
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                {allTodos.filter(t => t.completed).length} completed
              </span>
            </div>
          </div>
          <TodoList initialTodos={allTodos} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-muted">
          <p className="text-sm">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
