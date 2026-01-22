# Backend Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Neon PostgreSQL database account

## Setup Steps

### 1. Create Neon Database
1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Create a new project
4. Copy the connection string

### 2. Configure Environment
Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

Replace the `DATABASE_URL` with your Neon connection string.

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npx tsx prisma/seed.ts
```

### 5. Start Server
```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create COD order
- `GET /api/orders` - List orders (admin)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Cities
- `GET /api/cities` - List delivery cities
- `POST /api/cities` - Create city (admin)
- `PUT /api/cities/:id` - Update city (admin)

## Testing
Visit `http://localhost:3001/health` to verify the server is running.
