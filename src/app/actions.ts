'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { todos } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function addTodo(text: string) {
  const trimmedText = text.trim();
  if (!trimmedText) return;
  
  await db.insert(todos).values({ text: trimmedText }).run();
  revalidatePath('/');
}

export async function toggleTodo(id: number, completed: boolean) {
  await db
    .update(todos)
    .set({ completed })
    .where(eq(todos.id, id))
    .run();
  revalidatePath('/');
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id)).run();
  revalidatePath('/');
}