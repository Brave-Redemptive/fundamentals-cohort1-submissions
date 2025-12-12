# WaveCom Notification System - Setup & Testing Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Testing the System](#testing-the-system)
5. [Troubleshooting](#troubleshooting)
6. [Performance Testing](#performance-testing)

---

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Docker**: Version 20.0 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For version control

### Verify Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
docker --version  # Should show 20.x.x or higher
docker-compose --version  # Should show 2.x.x or higher
```

### Optional Tools
- **Postman**: For API testing (download from [postman.com](https://www.postman.com/downloads/))
- **MongoDB Compass**: For database visualization (download from [mongodb.com](https://www.mongodb.com/products/compass))
- **VS Code**: Recommended code editor

---

## Quick Start

### 1. Start Infrastructure Services

```bash
# Navigate to project directory
cd week-12

# Start MongoDB and RabbitMQ using Docker Compose
docker-compose up -d

# Verify services are running
docker-compose ps
```

Expected output:
```
NAME                   STATUS              PORTS
wavecom-mongodb        running             0.0.0.0:27017->27017/tcp
wavecom-rabbitmq       running             0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Backend should start on **http://localhost:5000**

### 3. Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd week-12/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend should start on **http://localhost:5173**

### 4. Start Worker Process

Open **another terminal window**:

```bash
# Navigate to backend directory
cd week-12/backend

# Start worker in development mode
npm run worker:dev
```

### 5. Verify Everything is Running

Open your browser and navigate to:
- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **RabbitMQ Management**: http://localhost:15672 (login: admin/admin)

---

## Detailed Setup

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- Express.js, Mongoose, AMQPLIB (core)
- Joi, Helmet, CORS (security & validation)
- Winston (logging)
- Prometheus client (metrics)

#### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file if needed:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/wavecom-notifications

# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672
NOTIFICATION_QUEUE=notifications
DLQ_QUEUE=notifications_dlq

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Retry Configuration
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY_MS=5000

# Provider URLs (Mock)
EMAIL_PROVIDER_URL=https://mock-email-provider.com
SMS_PROVIDER_URL=https://mock-sms-provider.com
PUSH_PROVIDER_URL=https://mock-push-provider.com

# Monitoring
ENABLE_METRICS=true
```

#### 3. Available NPM Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run worker       # Start worker process (production)
npm run worker:dev   # Start worker with hot reload
npm test             # Run tests with coverage
npm test:watch       # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

#### 4. Verify Backend is Running

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-12-11T10:00:00.000Z",
  "services": {
    "mongodb": "connected",
    "rabbitmq": "connected"
  },
  "uptime": 123.456
}
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React 18, React Router v6
- TanStack React Query, Zustand
- Tailwind CSS, Lucide React
- React Hook Form, Zod

#### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file if needed:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

#### 3. Available NPM Scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### 4. Verify Frontend is Running

Open browser at **http://localhost:5173**

You should see the WaveCom Dashboard with:
- Navigation bar (Dashboard, Create Notification)
- Stats cards (Total, Sent, Failed, Pending)
- Recent notifications table

---

## Testing the System

### Manual Testing via Frontend

#### Test 1: Create Email Notification

1. Navigate to **http://localhost:5173/create**
2. Fill in the form:
   - **Type**: Email
   - **Recipient**: test@example.com
   - **Subject**: Test Email Notification
   - **Message**: This is a test email from WaveCom
   - **Priority**: High
3. Click **Send Notification**
4. You should see a success message with the notification ID
5. Click **View Notification Status** to see details

#### Test 2: Create SMS Notification

1. Navigate to **http://localhost:5173/create**
2. Fill in the form:
   - **Type**: SMS
   - **Recipient**: +1234567890
   - **Message**: Your OTP is 123456
   - **Priority**: Critical
3. Click **Send Notification**
4. Verify success message

#### Test 3: Create Push Notification

1. Navigate to **http://localhost:5173/create**
2. Fill in the form:
   - **Type**: Push
   - **Recipient**: device_token_abc123
   - **Subject**: New Message
   - **Message**: You have 3 new messages
   - **Priority**: Medium
3. Click **Send Notification**

#### Test 4: View Dashboard

1. Navigate to **http://localhost:5173/dashboard**
2. Verify stats cards show correct counts
3. Verify recent notifications table displays notifications
4. Test status filter dropdown (Pending, Sent, Failed, etc.)
5. Click on a notification to view detailed status

#### Test 5: Monitor Notification Status

1. Create a notification via the form
2. Click **View Notification Status**
3. Watch the status change in real-time:
   - PENDING → QUEUED → PROCESSING → SENT
4. Verify timeline shows status changes
5. Check processing time is displayed

---

### API Testing via Postman

#### 1. Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select `WaveCom-Notification-API.postman_collection.json`
4. The collection will appear in your Collections sidebar

#### 2. Set Collection Variables

1. Click on the collection
2. Go to **Variables** tab
3. Set `base_url` to `http://localhost:5000`

#### 3. Run Health Check

1. Expand **Health & Status** folder
2. Click **Health Check** request
3. Click **Send**
4. Verify response status is 200
5. Check that tests pass (green checkmarks)

#### 4. Create Notifications

**Test Email Notification:**
1. Expand **Notifications** folder
2. Click **Create Email Notification**
3. Click **Send**
4. Verify status 201 Created
5. Copy the `_id` from response (it's automatically saved to collection variable)

**Test SMS Notification:**
1. Click **Create SMS Notification**
2. Click **Send**
3. Verify status 201 Created

**Test Push Notification:**
1. Click **Create Push Notification**
2. Click **Send**
3. Verify status 201 Created

#### 5. Get Notification Details

1. Click **Get Notification by ID**
2. Click **Send** (uses the ID from previous create request)
3. Verify response includes:
   - Notification details
   - Audit logs array
   - Status changes timeline

#### 6. List Notifications

1. Click **List All Notifications**
2. Click **Send**
3. Verify pagination data:
   - `notifications` array
   - `pagination` object with currentPage, totalPages, etc.

#### 7. Test Filters

**Filter by Status:**
1. Click **Filter by Status - Sent**
2. Click **Send**
3. Verify only SENT notifications are returned

**Filter by Type:**
1. Click **Filter by Type - Email**
2. Click **Send**
3. Verify only EMAIL notifications are returned

**Filter by Priority:**
1. Click **Filter by Priority - Critical**
2. Click **Send**
3. Verify only CRITICAL priority notifications are returned

#### 8. Get Statistics

1. Expand **Statistics & Analytics** folder
2. Click **Get System Statistics**
3. Click **Send**
4. Verify response includes:
   - Total count
   - Breakdown by status
   - Breakdown by type
   - Breakdown by priority
   - Queue depth
   - Average processing time
   - Success rate

#### 9. Test Validation

Expand **Validation Tests** folder and run each request:

**Missing Required Field:**
1. Click **Invalid - Missing Required Field**
2. Click **Send**
3. Verify status 400 Bad Request
4. Check error message indicates missing field

**Wrong Type:**
1. Click **Invalid - Wrong Type**
2. Click **Send**
3. Verify status 400
4. Check error indicates invalid type

**Invalid Email:**
1. Click **Invalid - Invalid Email**
2. Click **Send**
3. Verify status 400
4. Check error indicates invalid email format

**Email Missing Subject:**
1. Click **Invalid - Email Missing Subject**
2. Click **Send**
3. Verify status 400

**Notification Not Found:**
1. Click **Invalid - Notification Not Found**
2. Click **Send**
3. Verify status 404 Not Found

#### 10. Run All Tests

1. Click on collection name
2. Click **Run** button
3. Select all requests
4. Set iterations to 1
5. Click **Run Collection**
6. Verify all tests pass

---

### API Testing via cURL

#### Create Email Notification
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EMAIL",
    "recipient": "john.doe@example.com",
    "subject": "Welcome to WaveCom",
    "message": "Thank you for signing up!",
    "priority": "HIGH"
  }'
```

#### Create SMS Notification
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SMS",
    "recipient": "+1234567890",
    "message": "Your OTP is 123456",
    "priority": "CRITICAL"
  }'
```

#### Get Notification by ID
```bash
# Replace {id} with actual notification ID
curl http://localhost:5000/api/notifications/{id}
```

#### List All Notifications
```bash
curl "http://localhost:5000/api/notifications?page=1&limit=20"
```

#### Filter by Status
```bash
curl "http://localhost:5000/api/notifications?status=sent"
```

#### Get System Stats
```bash
curl http://localhost:5000/api/notifications/stats/system
```

#### Health Check
```bash
curl http://localhost:5000/health
```

---

### Database Testing via MongoDB Compass

#### 1. Connect to MongoDB

1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click **Connect**

#### 2. Explore Database

1. Select database: `wavecom-notifications`
2. View collections:
   - `notifications` - Main notification documents
   - `notificationlogs` - Audit trail

#### 3. Query Notifications

**Find all notifications:**
```javascript
{}
```

**Find sent notifications:**
```javascript
{ status: "sent" }
```

**Find failed notifications:**
```javascript
{ status: "failed" }
```

**Find by type:**
```javascript
{ type: "EMAIL" }
```

**Find by priority:**
```javascript
{ priority: "CRITICAL" }
```

**Find recent notifications (last hour):**
```javascript
{
  createdAt: {
    $gte: new Date(Date.now() - 3600000)
  }
}
```

#### 4. Inspect Indexes

1. Click on `notifications` collection
2. Go to **Indexes** tab
3. Verify indexes exist on:
   - `type`, `status`, `recipient`, `priority`
   - Compound indexes for performance

---

### Queue Testing via RabbitMQ Management UI

#### 1. Access Management UI

1. Open browser at **http://localhost:15672**
2. Login:
   - **Username**: admin
   - **Password**: admin

#### 2. View Queues

1. Click **Queues** tab
2. You should see:
   - `high_priority` - For CRITICAL and HIGH priority
   - `notifications` - For MEDIUM and LOW priority
   - `retry` - For notifications pending retry
   - `notifications_dlq` - Dead Letter Queue

#### 3. Monitor Queue Depth

1. Observe **Ready** and **Unacked** message counts
2. **Ready**: Messages waiting to be consumed
3. **Unacked**: Messages being processed by workers

#### 4. Inspect Messages

1. Click on a queue name (e.g., `notifications`)
2. Scroll to **Get messages** section
3. Set **Messages**: 1
4. Click **Get Message(s)**
5. Expand message to see payload

#### 5. Purge Queues (if needed)

1. Click on queue name
2. Scroll to **Delete / purge** section
3. Click **Purge Messages** to clear queue
4. Confirm action

⚠️ **Warning**: Only purge queues in development!

---

## Troubleshooting

### Backend Issues

#### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB container is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker logs wavecom-mongodb
```

#### Issue: "Cannot connect to RabbitMQ"

**Solution:**
```bash
# Check if RabbitMQ container is running
docker ps | grep rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq

# Check RabbitMQ logs
docker logs wavecom-rabbitmq

# Wait 30 seconds for RabbitMQ to fully start
```

#### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
# On Windows:
netstat -ano | findstr :5000

# On Mac/Linux:
lsof -i :5000

# Kill the process or change PORT in .env file
# Edit backend/.env:
PORT=5001
```

#### Issue: Worker not processing notifications

**Solution:**
```bash
# Check worker is running
# Look for worker process in terminal

# Restart worker
npm run worker:dev

# Check RabbitMQ queues have messages
# Visit http://localhost:15672
```

### Frontend Issues

#### Issue: "Network Error" when creating notification

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/health

# Check CORS is enabled in backend
# Verify backend/.env has no CORS restrictions

# Check frontend/.env has correct API URL
VITE_API_BASE_URL=http://localhost:5000
```

#### Issue: "Failed to compile" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### Issue: Dashboard shows no data

**Solution:**
```bash
# Create some test notifications first
# Use Postman or frontend create form

# Check browser console for errors
# Press F12 > Console tab

# Verify API is accessible
curl http://localhost:5000/api/notifications
```

### Docker Issues

#### Issue: "Cannot start container"

**Solution:**
```bash
# Stop all containers
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Start fresh
docker-compose up -d

# Check container logs
docker-compose logs -f
```

#### Issue: "Port already allocated"

**Solution:**
```bash
# Find what's using the port
# On Windows:
netstat -ano | findstr :27017
netstat -ano | findstr :5672

# On Mac/Linux:
lsof -i :27017
lsof -i :5672

# Stop the process or modify docker-compose.yml ports
```

---

## Performance Testing

### Load Testing with Postman Collection Runner

#### 1. Setup Load Test

1. Open Postman
2. Click on **WaveCom Notification API** collection
3. Click **Run** button
4. Configure:
   - **Iterations**: 100
   - **Delay**: 100ms
   - Select **Bulk Create - 10 Notifications**
5. Click **Run Collection**

This will create 100 notifications over ~10 seconds.

#### 2. Monitor Performance

**Check Queue Depth:**
1. Open RabbitMQ Management UI
2. Watch queue depth increase and decrease
3. Verify workers are consuming messages

**Check Database Performance:**
1. Open MongoDB Compass
2. Run query: `{ createdAt: { $gte: new Date(Date.now() - 60000) } }`
3. Count documents created in last minute

**Check API Performance:**
1. In Postman results, view average response time
2. Target: < 100ms for create notification
3. Check for any failed requests

#### 3. Stress Test - High Load

**Scale Workers:**
```bash
# Open multiple terminals and start workers
# Terminal 1:
npm run worker:dev

# Terminal 2:
npm run worker:dev

# Terminal 3:
npm run worker:dev
```

**Run High Volume Test:**
1. In Postman Collection Runner
2. Set **Iterations**: 500
3. Set **Delay**: 50ms
4. Run **Bulk Create** request
5. Monitor system resources

**Expected Results:**
- 500 notifications created in ~25 seconds
- API response time < 150ms
- Queue depth peaks then drains
- All notifications processed within 2 minutes

### Load Testing with Apache Bench (ab)

#### Install Apache Bench

**On Mac:**
```bash
brew install httpd
```

**On Ubuntu/Debian:**
```bash
sudo apt-get install apache2-utils
```

**On Windows:**
Download from [apachelounge.com](https://www.apachelounge.com/download/)

#### Run Load Test

**Create test payload file (request.json):**
```json
{
  "type": "EMAIL",
  "recipient": "loadtest@example.com",
  "subject": "Load Test",
  "message": "This is a load test notification",
  "priority": "MEDIUM"
}
```

**Run 1000 requests with 10 concurrent connections:**
```bash
ab -n 1000 -c 10 -p request.json -T application/json \
  http://localhost:5000/api/notifications
```

**Analyze Results:**
```
Requests per second:    150.23 [#/sec]
Time per request:       66.563 [ms]
Transfer rate:          45.67 [Kbytes/sec]
```

Target metrics:
- Requests/sec: > 100
- Failed requests: 0
- 99th percentile: < 200ms

### Monitor System Metrics

#### View Prometheus Metrics

```bash
curl http://localhost:5000/api/metrics
```

Key metrics to monitor:
- `notifications_created_total` - Total created
- `notifications_sent_total` - Total sent
- `notifications_failed_total` - Total failed
- `notification_processing_duration_seconds` - Processing time histogram
- `queue_depth` - Current queue depth

#### Calculate Throughput

```bash
# Create 100 notifications
# Note start time
start_time=$(date +%s)

# Run Postman collection 100 times

# Note end time
end_time=$(date +%s)

# Calculate duration
duration=$((end_time - start_time))

# Calculate throughput
echo "$((100 / duration)) notifications/second"
```

Target: > 50 notifications/second with single worker

### Optimize Performance

**Database Optimization:**
1. Ensure indexes are created
2. Use connection pooling (already configured)
3. Use lean queries (already implemented)

**Queue Optimization:**
1. Tune prefetch count (currently 10)
2. Scale workers horizontally
3. Use priority queues (already implemented)

**API Optimization:**
1. Enable response compression
2. Implement request caching
3. Use CDN for static assets (production)

---

## Production Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Monitoring setup (Prometheus + Grafana)
- [ ] Logging configured (ELK stack)
- [ ] Rate limits configured
- [ ] Security headers enabled
- [ ] CORS restricted to frontend domain

### Deployment Steps

1. **Build Backend:**
   ```bash
   cd backend
   npm run build
   ```

2. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy Infrastructure:**
   - MongoDB Atlas cluster
   - RabbitMQ Cloud or self-hosted cluster
   - Redis for caching (optional)

4. **Deploy Application:**
   - API servers (Kubernetes/ECS)
   - Worker processes (Kubernetes/ECS)
   - Frontend (CloudFront + S3 / Vercel)

5. **Configure DNS:**
   - api.wavecom.com → API load balancer
   - app.wavecom.com → Frontend CDN

6. **Enable SSL:**
   - Use Let's Encrypt or AWS Certificate Manager
   - Force HTTPS

7. **Configure Monitoring:**
   - Prometheus scraping
   - Grafana dashboards
   - AlertManager rules

### Post-Deployment

- [ ] Smoke tests passing
- [ ] Health checks responding
- [ ] Metrics being collected
- [ ] Logs being aggregated
- [ ] Alerts configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented

---

## Support & Resources

### Documentation
- **Main README**: [README.md](README.md)
- **Architecture Diagrams**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Reference**: See README.md API section

### Useful Commands

**View Docker logs:**
```bash
docker-compose logs -f [service-name]
```

**Restart services:**
```bash
docker-compose restart [service-name]
```

**Clean up Docker:**
```bash
docker-compose down -v
docker system prune -a
```

**Database backup:**
```bash
mongodump --uri="mongodb://localhost:27017/wavecom-notifications"
```

**Database restore:**
```bash
mongorestore --uri="mongodb://localhost:27017/wavecom-notifications" dump/
```

### Need Help?

1. Check this guide first
2. Review error logs in terminal
3. Check Docker logs: `docker-compose logs`
4. Verify all services are running: `docker-compose ps`
5. Create an issue in the repository

---

**Happy Testing! 🚀**
