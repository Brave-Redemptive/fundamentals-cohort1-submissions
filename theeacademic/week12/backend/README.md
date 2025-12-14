# WaveCom Notification Delivery System

A scalable, fault-tolerant notification delivery system designed to handle enterprise-grade transactional notifications (email, SMS, push) for banks, fintechs, and logistics companies.

## Problem Overview

WaveCom needs to deliver critical transactional notifications at scale, handling spikes of up to 50,000 notifications per minute while maintaining reliability and fault tolerance. The system must support multiple notification channels and provide visibility into delivery status.

## Architecture Diagram

```
                                    +------------------+
                                    |   React-Vite     |
                                    |   Dashboard      |
                                    +--------+---------+
                                             |
                                             | HTTP/REST
                                             v
+------------------+              +----------+---------+
|   Load Balancer  |------------->|   Express API      |
|   (Future)       |              |   Server           |
+------------------+              +----------+---------+
                                             |
                    +------------------------+------------------------+
                    |                        |                        |
                    v                        v                        v
          +---------+--------+    +----------+---------+    +---------+--------+
          |   MongoDB        |    |   RabbitMQ         |    |   Mock Providers |
          |   (Jobs + Logs)  |    |   Message Broker   |    |   Email/SMS/Push |
          +------------------+    +----------+---------+    +------------------+
                                             |
                              +--------------+--------------+
                              |              |              |
                              v              v              v
                    +---------+--+  +--------+---+  +-------+----+
                    | Main Queue |  | Retry Queue|  | Dead Letter|
                    | (notify)   |  | (30s TTL)  |  | Queue (DLQ)|
                    +------------+  +------------+  +------------+
```

## Components and Responsibilities

### API Server (Express.js)
- Receives notification requests via REST endpoints
- Validates payloads and creates job records
- Publishes jobs to RabbitMQ
- Serves job status and statistics

### Message Broker (RabbitMQ)
- **Main Queue**: Receives new notification jobs for processing
- **Retry Queue**: Holds failed jobs with 30-second TTL before retry
- **Dead Letter Queue**: Stores permanently failed jobs after max retries

### Database (MongoDB)
- **NotificationJob**: Stores job metadata, status, retry count
- **NotificationLog**: Audit trail of all status changes

### Queue Consumer
- Processes jobs from the main queue
- Dispatches to appropriate provider (email/SMS/push)
- Handles success/failure with retry logic

### Mock Providers
- Simulate real notification providers
- Configurable failure rate (10%) for testing resilience
- Simulated latency (100-500ms)

## Database Schema

### NotificationJob Collection
```javascript
{
  _id: ObjectId,
  type: "email" | "sms" | "push",
  recipient: String,
  subject: String,           // email only
  message: String,
  status: "pending" | "queued" | "processing" | "sent" | "failed",
  retryCount: Number,        // default: 0
  maxRetries: Number,        // default: 3
  sentAt: Date,
  error: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: { status: 1, createdAt: -1 }, { recipient: 1 }
```

### NotificationLog Collection
```javascript
{
  _id: ObjectId,
  jobId: String,             // indexed
  status: String,
  message: String,
  timestamp: Date
}
```

## API Design

### Create Notification
```
POST /api/notifications
Content-Type: application/json

{
  "type": "email" | "sms" | "push",
  "recipient": "user@example.com",
  "subject": "Optional subject",
  "message": "Notification content",
  "metadata": {}
}

Response: 201 Created
{
  "jobId": "...",
  "status": "pending",
  "message": "Notification job created and queued"
}
```

### Get Job Status
```
GET /api/notifications/:id

Response: 200 OK
{
  "jobId": "...",
  "type": "email",
  "recipient": "...",
  "status": "sent",
  "retryCount": 0,
  "createdAt": "...",
  "sentAt": "...",
  "logs": [...]
}
```

### List All Jobs
```
GET /api/notifications?status=sent&type=email&page=1&limit=20

Response: 200 OK
{
  "jobs": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get Statistics
```
GET /api/notifications/stats/summary

Response: 200 OK
{
  "pending": 10,
  "queued": 25,
  "processing": 5,
  "sent": 1000,
  "failed": 15
}
```

## Queueing Model and Retry Flow

```
1. Job Created -> Status: "pending"
         |
         v
2. Published to Main Queue -> Status: "queued"
         |
         v
3. Consumer picks up job -> Status: "processing"
         |
    +----+----+
    |         |
 Success    Failure
    |         |
    v         v
 Status:   retryCount < maxRetries?
 "sent"       |
         +----+----+
         |         |
        Yes        No
         |         |
         v         v
    Publish to   Status:
    Retry Queue  "failed"
    (30s delay)  (to DLQ)
         |
         v
    After TTL expires,
    message returns to
    Main Queue
