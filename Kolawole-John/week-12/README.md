# WaveCom Notification Delivery System

## Project Overview

WaveCom is a scalable, fault-tolerant notification delivery system designed to handle critical transactional notifications (Email, SMS, and Push) for enterprise clients including banks, fintechs, and logistics companies. The system is architected to process up to **50,000 notifications per minute** while maintaining reliability, observability, and graceful degradation under load.

### Problem Statement

Enterprise clients require a robust notification infrastructure that can:
- Handle high-volume spikes (50,000+ notifications/minute)
- Deliver notifications across multiple channels (Email, SMS, Push)
- Provide retry logic for failed deliveries
- Maintain audit trails and delivery status tracking
- Scale horizontally as demand grows
- Gracefully degrade under extreme load
- Provide real-time monitoring and observability

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          React Dashboard (Vite + TypeScript)                  │  │
│  │  - Create Notifications    - View Status    - Monitor Stats   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Express.js API Server (Node.js + TypeScript)          │  │
│  │  - Rate Limiting (100 req/min)  - Request Validation          │  │
│  │  - Authentication              - Error Handling                │  │
│  │  - Prometheus Metrics          - Health Checks                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│     DATABASE LAYER            │    │      MESSAGE QUEUE LAYER      │
│  ┌────────────────────────┐  │    │  ┌────────────────────────┐  │
│  │     MongoDB Atlas       │  │    │  │      RabbitMQ          │  │
│  │  - Notifications        │  │    │  │  - High Priority Queue │  │
│  │  - Notification Logs    │  │    │  │  - Standard Queue      │  │
│  │  - Indexed Queries      │  │    │  │  - Retry Queue         │  │
│  │  - Audit Trail          │  │    │  │  - Dead Letter Queue   │  │
│  └────────────────────────┘  │    │  └────────────────────────┘  │
└──────────────────────────────┘    └──────────────────────────────┘
                                                  │
                                                  │ Message Consumption
                                                  ▼
                    ┌─────────────────────────────────────────┐
                    │         WORKER POOL LAYER                │
                    │  ┌───────────────────────────────────┐  │
                    │  │   Notification Workers (Scaled)    │  │
                    │  │  - Consumes from Queues            │  │
                    │  │  - Processes Notifications         │  │
                    │  │  - Handles Retries                 │  │
                    │  │  - Routes to DLQ on Failure        │  │
                    │  └───────────────────────────────────┘  │
                    └─────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
        │ Email Provider │  │  SMS Provider  │  │ Push Provider  │
        │  (Mock/Real)   │  │  (Mock/Real)   │  │  (Mock/Real)   │
        │ - Circuit      │  │ - Circuit      │  │ - Circuit      │
        │   Breaker      │  │   Breaker      │  │   Breaker      │
        └───────────────┘  └───────────────┘  └───────────────┘
```

### Data Flow Diagram

```
[Client]
   │
   │ 1. POST /api/notifications
   ▼
[API Server]
   │
   │ 2. Validate Request (Joi Schema)
   │ 3. Create Notification Document in MongoDB
   ▼
[MongoDB: notifications collection]
   │
   │ 4. Queue Message to RabbitMQ
   ▼
[RabbitMQ: Priority-based Routing]
   │
   ├─► [high_priority queue] (CRITICAL/HIGH priority)
   └─► [notifications queue] (MEDIUM/LOW priority)
   │
   │ 5. Workers consume messages
   ▼
[Notification Worker Pool]
   │
   │ 6. Update status: PROCESSING
   │ 7. Invoke Provider (Email/SMS/Push)
   ▼
[Provider Services with Circuit Breaker]
   │
   ├─► SUCCESS ──────────────────────────────┐
   │                                          │
   └─► FAILURE                                │
         │                                    │
         │ 8a. Check retry count              │
         ▼                                    │
    [Retry Logic]                             │
         │                                    │
         ├─► Retry < Max? ──► [retry queue]  │
         │                          │         │
         └─► Retry >= Max? ──► [DLQ]         │
                                              │
                                              ▼
                                   9. Update MongoDB
                                      - status: SENT
                                      - sentAt: timestamp
                                      - processingTimeMs
                                              │
                                              ▼
                                   10. Create Audit Log
                                      [notificationlogs collection]
                                              │
                                              ▼
                                   11. Client Polls/Receives Update
