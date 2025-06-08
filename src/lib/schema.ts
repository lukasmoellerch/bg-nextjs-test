import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { InferModel } from 'drizzle-orm';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
});

export type Todo = InferModel<typeof todos>;
export type NewTodo = InferModel<typeof todos, 'insert'>;