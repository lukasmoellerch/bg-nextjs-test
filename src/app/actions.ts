'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { issues } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function createIssue(title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium') {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;
  
  await db.insert(issues).values({ 
    title: trimmedTitle, 
    description: description || '',
    priority,
    created_at: new Date(),
    updated_at: new Date()
  }).run();
  revalidatePath('/');
}

export async function updateIssueStatus(id: number, status: 'open' | 'in_progress' | 'closed') {
  await db
    .update(issues)
    .set({ 
      status,
      updated_at: new Date()
    })
    .where(eq(issues.id, id))
    .run();
  revalidatePath('/');
}

export async function updateIssue(id: number, title: string, description: string, priority: 'low' | 'medium' | 'high') {
  await db
    .update(issues)
    .set({ 
      title: title.trim(),
      description,
      priority,
      updated_at: new Date()
    })
    .where(eq(issues.id, id))
    .run();
  revalidatePath('/');
}

export async function deleteIssue(id: number) {
  await db.delete(issues).where(eq(issues.id, id)).run();
  revalidatePath('/');
}