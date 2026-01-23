# 🛡️ MKARIM E-Commerce - Integration Test Guide

## Test Environment
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Admin Dashboard**: http://localhost:8080/admin/login

## Admin Credentials
- **Email**: admin@mkarim.ma
- **Password**: 123456

---

## ✅ Test Checklist

### 1. Backend Health Check
**Objective**: Verify backend API is running and database is connected

**Steps**:
1. Open browser console (F12)
2. Navigate to: http://localhost:3001/api/health (or check if there's a health endpoint)
3. Expected: Should return a 200 OK status or API response
4. Check console for errors

**✓ Pass Criteria**: API responds without errors

---

### 2. Admin Login & Authentication
**Objective**: Verify admin authentication system

**Steps**:
1. Navigate to: http://localhost:8080/admin/login
2. Enter credentials:
   - Email: `admin@mkarim.ma`
   - Password: `123456`
3. Click "Se Connecter" or login button
4. Check browser console (F12) for errors
5. Verify redirect to admin dashboard

**✓ Pass Criteria**: 
- Successful login
- Redirected to `/admin/dashboard` or `/admin`
- No console errors
- JWT token stored in localStorage/cookies

**Console Check**:
```javascript
// In browser console, check:
localStorage.getItem('token') // Should show JWT token
```

---

### 3. Admin → User Interface Control Test
**Objective**: Verify admin changes reflect on user-facing site

#### Test 3A: Store Settings Update
**Steps**:
1. In Admin Dashboard, navigate to "Paramètres" (Settings)
2. Change "Nom de la boutique" (Store Name) to: **"MKARIM TEST SHOP"**
3. Save changes
4. Check console for API call success
5. Open new tab: http://localhost:8080
6. Verify navbar shows "MKARIM TEST SHOP"

**✓ Pass Criteria**: Store name updates on user site immediately or after refresh

#### Test 3B: Product Management
**Steps**:
1. In Admin Dashboard, navigate to "Produits" (Products)
2. Edit an existing product (e.g., "PC Gamer MKARIM Pro RTX 4070")
3. Change price from 18999 to **19999**
4. Save changes
5. Navigate to user site: http://localhost:8080/products
6. Find the product and verify new price shows **19,999 MAD**

**✓ Pass Criteria**: Price update reflects on user site

#### Test 3C: Hero Carousel Management
**Steps**:
1. In Admin Dashboard, navigate to "Carousel" or "Hero Slides"
2. Edit the first slide title to: **"TEST SLIDE UPDATED"**
3. Save changes
4. Navigate to user homepage: http://localhost:8080
5. Verify carousel shows updated title

**✓ Pass Criteria**: Carousel updates reflect on homepage

---

### 4. User Order Flow → Admin Dashboard
**Objective**: Verify orders created by users appear in admin dashboard

**Steps**:
1. On user site (http://localhost:8080), navigate to Products
2. Select a product (e.g., "PC Gamer MKARIM Pro RTX 4070")
3. Click "COMMANDER MAINTENANT"
4. Fill checkout form:
   - **Nom**: Test Operator
   - **Téléphone**: 0600000001
   - **Ville**: Casablanca
   - **Adresse**: 123 Test Street, Quartier Test
5. Submit order
6. Note the order number (e.g., ORD-1234)
7. Switch to Admin Dashboard
8. Navigate to "Commandes" (Orders)
9. Verify new order from "Test Operator" appears in list
10. Click on order to view details
11. Verify all order information matches

**✓ Pass Criteria**: 
- Order successfully created
- Order appears in admin dashboard
- All details match (customer name, phone, city, address, products)
- Order status is "pending" or "confirmed"

---

### 5. Database Persistence Test
**Objective**: Verify data persists across server restarts

**Steps**:
1. Create a new product in Admin Dashboard:
   - **Name**: Test Product Integration
   - **Price**: 9999
   - **Category**: PC Portable
   - **Stock**: 10
2. Save product
3. Stop backend server (Ctrl+C in backend terminal)
4. Restart backend: `npm run dev`
5. Refresh admin dashboard
6. Verify "Test Product Integration" still exists
7. Navigate to user site products page
8. Verify product appears there too

**✓ Pass Criteria**: Product persists after server restart

---

### 6. Console Error Check
**Objective**: Ensure no JavaScript errors in production

**Steps**:
1. Open browser console (F12) on user site homepage
2. Navigate through:
   - Homepage (/)
   - Products (/products)
   - Product Detail (/product/[id])
   - Cart (/cart)
   - Checkout (/checkout)
   - Contact (/contact)
3. Document any errors or warnings

**✓ Pass Criteria**: 
- No critical errors (red)
- Only minor warnings acceptable (yellow)
- No CORS errors
- No 404 API errors

---

### 7. API Communication Test
**Objective**: Verify frontend-backend API calls

**Steps**:
1. Open browser Network tab (F12 → Network)
2. Filter by "Fetch/XHR"
3. Navigate to products page
4. Observe API calls to http://localhost:3001/api/products
5. Check response:
   - Status: 200 OK
   - Response contains product array
6. Repeat for other pages (categories, settings, etc.)

**✓ Pass Criteria**: 
- All API calls return 200 status
- Responses contain expected data
- No 401 (unauthorized) or 500 (server error) responses

---

### 8. Real-time Updates Test (if applicable)
**Objective**: Test if admin changes update user site in real-time

**Steps**:
1. Open two browser windows side-by-side:
   - Window A: Admin Dashboard (logged in)
   - Window B: User site homepage
2. In Window A, update store name in settings
3. In Window B, refresh page
4. Verify changes appear

**✓ Pass Criteria**: Changes propagate within 1-2 seconds or after refresh

---

## 🔍 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution**: 
- Verify backend is running on port 3001
- Check `frontend/.env` or `vite.config.ts` for correct API URL
- Ensure CORS is configured in backend

### Issue: "Admin login fails"
**Solution**:
- Run database seed: `cd backend && npm run seed`
- Verify database connection in `backend/.env`
- Check backend console for errors

### Issue: "Products not loading"
**Solution**:
- Check Network tab for API errors
- Verify database has products: `cd backend && npx prisma studio`
- Check backend logs

### Issue: "Orders not appearing in admin"
**Solution**:
- Verify order API endpoint: http://localhost:3001/api/orders
- Check database for orders table
- Ensure admin has permission to view orders

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

[ ] 1. Backend Health Check
[ ] 2. Admin Login & Authentication  
[ ] 3A. Store Settings Update
[ ] 3B. Product Management
[ ] 3C. Hero Carousel Management
[ ] 4. User Order Flow → Admin Dashboard
[ ] 5. Database Persistence Test
[ ] 6. Console Error Check
[ ] 7. API Communication Test
[ ] 8. Real-time Updates Test

Console Errors Found:
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
```

---

## 🚀 Quick Verification Script

Run this in browser console on user site to verify API connection:

```javascript
// Test API Connection
fetch('http://localhost:3001/api/products')
  .then(res => res.json())
  .then(data => console.log('✅ Products loaded:', data.length, 'items'))
  .catch(err => console.error('❌ API Error:', err));

// Test Settings API
fetch('http://localhost:3001/api/settings')
  .then(res => res.json())
  .then(data => console.log('✅ Settings loaded:', data))
  .catch(err => console.error('❌ Settings Error:', err));
```

---

**Last Updated**: 2026-01-23
**Version**: 2.0
