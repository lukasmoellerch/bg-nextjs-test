'use client';

import { useState } from 'react';
import { addColumn } from '../actions';

export default function AddColumnForm() {
  const [columnTitle, setColumnTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = columnTitle.trim();
    if (!title) return;
    
    await addColumn(title);
    setColumnTitle('');
    setIsAdding(false);
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg px-4 py-2 transition-all duration-200 border border-white border-opacity-30"
      >
        + Add another list
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-20 rounded-lg p-3 border border-white border-opacity-30">
      <input
        value={columnTitle}
        onChange={(e) => setColumnTitle(e.target.value)}
        placeholder="Enter list title..."
        className="w-full px-3 py-2 bg-white rounded border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Add list
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setColumnTitle('');
          }}
          className="text-white hover:text-gray-200 px-3 py-1 text-sm transition-colors"
        >
          ✕
        </button>
      </div>
    </form>
  );
}