import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const columns = sqliteTable('columns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  position: integer('position').notNull(),
});

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  columnId: integer('column_id').notNull().references(() => columns.id),
  position: integer('position').notNull(),
});

export type Column = typeof columns.$inferSelect;
export type NewColumn = typeof columns.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;