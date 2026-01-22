# 🎯 RAILWAY DEPLOYMENT - COMPLETE GUIDE

## 📖 What You Need to Know

You're deploying the **MKARIM E-Commerce Platform** to **Railway.app**. This is a complete full-stack application with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: Push to GitHub (5 minutes)

```bash
# Navigate to your project
cd c:\Users\ASUS\Desktop\maroc-cash-flow-main-v2

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/mkarim-ecommerce.git
git branch -M main
git push -u origin main
```

✅ **Verify**: Your code is on GitHub

---

### STEP 2: Create Railway Account (2 minutes)

1. Go to **https://railway.app**
2. Click **"Login with GitHub"**
3. Authorize Railway

✅ **Verify**: You're logged into Railway

---

### STEP 3: Create New Project (1 minute)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **your repository**

✅ **Verify**: Project created in Railway

---

### STEP 4: Add PostgreSQL Database (1 minute)

1. In your project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Wait ~30 seconds for provisioning

✅ **Verify**: PostgreSQL service appears in dashboard

---

### STEP 5: Configure Backend (5 minutes)

Railway should auto-detect your backend. If not, add it manually:

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repository
3. Click on the **Backend service**
4. Go to **"Settings"** tab

**Set Root Directory:**
- Scroll to **"Service"** section
- Set **Root Directory**: `backend`

**Configure Variables:**
- Go to **"Variables"** tab
- Click **"+ New Variable"** and add each:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
FRONTEND_URL=${{frontend.RAILWAY_PUBLIC_DOMAIN}}
```

**Generate Public Domain:**
- Go to **"Settings"** → **"Networking"**
- Click **"Generate Domain"**
- Copy the URL (e.g., `mkarim-backend.up.railway.app`)

✅ **Verify**: Backend has environment variables and public domain

---

### STEP 6: Configure Frontend (5 minutes)

1. Click **"+ New"** → **"GitHub Repo"**
2. Select the **same repository**
3. Click on the **Frontend service**
4. Go to **"Settings"** tab

**Set Root Directory:**
- Set **Root Directory**: `frontend`

**Configure Variables:**
- Go to **"Variables"** tab
- Add:

```
VITE_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

**Generate Public Domain:**
- Go to **"Settings"** → **"Networking"**
- Click **"Generate Domain"**
- Copy the URL (e.g., `mkarim-frontend.up.railway.app`)

✅ **Verify**: Frontend has environment variable and public domain

---

### STEP 7: Update URLs with Actual Domains (3 minutes)

Now that you have the actual domains, update the variables:

**Backend Variables:**
1. Click **Backend service** → **"Variables"**
2. Edit `FRONTEND_URL`
3. Replace with: `https://mkarim-frontend.up.railway.app` (your actual URL)

**Frontend Variables:**
1. Click **Frontend service** → **"Variables"**
2. Edit `VITE_API_URL`
3. Replace with: `https://mkarim-backend.up.railway.app` (your actual URL)

✅ **Verify**: Both services have actual URLs (not template variables)

---

### STEP 8: Redeploy Services (2 minutes)

After updating variables:

1. Click **Backend service** → **"Deployments"**
2. Click **"Redeploy"** on latest deployment
3. Do the same for **Frontend service**

✅ **Verify**: Both services are redeploying

---

### STEP 9: Wait for Deployment (3-5 minutes)

Watch the deployment logs:

1. Click on **Backend service**
2. Click on the latest deployment
3. Watch the logs

**What to look for:**
- ✅ `npm install` completes
- ✅ `prisma generate` runs
- ✅ `npm run build` succeeds
- ✅ `prisma migrate deploy` runs (migrations)
- ✅ Server starts on port 3001

Do the same for Frontend.

✅ **Verify**: Both services show "Success" status

---

### STEP 10: Create Admin User (3 minutes)

1. Click on **Backend service**
2. Click the **three dots (⋮)** menu
3. Select **"Shell"** or **"Terminal"**
4. Run this command:

```bash
npx tsx -e "import prisma from './src/lib/prisma'; import bcrypt from 'bcryptjs'; async function createAdmin() { const hashedPassword = await bcrypt.hash('Admin123!', 10); const admin = await prisma.admin.create({ data: { email: 'admin@mkarim.ma', password: hashedPassword, name: 'Admin', role: 'super_admin', active: true } }); console.log('Admin created:', admin.email); await prisma.\$disconnect(); } createAdmin();"
```