```

---

## System Components

### 1. Frontend (React + Vite)

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- TanStack React Query for server state
- Zustand for client state management
- Tailwind CSS for styling
- React Hook Form + Zod for validation

**Key Features:**
- **Dashboard**: Real-time stats, recent notifications, auto-refresh every 5 seconds
- **Create Notification**: Form with validation for all notification types
- **Status View**: Detailed notification status with timeline and audit trail
- **Responsive Design**: Mobile-first approach with Tailwind CSS

**Pages:**
- `/` - Dashboard with system overview
- `/create` - Notification creation form
- `/status/:id` - Detailed status view

### 2. Backend API (Node.js + Express)

**Technology Stack:**
- Node.js with TypeScript
- Express.js for REST API
- Mongoose for MongoDB ODM
- AMQPLIB for RabbitMQ integration
- Winston for logging
- Joi for request validation
- Helmet for security headers
- Prometheus for metrics

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications` | Create a new notification |
| GET | `/api/notifications/:id` | Get notification status and details |
| GET | `/api/notifications` | List all notifications (paginated) |
| GET | `/api/notifications/stats/system` | Get system statistics |
| GET | `/api/metrics` | Prometheus metrics endpoint |
| GET | `/api/health` | Health check endpoint |

**Middleware Stack:**
1. Helmet (Security headers)
2. CORS (Cross-origin resource sharing)
3. Rate Limiter (100 requests/minute)
4. JSON Body Parser
5. Request Validation (Joi schemas)
6. Error Handler (Global error handling)

### 3. Database Layer (MongoDB)

**Collections:**

