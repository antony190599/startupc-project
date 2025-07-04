# Prisma Database Setup

This directory contains the Prisma schema and related files for the Next.js application.

## Files

- `schema.prisma` - Main database schema with all models
- `seed.ts` - Database seeding script for initial data

## Database Models

### Core Models
- **User** - User accounts with authentication
- **Account** - OAuth account connections (NextAuth.js)
- **Session** - User sessions (NextAuth.js)
- **Profile** - Extended user profile information

### Content Models
- **Post** - Blog posts and articles
- **Comment** - Post comments
- **Category** - Post categories
- **Tag** - Post tags

### Utility Models
- **VerificationToken** - Email verification tokens

## Available Scripts

### Database Management
```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database (development)
pnpm db:push

# Create and apply migrations
pnpm db:migrate

# Deploy migrations to production
pnpm db:migrate:deploy

# Reset database (development only)
pnpm db:migrate:reset

# Check migration status
pnpm db:migrate:status
```

### Database Utilities
```bash
# Seed database with initial data
pnpm db:seed

# Open Prisma Studio (database GUI)
pnpm db:studio

# Format schema file
pnpm db:format

# Validate schema
pnpm db:validate
```

## Getting Started

1. **Set up your database URL** in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   ```

2. **Generate the Prisma client**:
   ```bash
   pnpm db:generate
   ```

3. **Push the schema to your database**:
   ```bash
   pnpm db:push
   ```

4. **Seed the database with initial data**:
   ```bash
   pnpm db:seed
   ```

## Environment Variables

Make sure to set these environment variables in your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

## Database Relationships

- **User** ↔ **Account** (One-to-Many)
- **User** ↔ **Session** (One-to-Many)
- **User** ↔ **Profile** (One-to-One)
- **User** ↔ **Post** (One-to-Many)
- **User** ↔ **Comment** (One-to-Many)
- **Post** ↔ **Comment** (One-to-Many)
- **Post** ↔ **Category** (Many-to-One)
- **Post** ↔ **Tag** (Many-to-Many)

## Best Practices

1. **Always use migrations** in production instead of `db:push`
2. **Backup your database** before running migrations
3. **Test migrations** in a staging environment first
4. **Use transactions** for operations that modify multiple records
5. **Implement proper error handling** in your database operations
6. **Use indexes** for frequently queried fields
7. **Validate data** before inserting into the database

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check your `DATABASE_URL` in `.env.local`
   - Ensure your database server is running
   - Verify network connectivity

2. **Prisma client not generated**
   - Run `pnpm db:generate` after schema changes
   - Restart your development server

3. **Migration conflicts**
   - Use `pnpm db:migrate:reset` in development
   - In production, resolve conflicts manually

4. **Seed script fails**
   - Ensure database is accessible
   - Check for unique constraint violations
   - Verify all required fields are provided

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs) 