import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { todos } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic'; // ensure this route is not cached/prerendered

export async function GET() {
  const allTodos = db.select().from(todos).all();
  return NextResponse.json(allTodos);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  const inserted = db
    .insert(todos)
    .values({ text: text.trim() })
    .returning()
    .get();
  return NextResponse.json(inserted, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json();
  if (typeof id !== 'number' || typeof completed !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const updated = db
    .update(todos)
    .set({ completed })
    .where(eq(todos.id, id))
    .returning()
    .get();
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  db.delete(todos).where(eq(todos.id, id)).run();
  return new NextResponse(null, { status: 204 });
}