# Production Deployment Guide

## 1. Prerequisites (Hostinger VPS)
- OS: Ubuntu 22.04 LTS (Recommended)
- Docker & Docker Compose installed

## 2. Prepare Environment
1. Connect to your VPS via SSH.
2. Clone your repository:
   ```bash
   git clone <YOUR_REPO_URL> mkarim
   cd mkarim
   ```

## 3. Configuration (.env)
Create a `.env` file in the root directory:
```bash
nano .env
```
Add the following (adjust values for production):
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=maroc_cash_flow
DATABASE_URL="postgresql://postgres:secure_password_here@db:5432/maroc_cash_flow?schema=public"

# App
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://YOUR_VPS_IP_OR_DOMAIN
VITE_API_URL=http://YOUR_VPS_IP_OR_DOMAIN:3001
JWT_SECRET=super_secret_jwt_key_here
```

## 4. Docker Compose Update
Create/Update `docker-compose.prod.yml` to include a database container if you don't have a managed database:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - FRONTEND_URL=${FRONTEND_URL}
      - PORT=3001
    depends_on:
      - db
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=${VITE_API_URL}
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 5. Deployment
Build and run the containers:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## 6. Post-Deployment
Run database migrations inside the container:
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed
```

## 7. Access
- Frontend: http://YOUR_VPS_IP_OR_DOMAIN
- Backend API: http://YOUR_VPS_IP_OR_DOMAIN:3001/api/health
