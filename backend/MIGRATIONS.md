# Database Migration Guide

## Creating a New Migration

Whenever you make changes to the Prisma schema, you need to create a migration:

1. **Make changes to `prisma/schema.prisma`**
   - Add/modify models, fields, relations, etc.

2. **Run migration command:**
   ```bash
   cd backend
   npx prisma migrate dev --name descriptive_migration_name
   ```
   
   Example migration names:
   - `add_email_to_orders`
   - `create_reviews_table`
   - `add_index_to_products`

3. **Review the generated SQL**
   - Check `prisma/migrations/[timestamp]_[name]/migration.sql`
   - Ensure the SQL does what you expect

4. **Test the migration locally**
   - Verify your application works with the new schema
   - Check that data is preserved correctly

5. **Commit both files:**
   ```bash
   git add prisma/schema.prisma
   git add prisma/migrations/
   git commit -m "Add migration: descriptive_migration_name"
   ```

## Applying Migrations in Production

When deploying to production:

```bash
cd backend
npx prisma migrate deploy
```

This command:
- Applies all pending migrations
- Does NOT create new migrations
- Is safe for production use

## Rolling Back Migrations

⚠️ **Important**: Prisma doesn't have built-in rollback functionality.

### Options for rollback:

1. **Create a reverse migration** (Recommended)
   ```bash
   # Manually create a new migration that undoes the changes
   npx prisma migrate dev --name revert_previous_change
   ```

2. **Restore from database backup**
   - Always backup before applying migrations in production
   - Restore the backup if something goes wrong

3. **Manual SQL**
   - Write SQL to manually undo the changes
   - Apply using database client

## Best Practices

### ✅ DO:
- **Always test migrations locally first**
- **Use descriptive migration names**
- **Keep migrations small and focused** (one logical change per migration)
- **Back up production database before applying migrations**
- **Review generated SQL before committing**
- **Never edit migration files after they're created**
- **Run migrations in a transaction when possible**

### ❌ DON'T:
- **Don't edit existing migration files**
- **Don't delete migration files**
- **Don't skip migrations in the sequence**
- **Don't apply migrations directly to production without testing**
- **Don't make breaking changes without a migration strategy**

## Common Migration Scenarios

### Adding a Required Field

When adding a required field to an existing table with data:

1. Add the field as optional first:
   ```prisma
   email String?
   ```

2. Create migration and apply:
   ```bash
   npx prisma migrate dev --name add_optional_email
   ```

3. Populate the field with data (via script or manually)

4. Make the field required:
   ```prisma
   email String
   ```

5. Create another migration:
   ```bash
   npx prisma migrate dev --name make_email_required
   ```

### Renaming a Field

Prisma treats renames as drop + create, which loses data. Instead:

1. Add new field
2. Migrate data from old to new field
3. Remove old field

Or use raw SQL in migration:
```sql
ALTER TABLE "Order" RENAME COLUMN "old_name" TO "new_name";
```

## Troubleshooting

### Migration fails in production

1. Check the error message
2. Verify database state
3. Check if migration was partially applied
4. Consider manual intervention or rollback

### "Migration is already applied"

This means the migration was already run. If you need to re-run:
```bash
# Reset database (⚠️ DESTRUCTIVE - only for development)
npx prisma migrate reset
```

### Drift detected

If your database schema doesn't match migrations:
```bash
# Check for drift
npx prisma migrate diff

# Resolve drift (development only)
npx prisma db push
```

## Migration Checklist

Before applying migrations to production:

- [ ] Tested migration in development environment
- [ ] Tested migration in staging environment
- [ ] Backed up production database
- [ ] Reviewed generated SQL
- [ ] Verified application works with new schema
- [ ] Planned rollback strategy
- [ ] Scheduled maintenance window (if needed)
- [ ] Notified team of deployment

## Example Workflow

```bash
# 1. Make schema changes
# Edit prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_user_preferences

# 3. Test locally
npm run dev

# 4. Commit changes
git add prisma/
git commit -m "Add user preferences table"

# 5. Deploy to staging
git push staging
# SSH into staging server
npx prisma migrate deploy

# 6. Test on staging
# Verify everything works

# 7. Deploy to production
git push production
# SSH into production server
npx prisma migrate deploy
```

## Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Database Migration Best Practices](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate)
