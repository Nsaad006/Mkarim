# 🚀 MKARIM Quick Reference

## Essential Commands

### Development
```bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

### Production Build
```bash
# Backend
cd backend
npm install
npx prisma generate
npm run build

# Frontend
cd frontend
npm install
npm run build
```

### Docker Deployment
```bash
# Quick deploy
./deploy.sh

# Manual commands
docker-compose build
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

### Database
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Seed database
npx tsx prisma/seed.ts
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com
```

## Default URLs

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | http://localhost:8080 | https://yourdomain.com |
| Backend | http://localhost:3001 | https://api.yourdomain.com |
| Admin | http://localhost:8080/admin | https://yourdomain.com/admin |

## API Endpoints

### Public
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `GET /api/categories` - List categories
- `GET /api/cities` - Delivery cities
- `POST /api/orders` - Create order
- `POST /api/contact` - Contact form

### Admin (Requires Auth)
- `POST /api/auth/login` - Login
- `GET /api/admin/stats` - Dashboard stats
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Docker Commands

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Execute command in container
docker-compose exec backend <command>
docker-compose exec frontend <command>
```

## Troubleshooting

### Database Connection Failed
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3001  # Backend
lsof -i :8080  # Frontend

# Kill process
kill -9 <PID>
```

### Docker Issues
```bash
# Remove all containers
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Clean Docker system
docker system prune -a
```

### Prisma Issues
```bash
# Reset Prisma Client
rm -rf node_modules/.prisma
npx prisma generate

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

## File Structure

```
maroc-cash-flow-main-v2/
├── backend/
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── lib/         # Utilities
│   │   └── server.ts    # Entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── uploads/         # Product images
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── api/         # API clients
│   │   └── lib/         # Utilities
│   └── .env
│
└── Documentation/
    ├── README.md
    ├── DEPLOYMENT.md
    └── DEPLOYMENT_CHECKLIST.md
```

## Admin Access

### Default Login (After Seeding)
- Email: `admin@mkarim.ma`
- Password: `admin123`

⚠️ **Change immediately in production!**

### Create New Admin
```bash
# Using deploy script
./deploy.sh
# Select option 8

# Or manually
docker-compose exec backend npx tsx -e "
import prisma from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('YourPassword', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin Name',
      role: 'super_admin',
      active: true
    }
  });
}
createAdmin();
"
```

## Monitoring

### Check Application Health
```bash
# Backend
curl http://localhost:3001/health

# Frontend (Docker)
curl http://localhost/health
```

### View Logs
```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2
pm2 logs mkarim-backend
```

### Database Stats
```bash
# Connect to database
psql $DATABASE_URL

# Check size
SELECT pg_size_pretty(pg_database_size('dbname'));

# List tables
\dt
```

## Backup & Restore

### Backup Database
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Backup uploads
tar -czf uploads_backup.tar.gz backend/uploads/
```

### Restore Database
```bash
# Restore from backup
psql $DATABASE_URL < backup_20260122.sql
```

## Performance

### Frontend Build Size
```bash
cd frontend
npm run build
du -sh dist/
```

### Database Query Performance
```bash
# Enable query logging in Prisma
# Add to schema.prisma datasource:
log = ["query", "info", "warn", "error"]
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong passwords
- [ ] CORS configured
- [ ] Environment variables secured
- [ ] Regular backups
- [ ] Dependencies updated
- [ ] Error logging enabled

## Support

- **Documentation**: See `DEPLOYMENT.md`
- **Issues**: Check `DEPLOYMENT_CHECKLIST.md`
- **Email**: contact@mkarim.ma

---

**Keep this file handy for quick reference!**