**notifications**
```javascript
{
  _id: ObjectId,
  type: Enum['EMAIL', 'SMS', 'PUSH'],
  recipient: String,           // Email, phone, or device token
  subject: String,             // Optional: for emails
  message: String,
  status: Enum['PENDING', 'QUEUED', 'PROCESSING', 'SENT', 'FAILED', 'RETRYING'],
  priority: Enum['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  retryCount: Number,
  maxRetries: Number,          // Default: 3
  metadata: Object,            // Additional context
  scheduledAt: Date,           // Optional: future delivery
  sentAt: Date,
  failedAt: Date,
  error: String,
  providerMessageId: String,
  processingTimeMs: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**notificationlogs**
```javascript
{
  _id: ObjectId,
  notificationId: ObjectId,
  status: String,
  message: String,
  timestamp: Date,
  metadata: Object
}
```

**Indexes:**
```javascript
// Compound indexes for performance
{ type: 1, status: 1, createdAt: -1 }
{ status: 1, priority: -1, createdAt: -1 }
{ recipient: 1, createdAt: -1 }
{ createdAt: -1 }  // For pagination and sorting
```

### 4. Message Queue (RabbitMQ)

**Queue Architecture:**

1. **high_priority** - For CRITICAL and HIGH priority notifications
2. **notifications** - For MEDIUM and LOW priority notifications
3. **retry** - For failed notifications awaiting retry
4. **notifications_dlq** - Dead Letter Queue for permanently failed notifications

**Queue Configuration:**
- Durable: true (survive broker restarts)
- Persistent Messages: true (survive queue restarts)
- Prefetch Count: 10 (per worker)
- TTL on retry queue: Exponential backoff (5s, 25s, 125s)

**Message Format:**
```javascript
{
  notificationId: string,
  type: NotificationType,
  recipient: string,
  subject?: string,
  message: string,
  priority: Priority,
  retryCount: number,
  metadata?: object
}
```

### 5. Worker Pool

**Notification Worker Process:**
- Runs as separate Node.js processes
- Consumes from multiple queues concurrently
- Implements exponential backoff for retries
- Handles graceful shutdown (SIGTERM, SIGINT)
- Updates notification status in real-time
- Routes failures to retry queue or DLQ

**Worker Scaling:**
- Horizontally scalable (deploy multiple instances)
- Each worker handles 10 concurrent messages (prefetch)
- No shared state between workers
- Fault-tolerant (message requeued on worker crash)

### 6. Provider Services

**Email Provider**
- Mock implementation with configurable failure rate
- Circuit breaker pattern (10 failures = open circuit)
- Simulates SMTP integration
- Returns provider message ID

**SMS Provider**
- Mock implementation with configurable failure rate
- Circuit breaker pattern
- Simulates Twilio/AWS SNS integration
- Phone number validation

**Push Provider**
- Mock implementation with configurable failure rate
- Circuit breaker pattern
- Simulates FCM/APNs integration
- Device token validation

**Circuit Breaker Pattern:**
- **Closed**: Normal operation
- **Open**: Too many failures, reject requests immediately
- **Half-Open**: Test if service recovered after timeout

---

## Database Schema

### Notification Document

```typescript
interface INotification {
  type: 'EMAIL' | 'SMS' | 'PUSH';
  recipient: string;
  subject?: string;
  message: string;
  status: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'SENT' | 'FAILED' | 'RETRYING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  retryCount: number;
  maxRetries: number;
  metadata?: Record<string, any>;
  scheduledAt?: Date;
  sentAt?: Date;
  failedAt?: Date;
  error?: string;
  providerMessageId?: string;
  processingTimeMs?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification Log Document

```typescript
interface INotificationLog {
  notificationId: mongoose.Types.ObjectId;
  status: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

---

## Scaling Strategy

### Horizontal Scaling

**API Server Scaling:**
```
[Load Balancer]
       │
   ┌───┴───┬───────┬───────┐
   ▼       ▼       ▼       ▼
[API-1] [API-2] [API-3] [API-N]
```

- Stateless API servers (scale infinitely)
- Session data in MongoDB (not in-memory)
- Load balancer distributes requests (Round Robin/Least Connections)
- Auto-scaling based on CPU/Memory metrics (Kubernetes HPA)

**Worker Scaling:**
```
[RabbitMQ Queues]
       │
   ┌───┴───┬───────┬───────┐
   ▼       ▼       ▼       ▼
[Worker-1] [Worker-2] [Worker-3] [Worker-N]
```

- Deploy multiple worker instances
- Each worker consumes from all queues
- RabbitMQ distributes messages fairly
- Scale workers based on queue depth

**Database Scaling:**
- MongoDB Replica Set (3+ nodes)
- Read replicas for GET requests
- Sharding by notification type or date range
- Indexes on frequently queried fields

### Vertical Scaling

- Increase CPU/RAM for API servers
- Increase MongoDB server resources
- Increase RabbitMQ broker resources
- SSD storage for faster I/O

### Caching Strategy

```
[Redis Cache Layer]
       │
       ├─► System stats (TTL: 5s)
       ├─► Frequently accessed notifications (TTL: 60s)
       └─► Rate limiting counters
```

### Performance Optimizations

1. **Database:**
   - Compound indexes for common queries
   - Projection (return only needed fields)
   - Lean queries (skip Mongoose overhead)
   - Connection pooling (100 connections)

2. **Queue:**
   - Priority-based routing
   - Prefetch count tuning (10 messages/worker)
   - Message batching (future enhancement)

3. **API:**
   - Response compression (gzip)
   - Request deduplication
   - Pagination on list endpoints
   - ETags for conditional requests

4. **Worker:**
   - Concurrent processing (Promise.all for batches)
   - Connection reuse for providers
   - Bulk database updates

---

## Fault Tolerance Strategy

### Retry Mechanism

**Exponential Backoff:**
```
Attempt 1: Immediate processing
Attempt 2: Wait 5 seconds (5^1)
Attempt 3: Wait 25 seconds (5^2)
Attempt 4: Wait 125 seconds (5^3)
Max Attempts: 3
```

**Retry Flow:**
1. Worker attempts to send notification
2. Provider fails (timeout, network error, 5xx response)
3. Worker increments retry count
4. If retry count < max retries:
   - Calculate backoff delay
   - Publish to retry queue with delay
5. If retry count >= max retries:
   - Mark as FAILED
   - Move to Dead Letter Queue

### Dead Letter Queue (DLQ)

- Stores permanently failed notifications
- Manual review and reprocessing
- Alerts/monitoring for DLQ depth
- Prevents infinite retry loops

### Circuit Breaker

**Provider Circuit Breaker:**
- Tracks success/failure rate
- Opens circuit after 10 consecutive failures
- Half-open state after 30 seconds
- Prevents cascading failures

### Database Resilience

- MongoDB Replica Set (automatic failover)
- Write concern: majority (data safety)
- Read preference: primaryPreferred
- Connection retry logic (5 attempts)

### Queue Resilience

- RabbitMQ cluster (3+ nodes)
- Mirrored queues across nodes
- Publisher confirms
- Consumer acknowledgments (manual)
- Message persistence (survive broker restart)

### Graceful Degradation

**Under High Load:**
1. Rate limiting kicks in (reject excess requests)
2. Queue depth increases (workers process backlog)
3. Priority queue ensures critical messages processed first
4. Non-critical messages delayed but not lost

**Provider Outage:**
1. Circuit breaker opens
2. Messages go to retry queue
3. Workers continue processing other types
4. System remains partially operational

### Monitoring & Alerts

**Metrics Tracked:**
- Notifications created/second
- Notifications sent/second
- Queue depth (all queues)
- Worker processing time (p50, p95, p99)
- Provider success/failure rate
- Database query performance
- API response time

**Alerting Thresholds:**
- Queue depth > 10,000 messages
- DLQ depth > 100 messages
- Provider failure rate > 20%
- API error rate > 5%
- Database connection pool exhausted

---

## Queueing Model & Retry Flow

### Message Lifecycle

```
1. CREATION
   Client → POST /api/notifications
   │
   ▼
2. PERSISTENCE
   MongoDB: status = PENDING
   │
   ▼
3. QUEUEING
   RabbitMQ: status = QUEUED
   ├─► high_priority (CRITICAL, HIGH)
   └─► notifications (MEDIUM, LOW)
   │
   ▼
4. PROCESSING
   Worker consumes message
   MongoDB: status = PROCESSING
   │
   ├─► SUCCESS ──────────────────┐
   │                              │
   └─► FAILURE                    │
         │                        │
         ▼                        ▼
   5a. RETRY LOGIC          5b. SUCCESS PATH
       │                        │
       ├─► Retry < Max?         ├─► Update MongoDB
       │   │                    │   status = SENT
       │   ├─► YES              │   sentAt = now
       │   │   │                │   processingTimeMs
       │   │   ▼                │
       │   │   retry queue      │
       │   │   (with delay)     │
       │   │                    │
       │   └─► NO               │
       │       │                │
       │       ▼                │
       │       DLQ              │
       │       status = FAILED  │
       │                        │
       └────────────────────────┘
                │
                ▼
   6. AUDIT LOG
      Create notification log entry
                │
                ▼
   7. CLIENT NOTIFICATION
      Poll or WebSocket update
```

### Queue Priority Routing

**High Priority Queue** (Processed First)
- CRITICAL priority notifications
- HIGH priority notifications
- SLA: < 5 seconds processing time

**Standard Queue** (Processed Second)
- MEDIUM priority notifications
- LOW priority notifications
- SLA: < 30 seconds processing time

### Retry Queue Design

**Delay-Based Retry:**
- Message published with `x-delay` header
- RabbitMQ delayed message plugin
- Exponential backoff calculation: `delay = baseDelay * (retryCount ^ 2)`
- Base delay: 5 seconds
- Max delay: 125 seconds

### Consumer Acknowledgment

**Manual Acknowledgment:**
- Worker processes message
- On success: ACK (remove from queue)
- On failure: NACK with requeue=false (send to retry/DLQ)
- On worker crash: Message requeued automatically

---

## API Documentation

### Create Notification

**Endpoint:** `POST /api/notifications`

**Request Body:**
```json
{
  "type": "EMAIL",
  "recipient": "user@example.com",
  "subject": "Welcome to WaveCom",
  "message": "Thank you for signing up!",
  "priority": "HIGH",
  "metadata": {
    "userId": "12345",
    "campaign": "onboarding"
  }
}
```

**Validation Rules:**
- `type`: Required, one of ["EMAIL", "SMS", "PUSH"]
- `recipient`: Required, valid email/phone/token based on type
- `subject`: Optional, required for EMAIL
- `message`: Required, min 1 char, max 5000 chars
- `priority`: Optional, one of ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default "MEDIUM"
- `metadata`: Optional object

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "EMAIL",
    "recipient": "user@example.com",
    "subject": "Welcome to WaveCom",
    "message": "Thank you for signing up!",
    "status": "QUEUED",
    "priority": "HIGH",
    "retryCount": 0,
    "maxRetries": 3,
    "metadata": {
      "userId": "12345",
      "campaign": "onboarding"
    },
    "createdAt": "2024-12-11T10:30:00.000Z",
    "updatedAt": "2024-12-11T10:30:00.000Z"
  },
  "message": "Notification created and queued successfully"
}
```

### Get Notification Status

**Endpoint:** `GET /api/notifications/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "_id": "507f1f77bcf86cd799439011",
      "type": "EMAIL",
      "recipient": "user@example.com",
      "subject": "Welcome to WaveCom",
      "message": "Thank you for signing up!",
      "status": "SENT",
      "priority": "HIGH",
      "retryCount": 0,
      "maxRetries": 3,
      "sentAt": "2024-12-11T10:30:05.234Z",
      "processingTimeMs": 234,
      "providerMessageId": "msg_abc123xyz",
      "createdAt": "2024-12-11T10:30:00.000Z",
      "updatedAt": "2024-12-11T10:30:05.234Z"
    },
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "notificationId": "507f1f77bcf86cd799439011",
        "status": "PENDING",
        "message": "Notification created",
        "timestamp": "2024-12-11T10:30:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "notificationId": "507f1f77bcf86cd799439011",
        "status": "QUEUED",
        "message": "Added to queue",
        "timestamp": "2024-12-11T10:30:00.100Z"
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "notificationId": "507f1f77bcf86cd799439011",
        "status": "PROCESSING",
        "message": "Worker started processing",
        "timestamp": "2024-12-11T10:30:05.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439015",
        "notificationId": "507f1f77bcf86cd799439011",
        "status": "SENT",
        "message": "Successfully sent via email provider",
        "timestamp": "2024-12-11T10:30:05.234Z"
      }
    ]
  }
}
```

### List All Notifications

**Endpoint:** `GET /api/notifications`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status
- `type`: Filter by notification type
- `priority`: Filter by priority

**Example:** `GET /api/notifications?page=1&limit=10&status=SENT&type=EMAIL`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "type": "EMAIL",
        "recipient": "user@example.com",
        "status": "SENT",
        "priority": "HIGH",
        "createdAt": "2024-12-11T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10
    }
  }
}
```

### Get System Statistics

**Endpoint:** `GET /api/notifications/stats/system`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 50000,
    "byStatus": {
      "PENDING": 100,
      "QUEUED": 500,
      "PROCESSING": 50,
      "SENT": 48000,
      "FAILED": 1200,
      "RETRYING": 150
    },
    "byType": {
      "EMAIL": 30000,
      "SMS": 15000,
      "PUSH": 5000
    },
    "byPriority": {
      "LOW": 20000,
      "MEDIUM": 20000,
      "HIGH": 8000,
      "CRITICAL": 2000
    },
    "queueDepth": {
      "notifications": 450,
      "high_priority": 50,
      "retry": 150
    },
    "averageProcessingTime": 187,
    "successRate": 96.0
  }
}
```

