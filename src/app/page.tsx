'use client';

import { FormEvent, useEffect, useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Fetch todos from the API on mount
  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  const addTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = task.trim();
    if (!text) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const newTodo: Todo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed }),
      });
      const updated: Todo = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ position: 'relative', zIndex: 1 }}>
      <div className="w-full max-w-2xl">
        {/* Command prompt for adding tasks */}
        <form onSubmit={addTodo} className="flex items-baseline relative">
          <span className="dim">&gt; </span>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="add task..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'inherit',
              flex: 1,
              padding: 0,
              margin: 0,
              minWidth: 0,
            }}
            className={task ? '' : 'dim'}
          />
          {isFocused && <span className="cursor"></span>}
        </form>

        {/* Divider */}
        <div style={{ 
          margin: 'calc(var(--char-height) * 1) 0',
          borderBottom: '1px solid var(--foreground-dim)',
          opacity: 0.5
        }}></div>

        {/* Todo list */}
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
                  onClick={() => toggleTodo(todo.id, !todo.completed)}
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
                  onClick={() => removeTodo(todo.id)}
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

        {/* Status line */}
        <div style={{ 
          marginTop: 'calc(var(--char-height) * 2)',
          paddingTop: 'calc(var(--char-height) * 0.5)',
          borderTop: '1px solid var(--foreground-dim)',
          opacity: 0.5
        }}>
          <span className="dim">
            {todos.length} task{todos.length !== 1 ? 's' : ''} | 
            {' '}{todos.filter(t => t.completed).length} completed
          </span>
        </div>
      </div>
    </div>
  );
}
