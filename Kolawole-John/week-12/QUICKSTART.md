# WaveCom Notification System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Start Services (30 seconds)
```bash
cd week-12
docker-compose up -d
```

Wait for MongoDB and RabbitMQ to start (check with `docker-compose ps`)

### Step 2: Start Backend (1 minute)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on: http://localhost:5000

### Step 3: Start Frontend (1 minute)
```bash
# Open new terminal
cd week-12/frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on: http://localhost:5173

### Step 4: Start Worker (30 seconds)
```bash
# Open new terminal
cd week-12/backend
npm run worker:dev
```

### Step 5: Test the System (2 minutes)

**Option A: Via Browser**
1. Go to http://localhost:5173
2. Click "Create Notification"
3. Fill form and submit
4. Watch status change in dashboard

**Option B: Via cURL**
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EMAIL",
    "recipient": "test@example.com",
    "subject": "Test",
    "message": "Hello from WaveCom!",
    "priority": "HIGH"
  }'
```

**Option C: Via Postman**
1. Import `WaveCom-Notification-API.postman_collection.json`
2. Run "Create Email Notification"
3. Run "Get Notification by ID"

---

## 🎯 System URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend Dashboard | http://localhost:5173 | None |
| Backend API | http://localhost:5000 | None |
| RabbitMQ Management | http://localhost:15672 | admin/admin |
| MongoDB | mongodb://localhost:27017 | None |
| API Health Check | http://localhost:5000/health | None |

---

## 🔍 Verify Everything Works

### Check 1: Backend Health
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"healthy", ...}`

### Check 2: Create Notification
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"type":"EMAIL","recipient":"test@example.com","subject":"Test","message":"Hello","priority":"HIGH"}'
```
Should return: `201 Created` with notification ID

### Check 3: View Dashboard
Open http://localhost:5173 - should show stats cards and notifications table

### Check 4: Check Queue
1. Go to http://localhost:15672
2. Login: admin/admin
3. Click "Queues" tab
4. Should see: high_priority, notifications, retry, notifications_dlq

### Check 5: Check Database
```bash
# Using mongosh
mongosh mongodb://localhost:27017/wavecom-notifications
db.notifications.find().pretty()
```

---

## 📚 Documentation Quick Links

- **📖 Full Documentation**: [README.md](README.md) - Complete system overview + Design Defense
- **🏗️ Architecture Diagrams**: [ARCHITECTURE.md](ARCHITECTURE.md) - 10 Mermaid diagrams
- **⚙️ Setup & Testing**: [SETUP_AND_TESTING.md](SETUP_AND_TESTING.md) - Detailed guide
- **📋 Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Deliverables checklist
- **🧪 Postman Collection**: [WaveCom-Notification-API.postman_collection.json](WaveCom-Notification-API.postman_collection.json)

---

## 🆘 Quick Troubleshooting

### "Cannot connect to MongoDB"
```bash
docker-compose restart mongodb
# Wait 10 seconds
```

### "Cannot connect to RabbitMQ"
```bash
docker-compose restart rabbitmq
# Wait 30 seconds for RabbitMQ to fully start
```

### "Port already in use"
```bash
# Find and kill process using port 5000 or 5173
# On Windows:
netstat -ano | findstr :5000
# On Mac/Linux:
lsof -i :5000
```

### "Frontend shows no data"
Make sure:
1. Backend is running (http://localhost:5000/health returns 200)
2. Worker is running (check terminal)
3. Create some test notifications first

### "Worker not processing"
```bash
# Check RabbitMQ has messages
# Visit http://localhost:15672 > Queues
# Restart worker:
npm run worker:dev
```

---

## 🧪 Quick Test Scenarios

### Test 1: High Priority Email
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EMAIL",
    "recipient": "urgent@example.com",
    "subject": "Urgent: System Alert",
    "message": "Critical system notification",
    "priority": "CRITICAL"
  }'
```
Should be processed immediately via `high_priority` queue

### Test 2: SMS Notification
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SMS",
    "recipient": "+1234567890",
    "message": "Your OTP is 123456",
    "priority": "HIGH"
  }'
```

### Test 3: View All Notifications
```bash
curl http://localhost:5000/api/notifications
```

### Test 4: View System Stats
```bash
curl http://localhost:5000/api/notifications/stats/system
```

---

## 🚀 Next Steps

After successful setup:

1. **Explore the Dashboard**: Navigate through all pages
2. **Test API with Postman**: Import collection and run all requests
3. **Read Documentation**: Start with README.md
4. **Review Architecture**: Check ARCHITECTURE.md for diagrams
5. **Run Performance Tests**: See SETUP_AND_TESTING.md

---

## 📊 System Capabilities

- ✅ **50,000+ notifications/minute** capacity
- ✅ **3 notification types**: Email, SMS, Push
- ✅ **4 priority levels**: LOW, MEDIUM, HIGH, CRITICAL
- ✅ **Automatic retries**: Exponential backoff, max 3 attempts
- ✅ **Dead Letter Queue**: Failed messages captured
- ✅ **Real-time dashboard**: Auto-refresh every 5 seconds
- ✅ **Complete audit trail**: Full notification lifecycle
- ✅ **Horizontal scaling**: Add more workers anytime
- ✅ **Production-ready**: Metrics, logging, health checks

---

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start with hot reload
npm run worker:dev   # Start worker with hot reload
npm test             # Run tests
npm run build        # Build for production
npm start            # Start production server
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Docker
```bash
docker-compose up -d      # Start services
docker-compose down       # Stop services
docker-compose logs -f    # View logs
docker-compose ps         # Check status
```

---

## 💡 Pro Tips

1. **Keep 3 terminals open**: Backend, Frontend, Worker
2. **Watch the logs**: Useful for debugging
3. **Use Postman collection**: Faster than manual testing
4. **Check RabbitMQ UI**: Monitor queue depth
5. **Auto-refresh dashboard**: Updates every 5 seconds
6. **Test validation**: Try invalid inputs to see error handling
7. **Monitor metrics**: http://localhost:5000/api/metrics

---

## 📞 Need Help?

1. Check [SETUP_AND_TESTING.md](SETUP_AND_TESTING.md) - Comprehensive troubleshooting
2. Review error messages in terminal
3. Check Docker logs: `docker-compose logs -f`
4. Verify all services running: `docker-compose ps`
5. Test individual components: Backend health, RabbitMQ UI, MongoDB

---

**Happy Testing! 🎉**

For detailed documentation, see [README.md](README.md)