### Health Check

**Endpoint:** `GET /api/health`

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-11T10:30:00.000Z",
  "services": {
    "mongodb": "connected",
    "rabbitmq": "connected"
  },
  "uptime": 86400
}
```

### Prometheus Metrics

**Endpoint:** `GET /api/metrics`

**Response (200 OK):**
```
# HELP notifications_created_total Total number of notifications created
# TYPE notifications_created_total counter
notifications_created_total{type="EMAIL"} 30000
notifications_created_total{type="SMS"} 15000
notifications_created_total{type="PUSH"} 5000

# HELP notifications_sent_total Total number of notifications sent
# TYPE notifications_sent_total counter
notifications_sent_total{type="EMAIL"} 28800
notifications_sent_total{type="SMS"} 14400
notifications_sent_total{type="PUSH"} 4800

# HELP notification_processing_duration_seconds Time to process notification
# TYPE notification_processing_duration_seconds histogram
notification_processing_duration_seconds_bucket{le="0.1"} 25000
notification_processing_duration_seconds_bucket{le="0.5"} 45000
notification_processing_duration_seconds_bucket{le="1"} 48000
```

---

## Design Defense

### Why This Architecture?

**1. Separation of Concerns**
- **Frontend, Backend, Workers** are independently deployable
- Changes to UI don't affect message processing
- Workers can be scaled without touching API servers
- Each component has a single, well-defined responsibility

**2. Asynchronous Processing**
- API responds immediately (< 50ms)
- Heavy lifting (provider calls) happens in background
- User doesn't wait for email/SMS delivery
- System can handle bursts without blocking

**3. Message Queue as Central Nervous System**
- **Decouples** producers (API) from consumers (workers)
- **Buffers** load spikes (queue absorbs excess)
- **Prioritizes** critical messages
- **Durability** - messages survive crashes
- **Scalability** - add more workers without code changes

**4. Database as Single Source of Truth**
- All notification state persisted
- Queryable history and audit trail
- Supports compliance requirements
- Enables analytics and reporting

**5. Observability First**
- Prometheus metrics for monitoring
- Winston logging for debugging
- Health checks for uptime monitoring
- Enables proactive incident response

### How Will It Handle 50,000 Notifications/Minute?

**Math:**
- 50,000 notifications/minute = **833 notifications/second**
- Assuming 200ms per notification (including provider call)
- 1 worker can handle: 1000ms / 200ms = **5 notifications/second**
- Required workers: 833 / 5 = **167 workers minimum**

**Our Strategy:**

**1. Horizontal Worker Scaling**
```
[RabbitMQ] → [200 Worker Instances]
```
- Deploy 200 worker instances (33 spare capacity)
- Each worker: 10 prefetch × 5 msg/sec = 50 msg/sec capacity
- Total capacity: 200 × 50 = **10,000 msg/sec = 600,000/min**
- **12x over-provisioned** for safety margin

**2. Priority Queue Segregation**
- Critical messages bypass standard queue
- Dedicated workers for high-priority queue
- Prevents low-priority flood blocking critical messages

**3. Database Optimization**
- Compound indexes reduce query time to < 5ms
- Connection pool (100 connections) handles concurrent writes
- Bulk update operations (batch 100 notifications)
- Write concern: w=1 (faster writes, acceptable for this use case)

**4. Provider Optimization**
- Connection pooling to provider APIs
- HTTP keep-alive for persistent connections
- Batch API calls where provider supports (100 emails/call)
- Provider-side rate limiting handled with circuit breaker

**5. Auto-Scaling Configuration (Kubernetes)**
```yaml
autoscaling:
  minReplicas: 50
  maxReplicas: 300
  metrics:
    - type: Resource
      resource:
        name: cpu
        targetAverageUtilization: 70
    - type: External
      external:
        metricName: rabbitmq_queue_depth
        targetValue: 1000
