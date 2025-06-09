'use client';

import Card from './Card';
import AddTodoForm from './AddTodoForm';
import { deleteColumn } from '../actions';
import type { Column as ColumnType, Todo } from '@/lib/schema';

interface ColumnProps {
  column: ColumnType;
  todos: Todo[];
}

export default function Column({ column, todos }: ColumnProps) {
  const handleDeleteColumn = () => {
    if (confirm(`Are you sure you want to delete the "${column.title}" column? This will delete all cards in it.`)) {
      deleteColumn(column.id!);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-w-80 max-w-80 flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-lg">{column.title}</h2>
        <button
          onClick={handleDeleteColumn}
          className="text-gray-500 hover:text-red-500 text-sm px-2 py-1 rounded hover:bg-gray-200"
          title="Delete column"
        >
          ✕
        </button>
      </div>

      {/* Add Todo Form */}
      <div className="mb-4">
        <AddTodoForm columnId={column.id!} />
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            todo={todo}
          />
        ))}
      </div>

      {/* Column Footer */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        {todos.length} card{todos.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}