✅ **Verify**: See "Admin created: admin@mkarim.ma"

---

### STEP 11: Test Your Deployment (5 minutes)

**Test Backend:**
1. Open browser
2. Go to: `https://your-backend.up.railway.app/health`
3. Should see: `{"status":"ok"}`

**Test Frontend:**
1. Go to: `https://your-frontend.up.railway.app`
2. Should see your homepage
3. Products should load
4. Categories should display

**Test Admin:**
1. Go to: `https://your-frontend.up.railway.app/admin`
2. Login with:
   - Email: `admin@mkarim.ma`
   - Password: `Admin123!`
3. Should see admin dashboard

✅ **Verify**: Everything works!

---

## 🎉 YOU'RE LIVE!

Your application is now deployed and accessible worldwide!

**Your URLs:**
- **Frontend**: `https://your-frontend.up.railway.app`
- **Backend**: `https://your-backend.up.railway.app`
- **Admin Panel**: `https://your-frontend.up.railway.app/admin`

---

## 📊 What Railway Created

```
Your Railway Project
│
├── PostgreSQL Database
│   └── Automatically provides DATABASE_URL
│
├── Backend Service (Node.js)
│   ├── Root Directory: backend/
│   ├── Auto-runs migrations on start
│   ├── Serves API on port 3001
│   └── Public URL: backend.up.railway.app
│
└── Frontend Service (React)
    ├── Root Directory: frontend/
    ├── Built with Vite
    ├── Served with Nginx
    └── Public URL: frontend.up.railway.app
```

---

## 💰 Railway Costs

- **Free Tier**: $5 credit/month (good for testing)
- **Hobby Plan**: $5/month - **RECOMMENDED**
  - 500 execution hours
  - Perfect for small production apps
- **Pro Plan**: $20/month (for scaling)

**Your app should cost ~$5-10/month on Hobby plan**

---

## 🔧 Managing Your Deployment

### View Logs
1. Click on any service
2. Click latest deployment
3. Scroll to "Logs" section

### Restart Service
1. Click on service
2. Go to "Deployments"
3. Click "Redeploy"

### Update Code
1. Push to GitHub
2. Railway auto-deploys! ✨

### View Database
1. Click "Postgres" service
2. Go to "Data" tab
3. Browse tables

---

## ⚠️ Troubleshooting

### Backend Won't Start
**Check:**
- DATABASE_URL is set correctly
- Migrations completed (check logs)
- No TypeScript errors in build

**Fix:**
- Redeploy backend service
- Check deployment logs for errors

### Frontend Shows "API Error"
**Check:**
- VITE_API_URL is correct
- Backend is running (check health endpoint)

**Fix:**
- Verify backend URL in frontend variables
- Redeploy frontend

### Database Connection Failed
**Check:**
- Postgres service is running
- DATABASE_URL variable exists

**Fix:**
- Restart Postgres service
- Verify DATABASE_URL in backend variables

---

## 📞 Need Help?

1. **Check Logs**: Most issues show in deployment logs
2. **Railway Docs**: https://docs.railway.app
3. **Railway Discord**: https://discord.gg/railway
4. **Full Guide**: See `RAILWAY_DEPLOYMENT.md` in your project

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check responds
- [ ] Frontend loads correctly
- [ ] Products display
- [ ] Categories work with product counts
- [ ] Admin login works
- [ ] Can create products in admin
- [ ] Can edit products
- [ ] Orders can be placed
- [ ] Contact form works
- [ ] Images upload correctly

---

## 🚀 Next Steps

1. **Test Everything**: Go through all features
2. **Add Content**: Upload your products
3. **Configure Settings**: Update store settings in admin
4. **Custom Domain** (Optional): Add your own domain in Railway
5. **Monitor**: Check logs regularly
6. **Backup**: Railway handles database backups

---

## 🎊 Congratulations!

You've successfully deployed a full-stack e-commerce application to production!

**Share your app:**
- Frontend: `https://your-frontend.up.railway.app`

**Admin access:**
- URL: `https://your-frontend.up.railway.app/admin`
- Email: `admin@mkarim.ma`
- Password: `Admin123!`

⚠️ **Remember to change the admin password in production!**

---

**Happy Selling! 🛍️**
