'use client';

import Image from "next/image";
import { FormEvent, useEffect, useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');

  // Load todos from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch {
        // ignore malformed json
      }
    }
  }, []);

  // Persist todos whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: task.trim(), completed: false },
    ]);
    setTask('');
  };

  const toggleTodo = (id: number) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const removeTodo = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={22}
        />
        Todo List
      </h1>

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
              onClick={() => toggleTodo(todo.id)}
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