```
- Scale workers based on queue depth
- Scale API servers based on CPU/request rate

**Capacity Planning:**
| Component | Current | Max Capacity | Bottleneck Mitigation |
|-----------|---------|--------------|----------------------|
| API Servers | 5 instances | 50 req/sec each = 250 req/sec | Add more instances, enable caching |
| Workers | 200 instances | 10,000 msg/sec | Add more instances (linear scaling) |
| MongoDB | 1 replica set | 10,000 writes/sec | Sharding, read replicas |
| RabbitMQ | 1 cluster | 50,000 msg/sec | Cluster scaling, partitioned queues |

### How Does the System Degrade Gracefully Under Load?

**Degradation Levels:**

**Level 1: Normal Operation (0-50,000/min)**
- All messages processed within SLA
- < 5s for critical, < 30s for standard
- No queuing delay

**Level 2: Elevated Load (50,000-100,000/min)**
- Queue depth increases
- Priority queue still meets SLA
- Standard messages delayed by 1-2 minutes
- Rate limiter protects API servers
- Metrics alert operations team

**Level 3: High Load (100,000-200,000/min)**
- Standard queue backlog grows
- Priority queue still operational
- Standard messages delayed by 5-10 minutes
- Auto-scaling kicks in (adds workers)
- Non-essential API endpoints return 503

**Level 4: Extreme Load (200,000+/min)**
- API rate limiting aggressively rejects requests (429 status)
- Only critical notifications accepted
- Standard/low priority rejected with "retry later" message
- Workers focus on priority queue only
- DLQ monitoring disabled to save resources
- System remains operational for critical path

**Graceful Degradation Mechanisms:**

1. **Rate Limiting**
   - Protects API from overload
   - Returns 429 with Retry-After header
   - Client can implement exponential backoff

2. **Priority Queueing**
   - Critical messages always processed
   - Ensures SLA for important clients

3. **Circuit Breaker**
   - Detects provider outages early
   - Fails fast instead of timing out
   - Reduces resource consumption

4. **Queue Depth Monitoring**
   - Triggers auto-scaling before capacity reached
   - Alerts allow manual intervention

5. **Database Connection Pooling**
   - Prevents database connection exhaustion
   - Queues database requests when pool full

6. **Worker Graceful Shutdown**
   - Finishes in-flight messages
   - Doesn't accept new messages during shutdown
   - No message loss during deployments

### What Are Potential Bottlenecks and Mitigations?

**Bottleneck 1: Database Write Throughput**

*Problem:* MongoDB can handle ~10,000 writes/sec on a single instance, but we need 833 writes/sec for notifications + logs = ~1,666 writes/sec.

*Current Headroom:* 10,000 / 1,666 = **6x capacity**

*Mitigations:*
- **Replica Set:** Distribute reads across replicas
- **Sharding:** Partition by notification type or date range
- **Batch Writes:** Write 100 logs in single operation
- **Async Logging:** Queue log writes (eventual consistency OK)
- **Caching:** Cache frequent queries (stats) in Redis

**Bottleneck 2: RabbitMQ Queue Depth**

*Problem:* If workers can't keep up, queue fills memory, broker crashes.

*Mitigations:*
- **Queue Length Limit:** Max 100,000 messages/queue
- **Overflow Behavior:** Reject-publish or drop-head
- **Auto-Scaling:** Add workers when depth > 10,000
- **Disk Storage:** Persist messages to disk (lazy queue)
- **Monitoring:** Alert on high queue depth

**Bottleneck 3: Provider API Rate Limits**

*Problem:* Email provider limits to 100 req/sec, we need 300 req/sec.

*Mitigations:*
- **Multiple Providers:** Route across 3 providers = 300 req/sec
- **Batch API:** Send 100 emails per request = 10,000 emails/sec
- **Provider Queue:** Respect rate limits with local queue
- **Circuit Breaker:** Detect limits, back off automatically

**Bottleneck 4: Network Bandwidth**

*Problem:* 833 notifications/sec × 5KB avg message = 4.2 MB/sec = 33 Mbps.

*Current Capacity:* 1 Gbps network = **30x headroom**

*Mitigations:*
- **Compression:** Gzip messages (75% reduction)
- **CDN:** Serve frontend assets from edge
- **Message Optimization:** Remove unnecessary fields

**Bottleneck 5: Worker Memory**

*Problem:* Each worker uses ~100MB RAM. 200 workers = 20GB RAM.

*Mitigations:*
- **Prefetch Tuning:** Lower prefetch if memory constrained
- **Garbage Collection:** Tune Node.js GC for throughput
- **Memory Limits:** Set container limits, restart on leak
- **Lightweight Workers:** Use worker threads instead of processes

**Bottleneck 6: API Server CPU**

*Problem:* Request validation, JSON parsing, database queries consume CPU.

*Mitigations:*
- **Horizontal Scaling:** Add more API server instances
- **Load Balancer:** Distribute requests evenly
- **Caching:** Cache validation schemas, config
- **Async I/O:** Use Node.js async patterns (already implemented)

**Summary Table:**

| Bottleneck | Current Capacity | Required | Headroom | Risk Level | Mitigation Priority |
|------------|------------------|----------|----------|------------|---------------------|
| Database Writes | 10,000/sec | 1,666/sec | 6x | Low | Medium |
| Queue Depth | 100,000 msgs | Variable | N/A | Medium | High |
| Provider Rate Limit | 300/sec | 833/sec | 0.36x | **High** | **Critical** |
| Network Bandwidth | 1 Gbps | 33 Mbps | 30x | Low | Low |
| Worker Memory | 50 GB | 20 GB | 2.5x | Low | Low |
| API CPU | Scalable | Scalable | N/A | Low | Medium |

**Critical Action Items:**
1. Implement multi-provider strategy (3+ email providers)
2. Implement batch sending (100 emails/call)
3. Add queue depth auto-scaling
4. Setup provider circuit breakers

---

## Technology Stack Summary

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript 5.x
- **Database:** MongoDB 7.0 (Mongoose ODM)
- **Message Queue:** RabbitMQ 3.12 (AMQPLIB)
- **Logging:** Winston
- **Validation:** Joi
- **Metrics:** Prometheus (prom-client)
- **Security:** Helmet, CORS, express-rate-limit
- **Testing:** Jest

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript 5.x
- **Routing:** React Router v6
- **State Management:** Zustand + TanStack React Query
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Orchestration:** Kubernetes (recommended for production)
- **CI/CD:** GitHub Actions (recommended)
- **Monitoring:** Prometheus + Grafana (recommended)
- **Logging:** ELK Stack (recommended)

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd week-12
```

