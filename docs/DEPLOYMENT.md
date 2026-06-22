# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- AWS Account (for production deployment)
- Node.js 16+
- Python 3.9+
- PostgreSQL 13+
- Redis 6+

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Mike606-coder/emergency-response-app.git
cd emergency-response-app
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Edit .env with your configuration
```

### 3. Start Services with Docker

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- FastAPI backend
- Nginx reverse proxy

### 4. Verify Services

```bash
# Check API health
curl http://localhost:8000/health

# Check database
psql -h localhost -U postgres -d emergency_app

# Check Redis
redis-cli ping
```

## Backend Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance

```bash
# Ubuntu 22.04 LTS, t3.medium or larger
# Security group: Allow ports 22, 80, 443
```

#### 2. Install Dependencies

```bash
sudo apt-get update
sudo apt-get install -y \
  docker.io \
  docker-compose \
  git \
  curl

# Add user to docker group
sudo usermod -aG docker $USER
```

#### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/Mike606-coder/emergency-response-app.git
cd emergency-response-app

# Configure environment
cp backend/.env.example backend/.env
# Edit .env with production values

# Start services
docker-compose up -d

# Verify
curl http://localhost:8000/health
```

#### 4. Configure SSL/TLS

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf with certificate paths
```

### AWS RDS Setup

#### 1. Create RDS Instance

```bash
# PostgreSQL 14.7
# db.t3.small or larger
# Multi-AZ enabled for production
# Automated backups: 30 days
# Encryption enabled
```

#### 2. Create Database

```bash
psql -h <rds-endpoint> -U postgres
CREATE DATABASE emergency_app;
CREATE USER app_user WITH PASSWORD '<strong-password>';
GRANT ALL PRIVILEGES ON DATABASE emergency_app TO app_user;
```

#### 3. Update Connection String

```env
DATABASE_URL=postgresql://app_user:password@<rds-endpoint>:5432/emergency_app
```

### AWS ElastiCache Setup

#### 1. Create Redis Cluster

```bash
# Node type: cache.t3.micro or larger
# Engine: Redis 7.0
# Automatic failover enabled
```

#### 2. Update Connection String

```env
REDIS_URL=redis://<elasticache-endpoint>:6379
```

### AWS S3 Setup (for file uploads)

#### 1. Create S3 Bucket

```bash
aws s3 mb s3://emergency-app-uploads --region us-east-1
```

#### 2. Configure Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:user/app-user"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::emergency-app-uploads/*"
    }
  ]
}
```

#### 3. Update Environment

```env
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_S3_BUCKET=emergency-app-uploads
AWS_REGION=us-east-1
```

## Frontend Deployment

### Mobile App (Expo)

#### 1. Build APK (Android)

```bash
cd frontend
npm install
expo build:android -t apk
```

#### 2. Build IPA (iOS)

```bash
expo build:ios
```

#### 3. Publish to App Stores

- Google Play Store
- Apple App Store

### Web App (React Native Web)

```bash
# Build for web
npm run build:web

# Deploy to Vercel/Netlify
vercel deploy
```

## Database Migrations

### Create Migration

```bash
cd backend
alembic revision --autogenerate -m "Add new table"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback

```bash
alembic downgrade -1
```

## Monitoring & Logging

### CloudWatch Monitoring

```python
# app/core/monitoring.py
import logging
from pythonjsonlogger import jsonlogger

# JSON logging for CloudWatch
logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
```

### Health Checks

```bash
# CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "API-HealthCheck" \
  --alarm-actions arn:aws:sns:region:account:topic
```

## Backup & Recovery

### Automated Backups

```bash
# Daily backup script
#!/bin/bash
DATABASE_URL=postgresql://...
BACKUP_FILE=backup-$(date +%Y%m%d).sql

pg_dump $DATABASE_URL > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://backup-bucket/
```

### Recovery Procedure

```bash
# Restore from backup
pg_restore -d emergency_app backup-20240101.sql
```

## Scaling

### Horizontal Scaling

#### 1. Load Balancer (AWS ELB)

```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name emergency-app-lb \
  --subnets subnet-1 subnet-2
```

#### 2. Auto Scaling Group

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name emergency-app-template \
  --version-description "Version 1.0"

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name emergency-app-asg \
  --launch-template LaunchTemplateName=emergency-app-template \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 3
```

### Database Replication

```bash
# RDS read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier emergency-app-replica \
  --source-db-instance-identifier emergency-app
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t app:latest backend/
      
      - name: Push to ECR
        run: aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster emergency-app \
            --service api \
            --force-new-deployment
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

```bash
# Check database service
psql -h <host> -U postgres -d emergency_app

# Verify environment variable
echo $DATABASE_URL
```

#### 2. Redis Connection Error

```bash
# Check Redis service
redis-cli -h <host> ping

# Verify environment variable
echo $REDIS_URL
```

#### 3. API Not Responding

```bash
# Check API logs
docker logs <container_id>

# Check port 8000
netstat -tlnp | grep 8000
```

## Performance Tuning

### Database Optimization

```sql
-- Analyze and vacuum
VACUUM ANALYZE;

-- Create indexes
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_emergencies_status ON emergencies(status);
```

### Caching Strategy

```python
# Redis caching
from app.core.cache import cache_key

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    key = cache_key(f"user:{user_id}")
    cached = await redis.get(key)
    if cached:
        return json.loads(cached)
    
    user = await db.get_user(user_id)
    await redis.setex(key, 3600, json.dumps(user))
    return user
```

## Security Hardening

### WAF (Web Application Firewall)

```bash
# AWS WAF rules
aws wafv2 create-web-acl \
  --name emergency-app-waf \
  --region us-east-1 \
  --default-action Block={}
```

### DDoS Protection

```bash
# Enable CloudFlare or AWS Shield
aws shield create-protection \
  --name emergency-app-protection \
  --resource-arn <ALB_ARN>
```

## Cost Optimization

### AWS Cost Reduction

- Use reserved instances for predictable workloads
- Enable S3 intelligent-tiering
- Set up CloudWatch alarms for cost anomalies
- Use spot instances for non-critical tasks

### Monitoring Costs

```bash
# AWS Cost Explorer
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```
