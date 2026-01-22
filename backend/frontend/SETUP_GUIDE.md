# 🚀 Morocco Cash Flow - Setup Guide

Complete guide to set up and run your full-stack e-commerce application.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL account (free tier available)

---

## 🗄️ Part 1: Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up or log in
3. Click **"Create Project"**
4. Choose a project name (e.g., "maroc-cash-flow")
5. Select region closest to you
6. Click **"Create Project"**

### Step 2: Get Connection String

1. In your Neon dashboard, go to **"Connection Details"**
2. Copy the **connection string** (it looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

---

## 🔧 Part 2: Backend Setup

### Step 1: Configure Environment

Navigate to the backend folder and create `.env`:

```bash
cd backend
```

Create a file named `.env` with:

```env
DATABASE_URL="your-neon-connection-string-here"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

**Replace** `your-neon-connection-string-here` with your actual Neon connection string.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

Seed initial data (products, cities):
```bash
npx tsx prisma/seed.ts
```

### Step 4: Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

**Keep this terminal open!**

---

## 💻 Part 3: Frontend Setup

Open a **new terminal** window.

### Step 1: Navigate to Root

```bash
cd ..
```

(You should be in the main project folder)

### Step 2: Verify Environment

The `.env` file should already exist with:
```env
VITE_API_URL=http://localhost:3001
```

### Step 3: Install Dependencies (if needed)

```bash
npm install
```

### Step 4: Start Frontend

```bash
npm run dev
```

The app will run on: `http://localhost:8080`

---

## ✅ Part 4: Verification

### Test Backend API

Open your browser and visit:
- `http://localhost:3001/health` - Should show `{"status":"ok"}`
- `http://localhost:3001/api/products` - Should show products list
- `http://localhost:3001/api/cities` - Should show cities list

### Test Frontend

1. Visit `http://localhost:8080`
2. Click **"Produits"** in navbar
3. Click **"Ajouter"** on a product
4. Check cart icon (should show count)
5. Click cart icon
6. Click **"Passer la commande"**
7. Fill form and submit

---

## 🎯 What's Working

### Frontend Features
- ✅ Shopping cart (add/remove/update quantity)
- ✅ Cart persistence (localStorage)
- ✅ Real-time cart count in navbar
- ✅ Checkout flow with validation
- ✅ Order success page with confetti
- ✅ Admin dashboard (9 pages)
- ✅ Admin authentication

### Backend Features
- ✅ Products API (GET, POST, PUT, DELETE)
- ✅ Orders API (POST, GET, PATCH)
- ✅ Cities API (GET, POST, PUT)
- ✅ Moroccan phone validation
- ✅ PostgreSQL database
- ✅ Prisma ORM

---

## 🔍 Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct in `backend/.env`
- Ensure Neon database is active
- Run `npm run prisma:generate` again

### Frontend shows API errors
- Ensure backend is running on port 3001
- Check `.env` has `VITE_API_URL=http://localhost:3001`
- Restart frontend: `Ctrl+C` then `npm run dev`

### Cart not working
- Clear browser localStorage
- Hard refresh: `Ctrl+Shift+R`

---

## 📱 Admin Dashboard

Access: `http://localhost:8080/admin`

**Login Credentials:**
- Email: `admin@mkarim.ma`
- Password: `123456`

**Pages:**
1. Dashboard - KPIs and charts
2. Orders - Manage all orders
3. Products - CRUD operations
4. Categories - Manage categories
5. Cities - Delivery settings
6. Customers - Customer database
7. Analytics - Business insights
8. Settings - Store configuration
9. Admin Users - User management

---

## 🚀 Next Steps

### For Development
- Products are fetched from API (when backend is running)
- Orders are created in database
- Cart state is persistent
- Admin can manage everything

### For Production
- Deploy backend to Railway/Render/Fly.io
- Deploy frontend to Vercel/Netlify
- Update `VITE_API_URL` to production backend URL
- Secure admin routes with real authentication

---

## 📞 Support

If you encounter issues:
1. Check both terminals are running
2. Verify DATABASE_URL is correct
3. Clear browser cache
4. Restart both servers
