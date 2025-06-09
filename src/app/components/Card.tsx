'use client';

import { deleteTodo } from '../actions';
import type { Todo } from '@/lib/schema';

interface CardProps {
  todo: Todo;
}

export default function Card({ todo }: CardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteTodo(todo.id!);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-gray-800 flex-1 mr-2">{todo.text}</p>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 text-sm px-1 py-1 rounded hover:bg-gray-100 flex-shrink-0"
          title="Delete card"
        >
          ✕
        </button>
      </div>
    </div>
  );
}