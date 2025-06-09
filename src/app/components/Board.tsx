'use client';

import { useState } from 'react';
import Column from './Column';
import AddColumnForm from './AddColumnForm';
import type { Column as ColumnType, Todo } from '@/lib/schema';

interface BoardProps {
  initialColumns: ColumnType[];
  initialTodos: Todo[];
}

export default function Board({ initialColumns, initialTodos }: BoardProps) {
  const [columns] = useState(initialColumns);
  const [todos] = useState(initialTodos);

  // Group todos by column
  const todosByColumn = todos.reduce((acc, todo) => {
    if (!acc[todo.columnId]) {
      acc[todo.columnId] = [];
    }
    acc[todo.columnId].push(todo);
    return acc;
  }, {} as Record<number, Todo[]>);

  // Sort todos by position within each column
  Object.keys(todosByColumn).forEach(columnId => {
    todosByColumn[parseInt(columnId)].sort((a, b) => a.position - b.position);
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Trello Board</h1>
        <AddColumnForm />
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns
          .sort((a, b) => a.position - b.position)
          .map(column => (
            <Column
              key={column.id}
              column={column}
              todos={todosByColumn[column.id!] || []}
            />
          ))}
      </div>
    </div>
  );
}