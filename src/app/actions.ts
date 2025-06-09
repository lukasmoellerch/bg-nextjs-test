'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { todos, columns } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function addTodo(text: string, columnId: number) {
  const trimmedText = text.trim();
  if (!trimmedText) return;
  
  // Get the current max position for this column
  const maxPositionResult = await db
    .select({ maxPosition: todos.position })
    .from(todos)
    .where(eq(todos.columnId, columnId))
    .orderBy(todos.position)
    .all();
  
  const maxPosition = maxPositionResult.length > 0 
    ? Math.max(...maxPositionResult.map(r => r.maxPosition)) 
    : -1;
  
  await db.insert(todos).values({ 
    text: trimmedText, 
    columnId,
    position: maxPosition + 1
  }).run();
  
  revalidatePath('/');
}

export async function moveTodo(todoId: number, newColumnId: number, newPosition: number) {
  // Get all todos in the target column at or after the new position
  const todosToShift = await db
    .select()
    .from(todos)
    .where(and(
      eq(todos.columnId, newColumnId),
      // Use >= for position comparison since we'll insert at newPosition
    ))
    .all();

  // Shift todos down to make room
  for (const todo of todosToShift.filter(t => t.position >= newPosition)) {
    await db
      .update(todos)
      .set({ position: todo.position + 1 })
      .where(eq(todos.id, todo.id))
      .run();
  }

  // Move the todo to its new position
  await db
    .update(todos)
    .set({ 
      columnId: newColumnId,
      position: newPosition
    })
    .where(eq(todos.id, todoId))
    .run();

  revalidatePath('/');
}

export async function deleteTodo(id: number) {
  // Get the todo to be deleted
  const todoToDelete = await db
    .select()
    .from(todos)
    .where(eq(todos.id, id))
    .get();

  if (!todoToDelete) return;

  // Delete the todo
  await db.delete(todos).where(eq(todos.id, id)).run();

  // Shift remaining todos up
  const remainingTodos = await db
    .select()
    .from(todos)
    .where(and(
      eq(todos.columnId, todoToDelete.columnId),
    ))
    .all();

  for (const todo of remainingTodos.filter(t => t.position > todoToDelete.position)) {
    await db
      .update(todos)
      .set({ position: todo.position - 1 })
      .where(eq(todos.id, todo.id))
      .run();
  }

  revalidatePath('/');
}

export async function addColumn(title: string) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  // Get the current max position
  const maxPositionResult = await db
    .select({ maxPosition: columns.position })
    .from(columns)
    .orderBy(columns.position)
    .all();

  const maxPosition = maxPositionResult.length > 0 
    ? Math.max(...maxPositionResult.map(r => r.maxPosition)) 
    : -1;

  await db.insert(columns).values({ 
    title: trimmedTitle,
    position: maxPosition + 1
  }).run();

  revalidatePath('/');
}

export async function deleteColumn(columnId: number) {
  // Delete all todos in this column first
  await db.delete(todos).where(eq(todos.columnId, columnId)).run();
  
  // Delete the column
  await db.delete(columns).where(eq(columns.id, columnId)).run();
  
  revalidatePath('/');
}