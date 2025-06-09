'use client';

import { useState } from 'react';
import { addTodo } from '../actions';

interface AddTodoFormProps {
  columnId: number;
}

export default function AddTodoForm({ columnId }: AddTodoFormProps) {
  const [task, setTask] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = task.trim();
    if (!text) return;
    
    await addTodo(text, columnId);
    setTask('');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="+ Add a card"
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </form>
  );
}