# PostgreSQL Setup Instructions

This application has been converted to use PostgreSQL as the storage backend instead of SQLite.

## Prerequisites

1. PostgreSQL database server running locally or accessible remotely
2. Node.js and npm installed

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database Connection

Copy the `.env.local` file and update the `DATABASE_URL` with your PostgreSQL connection string:

```bash
# Example connection strings:
# For local PostgreSQL:
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"

# For Docker PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/todoapp"

# For remote PostgreSQL (e.g., Vercel Postgres, Supabase):
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"
```

### 3. Set up PostgreSQL Database

#### Option A: Using Docker (Recommended for Development)

```bash
# Start PostgreSQL with Docker
docker run --name postgres-todo \
  -e POSTGRES_DB=todoapp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Update your .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/todoapp"
```

#### Option B: Using Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database called `todoapp`
3. Update the connection string in `.env.local`

### 4. Run Database Migrations

```bash
# Generate migration files (already done)
npm run db:generate

# Run migrations to create tables
npm run db:migrate
```

### 5. Start the Application

```bash
npm run dev
```

## Database Management

### Useful Commands

```bash
# Generate new migration after schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Schema Changes

The database schema is defined in `src/lib/schema.ts`. After making changes:

1. Run `npm run db:generate` to create migration files
2. Run `npm run db:migrate` to apply changes to the database

## Changes Made

1. **Dependencies**: Replaced `better-sqlite3` with `postgres` driver
2. **Schema**: Updated from SQLite types to PostgreSQL types in `src/lib/schema.ts`
3. **Database Connection**: Updated `src/lib/db.ts` to use PostgreSQL connection
4. **Configuration**: Added `drizzle.config.ts` for migration management
5. **Environment**: Added `.env.local` for database configuration

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running
- Verify connection string format
- Check firewall settings for remote connections

### Migration Issues

- Ensure database exists before running migrations
- Check user permissions for database operations
- Verify environment variables are loaded correctly