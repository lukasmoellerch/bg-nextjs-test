'use client';

import { useState } from 'react';
import { addTodo } from '../actions';

export default function AddTodoForm() {
  const [task, setTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = task.trim();
    if (!text || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addTodo(text);
      setTask('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full"
          disabled={isSubmitting}
          autoFocus
        />
      </div>
      <button
        type="submit"
        disabled={!task.trim() || isSubmitting}
        className="btn-primary px-6 whitespace-nowrap"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Adding...
          </div>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </>
        )}
      </button>
    </form>
  );
}