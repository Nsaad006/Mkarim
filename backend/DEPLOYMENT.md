# MKARIM Deployment Guide

This guide provides step-by-step instructions for deploying the MKARIM e-commerce platform to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup](#database-setup)
3. [Deployment Methods](#deployment-methods)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Environment variables documented
- [ ] Database migrations up to date
- [ ] Dependencies updated and secure
- [ ] Remove development/debug code
- [ ] Update API URLs to production

### ✅ Security
- [ ] Strong database password
- [ ] Secure JWT secret (min 32 characters)
- [ ] CORS configured for production domain
- [ ] HTTPS/SSL certificate ready
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection headers configured

### ✅ Performance
- [ ] Frontend build optimized (`npm run build`)
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)
- [ ] Database indexes optimized

---

## Database Setup

### Option 1: Neon.tech (Recommended - Free Tier Available)

1. **Create Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub/Google

2. **Create Project**
   - Click "New Project"
   - Choose region closest to your users
   - Note the connection string

3. **Configure Connection**
   ```env
   DATABASE_URL="postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require"
   ```

4. **Run Migrations**
   ```bash
   cd backend
   npm run db:deploy
   ```

### Option 2: Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings > Database
3. Use the "Connection Pooling" URL for better performance

### Option 3: Self-Hosted PostgreSQL

1. Install PostgreSQL on your server
2. Create database and user:
   ```sql
   CREATE DATABASE mkarim;
   CREATE USER mkarim_user WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE mkarim TO mkarim_user;
   ```

---

## Deployment Methods

## Method 1: Docker Deployment (Recommended)

### Prerequisites
- Server with Docker and Docker Compose installed
- Domain name pointed to server IP
- SSL certificate (Let's Encrypt recommended)

### Steps

1. **Prepare Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo apt install docker-compose -y
   ```

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd maroc-cash-flow-main-v2
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Update with production values:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   VITE_API_URL=https://api.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

4. **Build and Deploy**
   ```bash
   # Build images
   docker-compose build
   
   # Start services
   docker-compose up -d
   
   # Run migrations
   docker-compose exec backend npx prisma migrate deploy
   
   # Seed database (first time only)
   docker-compose exec backend npx tsx prisma/seed.ts
   ```

5. **Setup Nginx Reverse Proxy**
   ```nginx
   # /etc/nginx/sites-available/mkarim
   
   # Frontend
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Backend API
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           
           # Increase timeout for uploads
           client_max_body_size 10M;
           proxy_connect_timeout 600;
           proxy_send_timeout 600;
           proxy_read_timeout 600;
       }
   }
   ```

6. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

---

## Method 2: Render.com Deployment

### Backend Deployment

1. **Create Account** at [render.com](https://render.com)

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: mkarim-backend
     - **Environment**: Node
     - **Region**: Choose closest to users
     - **Branch**: main
     - **Build Command**: `npm install && npx prisma generate && npm run build`
     - **Start Command**: `npx prisma migrate deploy && npm start`

3. **Add Environment Variables**
   ```
   DATABASE_URL=<your-neon-database-url>
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=<your-frontend-url>
   ```

4. **Deploy** - Render will auto-deploy

### Frontend Deployment

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect repository
   - Configure:
     - **Name**: mkarim-frontend
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

2. **Add Environment Variables**
   ```
   VITE_API_URL=<your-backend-url>
   ```

3. **Deploy**

---

## Method 3: Railway.app Deployment

1. **Create Account** at [railway.app](https://railway.app)

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Services**
   - Railway will detect both frontend and backend
   - Add PostgreSQL database from Railway

4. **Configure Environment Variables**
   - Backend: Add `DATABASE_URL`, `FRONTEND_URL`
   - Frontend: Add `VITE_API_URL`

5. **Deploy** - Automatic

---

## Method 4: VPS Manual Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Root or sudo access
- Domain name configured

### Steps

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

3. **Clone and Setup**
   ```bash
   git clone <repo-url>
   cd maroc-cash-flow-main-v2
   
   # Backend
   cd backend
   npm install
   npx prisma generate
   npm run build
   
   # Frontend
   cd ../frontend
   npm install
   npm run build
   ```

4. **Configure Environment**
   ```bash
   # Backend .env
   cd backend
   nano .env
   ```

5. **Start Backend with PM2**
   ```bash
   cd backend
   pm2 start dist/server.js --name mkarim-backend
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx for Frontend**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/frontend/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
       }
   }
   ```

7. **Enable and Restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/mkarim /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend
curl https://yourdomain.com
```

### 2. Create Admin User

```bash
# SSH into server or use Docker exec
cd backend
npx tsx -e "
import prisma from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('YourStrongPassword123!', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@yourdomain.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'super_admin',
      active: true
    }
  });
  console.log('Admin created:', admin.email);
}

createAdmin();
"
```

### 3. Configure Monitoring

**Option 1: PM2 Monitoring (for VPS)**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Option 2: External Monitoring**
- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay

### 4. Setup Backups

**Database Backup Script**
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
mkdir -p $BACKUP_DIR

pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

**Setup Cron Job**
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

### 5. Performance Optimization

**Enable Caching**
```nginx
# In Nginx config
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Database Connection Pooling**
```typescript
// In backend/src/lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pooling
  log: ['error'],
});
```

---

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Verify SSL mode
# Neon requires: ?sslmode=require
```

### Issue: CORS Errors

**Solution:**
```typescript
// backend/src/app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Issue: 502 Bad Gateway

**Solution:**
```bash
# Check if backend is running
pm2 status
# or
docker-compose ps

# Check backend logs
pm2 logs mkarim-backend
# or
docker-compose logs backend
```

### Issue: Images Not Loading

**Solution:**
```bash
# Check uploads directory permissions
chmod -R 755 backend/uploads

# Verify VITE_API_URL in frontend
echo $VITE_API_URL
```

### Issue: Build Fails

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist .vite
npm run build
```

---

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart mkarim-backend

# Frontend
cd ../frontend
npm install
npm run build
# Copy dist to web root or rebuild Docker image
```

### Monitor Logs

```bash
# PM2
pm2 logs mkarim-backend --lines 100

# Docker
docker-compose logs -f --tail=100 backend

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Database Maintenance

```bash
# Analyze and optimize
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Check database size
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size('dbname'));"
```

---

## Security Best Practices

1. **Regular Updates**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Firewall Configuration**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

3. **Fail2Ban** (Prevent brute force)
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

4. **Regular Backups**
   - Database: Daily
   - Uploads: Daily
   - Code: Git repository

---

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Contact: contact@mkarim.ma

---

**Last Updated:** January 2026
