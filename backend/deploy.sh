#!/bin/bash

# MKARIM Quick Deploy Script
# This script helps you quickly deploy the application

set -e  # Exit on error

echo "🚀 MKARIM Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "Please create a .env file from .env.example"
    echo "Run: cp .env.example .env"
    exit 1
fi

print_success ".env file found"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

print_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

print_success "Docker Compose is installed"

# Load environment variables
source .env

# Verify required environment variables
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL is not set in .env"
    exit 1
fi

print_success "Environment variables loaded"

echo ""
echo "Select deployment option:"
echo "1) Fresh deployment (build and start)"
echo "2) Rebuild and restart"
echo "3) Start existing containers"
echo "4) Stop containers"
echo "5) View logs"
echo "6) Run database migrations"
echo "7) Seed database"
echo "8) Create admin user"
echo "9) Exit"
echo ""

read -p "Enter option (1-9): " option

case $option in
    1)
        echo ""
        print_warning "Starting fresh deployment..."
        
        # Build images
        echo "Building Docker images..."
        docker-compose build
        print_success "Images built"
        
        # Start containers
        echo "Starting containers..."
        docker-compose up -d
        print_success "Containers started"
        
        # Wait for backend to be ready
        echo "Waiting for backend to be ready..."
        sleep 10
        
        # Run migrations
        echo "Running database migrations..."
        docker-compose exec -T backend npx prisma migrate deploy
        print_success "Migrations completed"
        
        echo ""
        print_success "Deployment completed!"
        echo ""
        echo "Frontend: http://localhost (or your configured domain)"
        echo "Backend: http://localhost:3001"
        echo ""
        echo "Run option 7 to seed the database with sample data"
        echo "Run option 8 to create an admin user"
        ;;
        
    2)
        echo ""
        print_warning "Rebuilding and restarting..."
        
        docker-compose down
        docker-compose build
        docker-compose up -d
        
        print_success "Rebuild completed"
        ;;
        
    3)
        echo ""
        print_warning "Starting containers..."
        
        docker-compose up -d
        
        print_success "Containers started"
        ;;
        
    4)
        echo ""
        print_warning "Stopping containers..."
        
        docker-compose down
        
        print_success "Containers stopped"
        ;;
        
    5)
        echo ""
        echo "Showing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
        
    6)
        echo ""
        print_warning "Running database migrations..."
        
        docker-compose exec backend npx prisma migrate deploy
        
        print_success "Migrations completed"
        ;;
        
    7)
        echo ""
        print_warning "Seeding database..."
        
        docker-compose exec backend npx tsx prisma/seed.ts
        
        print_success "Database seeded"
        ;;
        
    8)
        echo ""
        echo "Create Admin User"
        echo "================="
        
        read -p "Admin email: " admin_email
        read -sp "Admin password: " admin_password
        echo ""
        read -p "Admin name: " admin_name
        
        docker-compose exec -T backend npx tsx -e "
        import prisma from './src/lib/prisma';
        import bcrypt from 'bcryptjs';
        
        async function createAdmin() {
          try {
            const hashedPassword = await bcrypt.hash('$admin_password', 10);
            const admin = await prisma.admin.create({
              data: {
                email: '$admin_email',
                password: hashedPassword,
                name: '$admin_name',
                role: 'super_admin',
                active: true
              }
            });
            console.log('✓ Admin created successfully');
            console.log('Email:', admin.email);
          } catch (error) {
            console.error('✗ Error creating admin:', error.message);
          } finally {
            await prisma.\$disconnect();
          }
        }
        
        createAdmin();
        "
        ;;
        
    9)
        echo "Goodbye!"
        exit 0
        ;;
        
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac
