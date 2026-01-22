# Production Deployment Checklist

Use this checklist before deploying to production.

## 📋 Pre-Deployment

### Code Quality
- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] No hardcoded credentials or secrets
- [ ] Error handling implemented for all API endpoints
- [ ] Input validation on all forms
- [ ] TypeScript compilation successful (`npm run build`)

### Environment Configuration
- [ ] `.env` files created for production
- [ ] `DATABASE_URL` configured with production database
- [ ] `VITE_API_URL` points to production backend
- [ ] `FRONTEND_URL` configured in backend
- [ ] `NODE_ENV=production` set
- [ ] Strong passwords for database and admin accounts
- [ ] JWT secret is strong (32+ characters)

### Database
- [ ] Production database created
- [ ] Database migrations tested
- [ ] Backup strategy in place
- [ ] Connection pooling configured
- [ ] Database indexes optimized

### Security
- [ ] HTTPS/SSL certificate configured
- [ ] CORS configured for production domain only
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] File upload size limits set
- [ ] SQL injection protection verified (Prisma handles this)
- [ ] XSS protection enabled
- [ ] Password hashing verified (bcrypt)
- [ ] JWT token expiration configured

### Performance
- [ ] Frontend build optimized (`npm run build`)
- [ ] Images optimized and compressed
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Database queries optimized
- [ ] API response times acceptable (<500ms)

## 🚀 Deployment

### Docker Deployment
- [ ] Dockerfile tested locally
- [ ] docker-compose.yml configured
- [ ] Environment variables in .env file
- [ ] Docker images built successfully
- [ ] Containers running without errors
- [ ] Database migrations executed
- [ ] Health checks passing

### VPS/Server Deployment
- [ ] Server secured (firewall, SSH keys)
- [ ] Node.js installed (v18+)
- [ ] PM2 or process manager configured
- [ ] Nginx/Apache configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Application running on startup

### Platform Deployment (Render/Railway)
- [ ] Repository connected
- [ ] Build commands configured
- [ ] Start commands configured
- [ ] Environment variables set
- [ ] Auto-deploy configured (optional)
- [ ] Custom domain configured

## ✅ Post-Deployment

### Verification
- [ ] Frontend loads at production URL
- [ ] Backend health check responds (`/health`)
- [ ] Admin login works
- [ ] Product listing works
- [ ] Product detail pages load
- [ ] Cart functionality works
- [ ] Order creation works
- [ ] Image uploads work
- [ ] Contact form works
- [ ] All API endpoints responding

### Admin Setup
- [ ] Admin user created
- [ ] Admin can login
- [ ] Products can be created/edited
- [ ] Orders can be viewed/managed
- [ ] Categories can be managed
- [ ] Settings can be updated
- [ ] Cities can be managed

### Monitoring
- [ ] Uptime monitoring configured
- [ ] Error tracking configured (Sentry)
- [ ] Log aggregation set up
- [ ] Performance monitoring enabled
- [ ] Database monitoring active
- [ ] Disk space monitoring configured
- [ ] SSL certificate expiry monitoring

### Backups
- [ ] Database backup script created
- [ ] Automated daily backups scheduled
- [ ] Backup restoration tested
- [ ] Uploads directory backed up
- [ ] Backup retention policy set (7-30 days)

### Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Admin credentials stored securely
- [ ] API documentation updated
- [ ] Troubleshooting guide available

## 🔧 Maintenance

### Regular Tasks
- [ ] Weekly: Check application logs
- [ ] Weekly: Review error reports
- [ ] Weekly: Check disk space
- [ ] Monthly: Update dependencies
- [ ] Monthly: Security audit
- [ ] Monthly: Performance review
- [ ] Quarterly: Backup restoration test

### Update Procedure
- [ ] Test updates in staging environment
- [ ] Create database backup before update
- [ ] Document rollback procedure
- [ ] Schedule maintenance window
- [ ] Notify users of maintenance (if needed)

## 🆘 Emergency Contacts

- **Hosting Provider Support**: _________________
- **Database Provider Support**: _________________
- **Domain Registrar**: _________________
- **SSL Certificate Provider**: _________________
- **Developer Contact**: contact@mkarim.ma

## 📊 Performance Targets

- [ ] Page load time: < 3 seconds
- [ ] API response time: < 500ms
- [ ] Uptime: > 99.5%
- [ ] Error rate: < 1%
- [ ] Database query time: < 100ms

## 🎯 Launch Readiness

**Overall Status**: ⬜ Not Ready | ⬜ Ready | ⬜ Deployed

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Quick Commands Reference

### Build
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Deploy with Docker
```bash
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

### Check Status
```bash
# Docker
docker-compose ps
docker-compose logs -f

# PM2
pm2 status
pm2 logs
```

### Restart Services
```bash
# Docker
docker-compose restart

# PM2
pm2 restart all
```

---

**Last Updated**: January 2026