```

### Retry Configuration
- Max retries: 3 (configurable per job)
- Retry delay: 30 seconds (via TTL on retry queue)
- Exponential backoff can be added by using multiple retry queues

## Scaling Strategy

### Horizontal Scaling
1. **API Servers**: Stateless design allows adding instances behind a load balancer
2. **Queue Consumers**: Multiple consumer instances can process jobs in parallel
3. **MongoDB**: Replica sets for read scaling, sharding for write scaling

### Vertical Scaling
- Increase prefetch count on consumers (currently 10)
- Tune MongoDB connection pool size
- Increase RabbitMQ memory limits

### Throughput Calculations
- Target: 50,000 notifications/minute = ~833/second
- With 10 consumers, each processing 100 jobs/second = 1,000/second capacity
- Provider latency (100-500ms) is the bottleneck; batch processing can help

## Fault Tolerance Strategy

### Message Durability
- All queues are durable (survive broker restart)
- Messages are persistent (written to disk)
- Consumer acknowledgments ensure no message loss

### Database Resilience
- MongoDB replica sets for automatic failover
- Write concern can be configured for durability vs speed

### Circuit Breaker Pattern (Future)
- Track provider failure rates
- Open circuit when threshold exceeded
- Gradually test recovery

### Graceful Degradation
- Failed jobs go to retry queue, not lost
- Dead letter queue captures permanently failed jobs for manual review
- System continues processing other jobs during partial failures

## Design Defense

### Why This Architecture?

This architecture follows proven patterns for high-throughput message processing:

1. **Message Queue Decoupling**: Separating API from processing allows independent scaling and prevents request blocking during provider slowdowns.

2. **MongoDB for Flexibility**: Document model fits notification payloads well, and MongoDB handles high write throughput with proper indexing.

3. **RabbitMQ for Reliability**: Mature, battle-tested broker with built-in support for dead letter queues, TTL, and acknowledgments.

4. **Stateless API**: Enables horizontal scaling without session management complexity.

### How Will It Handle 50,000 Notifications/Minute?

1. **Parallel Processing**: Multiple consumer instances process jobs concurrently. With prefetch of 10 and 10 consumers, 100 jobs are in-flight simultaneously.

2. **Async I/O**: Node.js event loop handles concurrent provider calls efficiently without blocking.

3. **Queue Buffering**: RabbitMQ absorbs traffic spikes, allowing consumers to process at sustainable rates.

4. **Database Indexing**: Compound indexes on status and createdAt enable efficient queries without full collection scans.

5. **Batch Operations** (Future): Grouping notifications to same provider reduces connection overhead.

### How Does the System Degrade Gracefully Under Load?

1. **Backpressure via Prefetch**: Consumers only take jobs they can handle; excess jobs wait in queue.

2. **Retry Queue Isolation**: Failed jobs don't block the main queue; they wait in a separate retry queue.

3. **Dead Letter Queue**: Permanently failed jobs are captured for analysis without blocking processing.

4. **Rate Limiting** (Future): API can reject requests when queue depth exceeds threshold.

5. **Provider Failover** (Future): Switch to backup providers when primary fails.

### Potential Bottlenecks and Mitigations

| Bottleneck | Mitigation |
|------------|------------|
| Provider latency | Increase consumer count, implement batch sending |
| MongoDB writes | Use write concern "majority" only for critical ops, add sharding |
| RabbitMQ throughput | Add more nodes to cluster, use lazy queues for large backlogs |
| Single API server | Deploy multiple instances behind load balancer |
| Network failures | Implement circuit breakers, connection pooling |
| Memory pressure | Use lazy queues, implement pagination for large result sets |

## Setup and Running

### Prerequisites
- Node.js 18+
- MongoDB 6+
- RabbitMQ 3.12+

### Installation
```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Environment Variables
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wavecom_notifications
RABBITMQ_URL=amqp://localhost:5672
```

## Future Enhancements

1. **Rate Limiting**: Per-client and global rate limits
2. **Priority Queues**: Urgent notifications processed first
3. **Batch API**: Submit multiple notifications in one request
4. **Webhooks**: Notify clients of delivery status changes
5. **Analytics Dashboard**: Delivery rates, latency percentiles
6. **Multi-region**: Geographic distribution for lower latency
7. **Template System**: Reusable notification templates
8. **Scheduling**: Send notifications at specified times
