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
    <div className="min-h-screen relative z-10" style={{ padding: 'calc(var(--char-height) * 2)' }}>
      <div style={{ width: 'calc(var(--char-width) * 80)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'calc(var(--char-height) * 2)' }}>
          <span>TODO LIST</span>
        </div>

        {/* Add task form */}
        <form onSubmit={addTodo} style={{ marginBottom: 'calc(var(--char-height) * 2)' }}>
          <div style={{ display: 'flex' }}>
            <span>[</span>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder=" "
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'inherit',
                width: 'calc(var(--char-width) * 60)',
                padding: 0,
                margin: 0,
              }}
              maxLength={60}
            />
            <span>]</span>
            <button
              type="submit"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 0,
                marginLeft: 'calc(var(--char-width) * 2)',
              }}
            >
              [ADD]
            </button>
          </div>
        </form>

        {/* Todo list */}
        <div>
          {todos.map((todo, index) => (
            <div key={todo.id} style={{ display: 'flex' }}>
              <span style={{ width: 'calc(var(--char-width) * 2)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{ width: 'calc(var(--char-width) * 2)' }}>
                {todo.completed ? 'X' : ' '}
              </span>
              <button
                onClick={() => toggleTodo(todo.id, !todo.completed)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: todo.completed ? 'rgba(0, 255, 102, 0.5)' : 'inherit',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                  width: 'calc(var(--char-width) * 60)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {todo.text.padEnd(60, ' ').substring(0, 60)}
              </button>
              <button
                onClick={() => removeTodo(todo.id)}
                aria-label="Delete task"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(0, 255, 102, 0.7)',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: 'calc(var(--char-width) * 2)',
                }}
              >
                [X]
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <div style={{ color: 'rgba(0, 255, 102, 0.5)' }}>
              -- NO TASKS YET --
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