2. **Start infrastructure services**
```bash
docker-compose up -d
```

This starts:
- MongoDB on `localhost:27017`
- RabbitMQ on `localhost:5672` (Management UI: `localhost:15672`)

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

4. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

5. **Start Worker**
```bash
cd backend
npm run worker:dev
```

### Verify Installation

1. **Check Health:**
```bash
curl http://localhost:5000/api/health
```

2. **Create Test Notification:**
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EMAIL",
    "recipient": "test@example.com",
    "subject": "Test",
    "message": "Hello World",
    "priority": "HIGH"
  }'
```

3. **View Dashboard:**
Open `http://localhost:5173` in browser

### Running Tests

```bash
cd backend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## Monitoring & Observability

### Prometheus Metrics

Access metrics at: `http://localhost:5000/api/metrics`

**Key Metrics:**
- `notifications_created_total` - Counter by type
- `notifications_sent_total` - Counter by type
- `notifications_failed_total` - Counter by type
- `notification_processing_duration_seconds` - Histogram
- `queue_depth` - Gauge by queue name
- `http_requests_total` - Counter by method, route, status
- `http_request_duration_seconds` - Histogram

### Recommended Grafana Dashboards

1. **Notification Throughput**
   - Rate of notifications created/sent/failed
   - Success rate percentage
   - Throughput by notification type

