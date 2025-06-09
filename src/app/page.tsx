import { db } from '@/lib/db';
import { todos, columns } from '@/lib/schema';
import Board from '@/app/components/Board';

export default async function Home() {
  // Fetch both columns and todos on the server
  const allColumns = await db.select().from(columns).orderBy(columns.position).all();
  const allTodos = await db.select().from(todos).orderBy(todos.position).all();

  return <Board initialColumns={allColumns} initialTodos={allTodos} />;
}
