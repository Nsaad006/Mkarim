# 🚂 Railway Deployment - Quick Checklist

Use this checklist while deploying to Railway.

## ✅ Pre-Deployment (Do First!)

- [ ] Code is committed to Git
- [ ] Code is pushed to GitHub
- [ ] You have a Railway account
- [ ] You have a GitHub account

## 📦 Step-by-Step Deployment

### 1️⃣ Create Railway Project
- [ ] Go to railway.app
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository

### 2️⃣ Add PostgreSQL Database
- [ ] Click "+ New" in Railway dashboard
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait for provisioning (~30 seconds)

### 3️⃣ Configure Backend Service
- [ ] Set Root Directory: `backend`
- [ ] Add environment variables:
  - `NODE_ENV=production`
  - `PORT=3001`
  - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
  - `FRONTEND_URL=${{frontend.RAILWAY_PUBLIC_DOMAIN}}`
- [ ] Verify Build Command: `npm install && npx prisma generate && npm run build`
- [ ] Verify Start Command: `npm run start:prod`
- [ ] Generate public domain (Settings → Networking)

### 4️⃣ Configure Frontend Service
- [ ] Add new service from same GitHub repo
- [ ] Set Root Directory: `frontend`
- [ ] Add environment variable:
  - `VITE_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}`
- [ ] Verify Build Command: `npm install && npm run build`
- [ ] Verify Start Command: `npx serve dist -s -p $PORT`
- [ ] Generate public domain (Settings → Networking)

### 5️⃣ Update Environment Variables
After domains are generated:
- [ ] Update Backend `FRONTEND_URL` with actual frontend URL
- [ ] Update Frontend `VITE_API_URL` with actual backend URL
- [ ] Redeploy both services

### 6️⃣ Database Setup
- [ ] Migrations run automatically (via `start:prod` script)
- [ ] Check backend logs to verify migrations
- [ ] Optional: Run seed script via Railway shell

### 7️⃣ Create Admin User
- [ ] Open backend service shell
- [ ] Run admin creation script (see RAILWAY_DEPLOYMENT.md)
- [ ] Or use seed script if it creates admin

### 8️⃣ Verify Deployment
- [ ] Backend health check: `https://your-backend.up.railway.app/health`
- [ ] Frontend loads: `https://your-frontend.up.railway.app`
- [ ] Products display correctly
- [ ] Admin login works: `https://your-frontend.up.railway.app/admin`
- [ ] Can create/edit products
- [ ] Images upload correctly

## 🎯 Your Railway URLs

**Frontend**: `https://__________________.up.railway.app`

**Backend**: `https://__________________.up.railway.app`

**Admin**: `https://__________________.up.railway.app/admin`

## 🔑 Admin Credentials

**Email**: `admin@mkarim.ma`

**Password**: `____________________`

## 📊 Railway Dashboard Overview

```
Your Project
├── 📦 PostgreSQL
│   └── Provides: DATABASE_URL
│
├── 🔧 Backend Service
│   ├── Root: backend/
│   ├── Build: npm install && npx prisma generate && npm run build
│   ├── Start: npm run start:prod
│   └── Env: NODE_ENV, PORT, DATABASE_URL, FRONTEND_URL
│
└── 🎨 Frontend Service
    ├── Root: frontend/
    ├── Build: npm install && npm run build
    ├── Start: npx serve dist -s -p $PORT
    └── Env: VITE_API_URL
```

## ⚠️ Common Issues & Fixes

### Backend won't start
- [ ] Check DATABASE_URL is set
- [ ] Check logs for Prisma errors
- [ ] Verify migrations completed

### Frontend shows API errors
- [ ] Verify VITE_API_URL is correct
- [ ] Check backend is running
- [ ] Check CORS settings

### 404 on frontend routes
- [ ] Ensure using `serve` package
- [ ] Check railway.json exists
- [ ] Verify start command includes `-s` flag

## 💰 Cost Estimate

**Free Tier**: $5 credit/month
- Good for testing
- Limited hours

**Hobby Plan**: $5/month
- 500 execution hours
- **Recommended for production**

**Pro Plan**: $20/month
- More resources
- Priority support

## 📞 Support

- **Full Guide**: See `RAILWAY_DEPLOYMENT.md`
- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway

---

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Deployed ✅

**Deployment Date**: _______________

**Notes**:
_____________________________________________
_____________________________________________
