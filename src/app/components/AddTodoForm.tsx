'use client';

import { useState } from 'react';
import { addTodo } from '../actions';

export default function AddTodoForm() {
  const [task, setTask] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = task.trim();
    if (!text) return;
    
    await addTodo(text);
    setTask('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-baseline relative">
      <span className="dim">&gt; </span>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="add task..."
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
    </form>
  );
}