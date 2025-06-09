import { pgTable, serial, text, boolean } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false).notNull(),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;