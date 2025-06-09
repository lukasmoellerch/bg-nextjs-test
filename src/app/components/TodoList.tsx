'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleTodo, deleteTodo } from '../actions';
import type { Todo } from '@/lib/schema';

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [isPending, startTransition] = useTransition();
  const [todos, optimisticUpdate] = useOptimistic(
    initialTodos,
    (state: Todo[], update: { type: 'toggle' | 'delete'; id: number; completed?: boolean }) => {
      if (update.type === 'toggle') {
        return state.map(todo =>
          todo.id === update.id
            ? { ...todo, completed: update.completed! }
            : todo
        );
      } else {
        return state.filter(todo => todo.id !== update.id);
      }
    }
  );

  async function handleToggle(id: number, completed: boolean) {
    startTransition(async () => {
      optimisticUpdate({ type: 'toggle', id, completed });
      await toggleTodo(id, completed);
    });
  }

  async function handleDelete(id: number) {
    startTransition(async () => {
      optimisticUpdate({ type: 'delete', id });
      await deleteTodo(id);
    });
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted">Add your first task above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className={`group flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
            todo.completed 
              ? 'bg-secondary border-border-light' 
              : 'bg-background border-border hover:border-primary/30'
          } animate-slide-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Custom Checkbox */}
          <button
            onClick={() => handleToggle(todo.id!, !todo.completed)}
            disabled={isPending}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
              todo.completed
                ? 'bg-success border-success text-white'
                : 'border-border hover:border-primary group-hover:border-primary'
            }`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Task Text */}
          <div className="flex-1 min-w-0">
            <span
              className={`block truncate transition-all duration-200 ${
                todo.completed
                  ? 'text-muted line-through'
                  : 'text-foreground group-hover:text-primary'
              }`}
            >
              {todo.text}
            </span>
          </div>

          {/* Task Number */}
          <div className="flex-shrink-0">
            <span className="text-xs text-muted bg-secondary px-2 py-1 rounded-full">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(todo.id!)}
            disabled={isPending}
            className="btn-ghost btn-danger opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}