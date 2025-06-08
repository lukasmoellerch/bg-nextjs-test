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
    <div className="flex flex-col items-center min-h-screen p-8 gap-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Todo List</h1>

      {/* Add task */}
      <form
        onSubmit={addTodo}
        className="flex gap-3 w-full max-w-md items-center"
      >
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent border border-foreground/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-foreground/40"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-foreground text-background hover:bg-opacity-90 transition-colors"
        >
          Add
        </button>
      </form>

      {/* Todo list */}
      <ul className="w-full max-w-md space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-foreground/5 rounded px-3 py-2"
          >
            <button
              onClick={() => toggleTodo(todo.id, !todo.completed)}
              className={`flex-1 text-left ${
                todo.completed ? 'line-through opacity-50' : ''
              }`}
            >
              {todo.text}
            </button>
            <button
              onClick={() => removeTodo(todo.id)}
              aria-label="Delete task"
              className="ml-4 text-foreground/60 hover:text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-center text-foreground/50">No tasks yet</li>
        )}
      </ul>
    </div>
  );
}
