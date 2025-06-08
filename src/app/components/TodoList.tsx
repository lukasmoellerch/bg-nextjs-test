'use client';

import { useOptimistic } from 'react';
import { toggleTodo, deleteTodo } from '../actions';
import type { Todo } from '@/lib/schema';

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
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
    optimisticUpdate({ type: 'toggle', id, completed });
    await toggleTodo(id, completed);
  }

  async function handleDelete(id: number) {
    optimisticUpdate({ type: 'delete', id });
    await deleteTodo(id);
  }

  return (
    <div>
      {todos.length === 0 ? (
        <div className="dim" style={{ textAlign: 'center', padding: 'calc(var(--char-height) * 2) 0' }}>
          -- NO TASKS YET --
        </div>
      ) : (
        todos.map((todo, index) => (
          <div key={todo.id} className="flex items-baseline" style={{ marginBottom: '2px' }}>
            <span className="dim" style={{ minWidth: '3ch', marginRight: '1ch' }}>
              [{String(index + 1).padStart(2, '0')}]
            </span>
            <button
              onClick={() => handleToggle(todo.id!, !todo.completed)}
              className={todo.completed ? 'dim' : ''}
              style={{
                textAlign: 'left',
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {todo.completed ? '[X] ' : '[ ] '}
              {todo.text}
            </button>
            <button
              onClick={() => handleDelete(todo.id!)}
              aria-label="Delete task"
              className="dim"
              style={{ marginLeft: '1ch' }}
            >
              [DEL]
            </button>
          </div>
        ))
      )}
    </div>
  );
}