2. **Queue Health**
   - Queue depth over time
   - Message processing rate
   - DLQ depth

3. **API Performance**
   - Request rate
   - Response time (p50, p95, p99)
   - Error rate

4. **System Resources**
   - Worker CPU/memory usage
   - Database connections
   - RabbitMQ connections

### Log Aggregation

**Log Format:**
```json
{
  "timestamp": "2024-12-11T10:30:00.000Z",
  "level": "info",
  "message": "Notification sent successfully",
  "notificationId": "507f1f77bcf86cd799439011",
  "type": "EMAIL",
  "recipient": "user@example.com",
  "processingTimeMs": 234
}
```

**Log Levels:**
- `error` - Failures, exceptions
- `warn` - Retries, degraded performance
- `info` - Normal operations
- `debug` - Detailed debugging (disabled in production)

---

## Security Considerations

1. **Input Validation:** Joi schemas prevent malicious input
2. **Rate Limiting:** Prevents abuse and DoS attacks
3. **Helmet.js:** Sets security headers (CSP, HSTS, X-Frame-Options)
4. **CORS:** Restricts cross-origin requests
5. **Secrets Management:** Environment variables, never commit .env
6. **Database Security:** MongoDB authentication enabled in production
7. **Queue Security:** RabbitMQ authentication, TLS in production
8. **API Authentication:** JWT/OAuth recommended for production (not implemented in demo)

---

## Future Enhancements

1. **Authentication & Authorization**
   - JWT token-based auth
   - Role-based access control (RBAC)
   - API key management for clients

2. **Scheduled Notifications**
   - Cron-based scheduling
   - Timezone support
   - Recurring notifications

3. **Templating Engine**
   - Email/SMS templates with variables
   - Template versioning
   - A/B testing support

4. **Analytics Dashboard**
   - Delivery reports
   - Open/click tracking (email)
   - Provider performance comparison

5. **Multi-Tenancy**
   - Isolated data per client
   - Per-tenant rate limits
   - Billing integration

6. **Webhook Support**
   - Real-time delivery callbacks
   - Event streaming
   - Webhook signature verification

7. **Message Batching**
   - Group similar messages
   - Reduce provider API calls
   - Lower costs

8. **AI-Powered Optimization**
   - Best time to send (ML model)
   - Content optimization
   - Failure prediction

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is part of the Software Engineering Fundamentals program and is for educational purposes.

---

## Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Refer to the setup documentation in `backend/README.md` and `frontend/FRONTEND_SETUP.md`

---

## Acknowledgments

- WaveCom team for requirements and feedback
- Software Engineering Fundamentals Cohort 1
- Open source community for excellent libraries and tools

---

**Built with ❤️ for scalable, reliable notification delivery**
