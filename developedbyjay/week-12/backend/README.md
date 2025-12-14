# Notification Queue System

A scalable notification delivery system built with Node.js, Express, RabbitMQ, and MongoDB. This system handles asynchronous notification processing with robust retry mechanisms and fault tolerance.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Architecture Diagram](#architecture-diagram)
- [Components and Responsibilities](#components-and-responsibilities)
- [Scaling Strategy](#scaling-strategy)
- [Fault Tolerance Strategy](#fault-tolerance-strategy)
- [Queueing Model & Retry Flow](#queueing-model--retry-flow)
- [API Design](#api-design)
- [Database Schema](#database-schema)
- [Design Defense](#design-defense)
- [Setup Instructions](#setup-instructions)

## Architecture Overview

This system implements a producer-consumer pattern for handling high-volume notification delivery. The architecture separates API request handling from notification processing, enabling horizontal scaling and fault isolation.

## Architecture Diagram

```
┌─────────────┐         ┌─────────────────┐         ┌──────────────┐
│   Client    │────────>│   API Server    │────────>│   MongoDB    │
│             │  HTTP   │   (Express)     │  Write  │              │
└─────────────┘         └─────────────────┘         └──────────────┘
                               │
                               │ Publish
                               ▼
                        ┌──────────────┐
                        │   RabbitMQ   │
                        │    Queue     │
                        └──────────────┘
                               │
                               │ Consume
                               ▼
                        ┌──────────────┐
                        │   Worker     │───────> External Notification
                        │   Consumer   │         Providers (Email/SMS/Push)
                        └──────────────┘
                               │
                               │ Update Status
                               ▼
                        ┌──────────────┐
                        │   MongoDB    │
                        └──────────────┘
```

## Components and Responsibilities

### 1. API Server (`src/server.ts`)

**Responsibility**: Handle incoming HTTP requests and queue notification jobs

**Key Features**:

- Express.js REST API
- Request validation and sanitization
- Job creation and status retrieval
- CORS-enabled for cross-origin requests
- Immediate response to clients (non-blocking)

**Scalability**: Stateless design allows horizontal scaling with load balancers

### 2. Job Controller (`src/controllers/jobs.controller.ts`)

**Responsibility**: Business logic for job management

**Operations**:

- `createJob`: Validates request, creates database record, publishes to queue
- `getJob`: Retrieves individual job status by ID
- `getJobs`: Lists all jobs with sorting

**Design**: Thin controller layer following single responsibility principle

### 3. RabbitMQ Publisher (`src/rabbitmq/publisher.ts`)

**Responsibility**: Message publishing to RabbitMQ queue

**Features**:

- Queue assertion for automatic queue creation
- Message serialization
- Connection pooling via shared channel

**Pattern**: Fire-and-forget publishing for low latency

### 4. RabbitMQ Connection Manager (`src/rabbitmq/connection.ts`)

**Responsibility**: Manage persistent RabbitMQ connections

**Features**:

- Singleton connection pattern
- Lazy initialization
- Channel reuse across publishers

**Resilience**: Automatic reconnection on connection failure

### 5. Worker Consumer (`src/workers/consumer.ts`)

**Responsibility**: Process notifications from queue

**Workflow**:

1. Consume messages from queue
2. Update job status to "processing"
3. Call notification provider
4. Handle success/failure with retry logic
5. Update final job status

**Concurrency**: Single worker can process multiple messages concurrently based on prefetch settings

### 6. Notification Provider (`src/providers/mock-provider.ts`)

**Responsibility**: Interface to external notification services

**Current Implementation**: Mock provider with simulated latency and random failures

**Production Ready**: Abstract interface allows swapping with real providers (SendGrid, Twilio, Firebase)

### 7. MongoDB Models (`src/models/job.ts`)

**Responsibility**: Data persistence and schema definition

**Features**:

- Mongoose ODM for type-safe operations
- Timestamps for audit trail
- Indexed fields for query optimization

### 8. Database Connection (`src/lib/mongoose.ts`)

**Responsibility**: MongoDB connection management

**Features**:

- Connection pooling
- Error handling with process exit on failure
- Configurable via environment variables

## Scaling Strategy

### Horizontal Scaling

#### API Server Scaling

- **Strategy**: Deploy multiple API server instances behind a load balancer (Nginx, AWS ALB, or HAProxy)
- **Configuration**: Each instance connects to the same RabbitMQ and MongoDB
- **Session Management**: Stateless design eliminates session affinity requirements
- **Target**: Scale to 50-100 instances for 50,000 notifications/min

```
Load Balancer (Round Robin)
    ├── API Server Instance 1
    ├── API Server Instance 2
    ├── API Server Instance 3
    └── API Server Instance N
```

#### Worker Consumer Scaling

- **Strategy**: Deploy multiple worker processes/containers
- **RabbitMQ Distribution**: Messages automatically distributed across workers
- **Prefetch Control**: Set `channel.prefetch(10)` to limit concurrent processing per worker
- **Target**: 20-50 workers for 50,000 notifications/min (assuming 500ms per notification)

```bash
# Start multiple workers
npm run worker  # Instance 1
npm run worker  # Instance 2
npm run worker  # Instance N
```

#### Database Scaling

- **Read Replicas**: Separate read queries (getJob, getJobs) to replica sets
- **Sharding**: Partition jobs collection by date or job ID for horizontal scaling
- **Indexes**: Create compound indexes on status, createdAt, and type fields
- **Connection Pooling**: Increase pool size (default: 100) for high concurrency

#### Message Queue Scaling

- **RabbitMQ Clustering**: Deploy 3-5 node cluster for high availability
- **Queue Mirroring**: Replicate queues across cluster nodes
- **Persistent Messages**: Enable disk persistence for durability
- **Separate Queues**: Use priority queues for urgent notifications

### Vertical Scaling

- **API Server**: 2-4 CPU cores, 2-4GB RAM per instance
- **Worker**: 2-4 CPU cores, 4-8GB RAM per instance (more memory for payload processing)
- **MongoDB**: 8-16 CPU cores, 32-64GB RAM with SSD storage
- **RabbitMQ**: 4-8 CPU cores, 16-32GB RAM


## Fault Tolerance Strategy

### 1. Retry Mechanism

**Implementation**: Exponential backoff with maximum retry limit

```typescript
// Current: 3 attempts with requeue
if (job.attempts >= 3) {
  job.status = "failed";
  channel.ack(msg);
} else {
  channel.nack(msg, false, true); // Requeue for retry
}
```

**Enhancement Recommendation**: Add exponential backoff delay

```typescript
const retryDelay = Math.min(1000 * Math.pow(2, job.attempts), 60000);
setTimeout(() => channel.nack(msg, false, true), retryDelay);
```

### 2. Dead Letter Queue (DLQ)

**Purpose**: Isolate permanently failed messages for manual inspection

**Configuration**:

```typescript
await channel.assertQueue("notifications", {
  deadLetterExchange: "dlx",
  deadLetterRoutingKey: "notifications.failed",
});
await channel.assertQueue("notifications.failed");
```


### 3. Message Durability

```typescript
await channel.assertQueue("notifications", {
  durable: true, // Queue survives RabbitMQ restart
});

channel.sendToQueue("notifications", buffer, {
  persistent: true, // Message survives restart
});
```


## Queueing Model & Retry Flow

### Queueing Model

**Pattern**: Work Queue (Task Queue)

**Characteristics**:

- Single queue: `notifications`
- Multiple competing consumers
- Round-robin message distribution
- Acknowledgment-based delivery

**Queue Configuration**:

```typescript
{
  durable: true,           // Queue survives broker restart
  prefetch: 10,            // Process 10 messages concurrently per worker
  noAck: false,            // Manual acknowledgment required
  deadLetterExchange: 'dlx' // Route failed messages
}
```

### Message Flow

```
1. Client Request
   └──> API receives notification request

2. Job Creation
   └──> MongoDB: Create job record (status: "queued")

3. Message Publishing
   └──> RabbitMQ: Publish jobId to queue

4. Immediate Response
   └──> Client: Return 201 with job details

5. Worker Consumption
   └──> Worker: Fetch message from queue

6. Processing
   ├──> MongoDB: Update status to "processing"
   ├──> Provider: Send notification
   └──> MongoDB: Update status to "sent" or "failed"

7. Acknowledgment
   └──> RabbitMQ: ACK or NACK message
```

### Retry Flow

```
Attempt 1:
┌─────────────┐
│   Worker    │───> Send Notification
└─────────────┘
       │
   ┌───┴───┐
   │       │
Success   Failure
   │       │
  ACK     NACK + Requeue
           │
           ▼
       Back to Queue

Attempt 2:
┌─────────────┐
│   Worker    │───> Send Notification (Wait 2s)
└─────────────┘
       │
   ┌───┴───┐
   │       │
Success   Failure
   │       │
  ACK     NACK + Requeue
           │
           ▼
       Back to Queue

Attempt 3 (Final):
┌─────────────┐
│   Worker    │───> Send Notification (Wait 4s)
└─────────────┘
       │
   ┌───┴───┐
   │       │
Success   Failure
   │       │
  ACK     Mark Failed + ACK
           │
           ▼
      Dead Letter Queue
```

### Retry Logic Implementation

```typescript
try {
  // Attempt notification
  await sendMockNotification(job.type, job.payload);
  job.status = "sent";
  channel.ack(msg);
} catch (err) {
  job.attempts++;

  if (job.attempts >= 3) {
    // Max retries reached
    job.status = "failed";
    job.error = err.message;
    channel.ack(msg); // Remove from queue
  } else {
    // Retry
    job.error = err.message;
    channel.nack(msg, false, true); // Requeue
  }

  await job.save();
}
```

### Endpoints

#### 1. Create Notification Job

**Endpoint**: `POST /api/jobs`

**Description**: Creates a new notification job and queues it for processing

**Request Body**:

```json
{
  "type": "email|sms|push",
  "payload": {
    "recipient": "user@example.com",
    "subject": "Welcome!",
    "body": "Thank you for signing up"
  }
}
```

**Response**: `201 Created`

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "email",
  "payload": {
    "recipient": "user@example.com",
    "subject": "Welcome!",
    "body": "Thank you for signing up"
  },
  "status": "queued",
  "attempts": 0,
  "createdAt": "2025-12-10T10:30:00.000Z",
  "updatedAt": "2025-12-10T10:30:00.000Z"
}
```

**Error Responses**:

- `400 Bad Request`: Invalid request body
- `500 Internal Server Error`: Database or queue connection failure

#### 2. Get Job by ID

**Endpoint**: `GET /api/jobs/:id`

**Description**: Retrieves the current status of a notification job

**Path Parameters**:

- `id`: MongoDB ObjectId of the job

**Response**: `200 OK`

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "email",
  "payload": {
    "recipient": "user@example.com",
    "subject": "Welcome!",
    "body": "Thank you for signing up"
  },
  "status": "sent",
  "attempts": 1,
  "createdAt": "2025-12-10T10:30:00.000Z",
  "updatedAt": "2025-12-10T10:30:05.000Z"
}
```

**Error Responses**:

- `404 Not Found`: Job ID does not exist
- `500 Internal Server Error`: Database connection failure

#### 3. List All Jobs

**Endpoint**: `GET /api/jobs`

**Description**: Retrieves all notification jobs, sorted by creation date (newest first)

**Response**: `200 OK`

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "type": "email",
    "status": "sent",
    "attempts": 1,
    "createdAt": "2025-12-10T10:30:00.000Z",
    "updatedAt": "2025-12-10T10:30:05.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "type": "sms",
    "status": "processing",
    "attempts": 0,
    "createdAt": "2025-12-10T10:29:55.000Z",
    "updatedAt": "2025-12-10T10:29:58.000Z"
  }
]
```

**Error Responses**:

- `500 Internal Server Error`: Database connection failure

### Request/Response Headers

**Content-Type**: `application/json`

**CORS**: Enabled for all origins (configure for production)

### Rate Limiting (Recommended)

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute per IP
  message: "Too many requests",
});

app.use("/api/jobs", limiter);
```

## Database Schema

### Jobs Collection

**Collection Name**: `jobs`

**Schema Definition**:

```typescript
interface IJob {
  _id: ObjectId; // Primary key (auto-generated)
  type: string; // Notification type: "email" | "sms" | "push"
  payload: object; // Notification-specific data
  status: string; // Current state: "queued" | "processing" | "sent" | "failed"
  attempts: number; // Number of delivery attempts (default: 0)
  error?: string; // Error message from last failed attempt
  createdAt: Date; // Timestamp when job was created
  updatedAt: Date; // Timestamp when job was last modified
}
```

**Mongoose Schema**:

```typescript
const JobSchema = new Schema<IJob>(
  {
    type: {
      type: String,
      required: true,
      enum: ["email", "sms", "push"],
      index: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "queued",
      enum: ["queued", "processing", "sent", "failed"],
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);
```


### Field Descriptions

| Field       | Type     | Required | Description                                                    |
| ----------- | -------- | -------- | -------------------------------------------------------------- |
| `_id`       | ObjectId | Yes      | Unique identifier for the job                                  |
| `type`      | String   | Yes      | Type of notification (email, sms, push)                        |
| `payload`   | Object   | Yes      | Contains notification-specific data (recipient, message, etc.) |
| `status`    | String   | Yes      | Current job state in processing pipeline                       |
| `attempts`  | Number   | Yes      | Tracks retry attempts (0-3)                                    |
| `error`     | String   | No       | Error message from most recent failure                         |
| `createdAt` | Date     | Auto     | Timestamp when job was initially created                       |
| `updatedAt` | Date     | Auto     | Timestamp of last modification                                 |

### Status Lifecycle

```
queued ──────> processing ──────> sent
                    │
                    │ (on failure)
                    │
                    ├──> queued (retry 1)
                    │
                    ├──> queued (retry 2)
                    │
                    └──> failed (after 3 attempts)
```

### Example Documents

**Queued Job**:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "type": "email",
  "payload": {
    "recipient": "user@example.com",
    "subject": "Welcome",
    "body": "Hello!"
  },
  "status": "queued",
  "attempts": 0,
  "createdAt": ISODate("2025-12-10T10:00:00.000Z"),
  "updatedAt": ISODate("2025-12-10T10:00:00.000Z")
}
```

**Failed Job**:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "type": "sms",
  "payload": {
    "phone": "+1234567890",
    "message": "Your code is 1234"
  },
  "status": "failed",
  "attempts": 3,
  "error": "Provider timeout after 30s",
  "createdAt": ISODate("2025-12-10T09:55:00.000Z"),
  "updatedAt": ISODate("2025-12-10T09:56:30.000Z")
}
```

### Database Configuration

**Connection Settings**:

```typescript
{
  serverApi: { version: "1", strict: true },
  dbName: "jobQueueDB",
  maxPoolSize: 100,
  minPoolSize: 10,
  socketTimeoutMS: 45000
}
```

**Scaling Considerations**:

- Use replica sets for high availability
- Enable sharding when collection exceeds 100M documents
- Shard key recommendation: `{ createdAt: 1, _id: 1 }`

## Design Defense

### Why This Architecture?

#### 1. Producer-Consumer Pattern

**Decision**: Separate API layer from processing layer

**Rationale**:

- **Decoupling**: API servers handle HTTP quickly without blocking on slow notification providers
- **Scalability**: Scale API and workers independently based on different bottlenecks
- **Resilience**: API remains responsive even when notification providers are slow or down
- **Flexibility**: Easy to add new notification types without modifying API layer

#### 2. RabbitMQ as Message Queue

**Decision**: Use RabbitMQ instead of Redis/SQS/Kafka

**Rationale**:

- **Reliability**: Built-in acknowledgments prevent message loss
- **Retry Support**: Native NACK with requeue for failed messages
- **Dead Letter Queues**: Automatic routing of permanently failed messages
- **Low Latency**: In-memory message handling with optional persistence
- **Mature Ecosystem**: Well-documented, battle-tested in production systems
- **Fair Distribution**: Round-robin dispatch ensures even worker utilization

**Alternatives Considered**:

- **Redis Pub/Sub**: Lacks message persistence and retry guarantees
- **AWS SQS**: Higher latency, costs scale with message volume
- **Kafka**: Overkill for this use case, optimized for event streaming not task queues

#### 3. MongoDB as Persistent Store

**Decision**: Store job state in MongoDB

**Rationale**:

- **Flexible Schema**: Payload objects vary by notification type
- **Horizontal Scalability**: Sharding support for millions of jobs
- **Fast Writes**: Insert performance critical for high-volume job creation
- **Rich Querying**: Complex status queries and analytics
- **TTL Indexes**: Automatic cleanup of old jobs

#### 4. Stateless API Design

**Decision**: No session state in API servers

**Rationale**:

- **Horizontal Scaling**: Add/remove servers without session migration
- **Load Balancing**: Any server can handle any request
- **Fault Tolerance**: Server crashes don't lose user sessions
- **Cloud Native**: Works seamlessly with containerization and auto-scaling

### How Will It Handle 50,000 Notifications/Min?

#### Capacity Analysis

**Target**: 50,000 notifications/minute = 833 notifications/second

**Component Capacity**:

**1. API Server Capacity**

- Single instance: ~1,000 req/sec (Node.js + Express)
- Required instances: 1-2 (with headroom)
- Bottleneck: Not the API layer (very fast job creation)

**2. RabbitMQ Capacity**

- Single node: ~50,000 msg/sec
- Cluster: ~200,000 msg/sec
- Required: 1 node sufficient (with clustering for HA)
- Bottleneck: Not the queue

**3. Worker Consumer Capacity**

- Single worker: 2 msg/sec (500ms per notification)
- Required workers: 833 / 2 = 417 workers
- **Critical**: This is the bottleneck

**4. MongoDB Capacity**

- Writes: ~10,000 writes/sec per replica set
- Required: 1 replica set (writes: 833/sec \* 2 = 1,666/sec)
- Bottleneck: Not the database at this scale

#### Optimization Strategy for Workers

**Problem**: Need 417 workers for 833 notifications/sec

**Solution 1: Optimize Provider Latency**

```typescript
// Reduce mock delay from 500ms to 100ms
await new Promise((r) => setTimeout(r, 100));
// New capacity: 10 msg/sec per worker
// Required workers: 833 / 10 = 84 workers
```

**Solution 2: Parallel Processing with Prefetch**

```typescript
// Each worker processes 10 messages concurrently
channel.prefetch(10);
// Capacity: 10 * 10 = 100 msg/sec per worker
// Required workers: 833 / 100 = 9 workers
```

**Solution 3: Batch Processing**

```typescript
// Send notifications in batches of 50
const batch = await consumeMultiple(50);
await sendBatchNotification(batch);
// Capacity: Depends on provider API
```

**Recommended Configuration**:

- **Workers**: 20-30 instances
- **Prefetch**: 10 messages per worker
- **Provider Timeout**: 5 seconds
- **Expected Capacity**: 20 workers _ 10 concurrent _ 2 msg/sec = 400 msg/sec (24,000/min)
- **Peak Capacity**: 30 workers _ 10 concurrent _ 2 msg/sec = 600 msg/sec (36,000/min)

**Scaling Beyond 50,000/min**:

- Increase worker count linearly
- Optimize provider integration (HTTP/2, connection pooling)
- Use dedicated notification gateways (SendGrid, Twilio)
- Implement batching for email notifications

### How Does the System Degrade Gracefully Under Load?

#### 1. Queue Buffering

**Behavior**: When workers are saturated, messages accumulate in RabbitMQ

**Graceful Degradation**:

- Clients still get immediate 201 responses
- Jobs queue depth increases but no failures
- Processing latency increases but delivery succeeds
- Monitoring alerts trigger auto-scaling

**Mitigation**:

```yaml
Auto-scale trigger:
  - Queue depth > 10,000: Add 5 workers
  - Queue depth > 50,000: Add 10 workers
  - Queue depth > 100,000: Add 20 workers
```

#### 2. API Rate Limiting

**Behavior**: Limit job creation rate per client

**Graceful Degradation**:

- Return 429 Too Many Requests
- Include Retry-After header
- Clients implement exponential backoff

**Implementation**:

```typescript
const limiter = rateLimit({
  windowMs: 60000,
  max: 1000,
  message: "Rate limit exceeded. Try again in 60 seconds.",
});
```

#### 3. Circuit Breaker for Providers

**Behavior**: Stop calling failing providers temporarily

**Graceful Degradation**:

- Jobs marked as "failed" immediately when circuit open
- No wasted retry attempts on known-down providers
- Automatic recovery when provider comes back
- Exponential backoff before retry

**States**:

- **CLOSED**: Normal operation
- **OPEN**: Provider down, fail fast (30-60 seconds)
- **HALF_OPEN**: Test with single request

#### 4. Database Connection Pooling

**Behavior**: Limit concurrent database connections

**Graceful Degradation**:

- Requests queue for available connections
- Prevents database overload
- Slow response instead of crashes

**Configuration**:

```typescript
{
  maxPoolSize: 100,      // Maximum connections
  minPoolSize: 10,       // Minimum connections
  waitQueueTimeoutMS: 5000  // Timeout if no connection available
}
```

#### 5. Worker Auto-Scaling

**Behavior**: Dynamically adjust worker count

**Metrics**:

- Queue depth
- Processing latency
- Worker CPU usage

**Actions**:

- Scale up: Add workers when queue grows
- Scale down: Remove workers when queue drains

#### 6. Priority Queues

**Behavior**: Separate urgent from normal notifications

**Graceful Degradation**:

- High-priority queue (SMS verification codes)
- Normal queue (marketing emails)
- Under load, prioritize high-priority queue

```typescript
await channel.assertQueue("notifications.high", { priority: 10 });
await channel.assertQueue("notifications.normal", { priority: 5 });
```

### What Are Potential Bottlenecks and Mitigations?

#### Bottleneck 1: Worker Processing Speed

**Issue**: Workers can't keep up with incoming job rate

**Symptoms**:

- Queue depth continuously growing
- Job processing latency increasing
- Workers at 100% CPU

**Mitigations**:

1. **Horizontal Scaling**: Add more worker instances
2. **Prefetch Optimization**: Increase concurrent messages per worker
3. **Provider Optimization**: Use connection pooling, HTTP/2
4. **Batch API Calls**: Send multiple notifications in single API call
5. **Resource Allocation**: Increase worker CPU/memory

**Monitoring**:

```javascript
// Alert when queue depth > 50,000
// Alert when avg processing time > 5 seconds
```

#### Bottleneck 2: Database Write Throughput

**Issue**: MongoDB can't handle write volume

**Symptoms**:

- Slow job creation responses
- Connection pool exhaustion
- Database CPU at 100%

**Mitigations**:

1. **Indexes**: Add compound indexes on frequent queries
2. **Write Concern**: Use `w: 1` for non-critical updates
3. **Batch Writes**: Use bulkWrite for status updates
4. **Sharding**: Partition jobs collection across multiple servers
5. **Read Replicas**: Offload GET requests to replicas

**Configuration**:

```typescript
// Increase connection pool
{
  maxPoolSize: 200;
}

// Use batch updates
await Job.bulkWrite([
  { updateOne: { filter: { _id: id1 }, update: { status: "sent" } } },
  { updateOne: { filter: { _id: id2 }, update: { status: "sent" } } },
]);
```

#### Bottleneck 3: RabbitMQ Memory Limits

**Issue**: Queue memory consumption exceeds available RAM

**Symptoms**:

- RabbitMQ flow control activated
- Publishers blocked from sending
- Slow message publishing

**Mitigations**:

1. **Disk Paging**: Enable lazy queues for disk-backed storage
2. **Message TTL**: Auto-expire old messages
3. **Queue Length Limits**: Reject messages when queue full
4. **Clustering**: Distribute queues across multiple nodes
5. **Memory Allocation**: Increase RabbitMQ memory limits

**Configuration**:

```typescript
// Lazy queue (disk-backed)
await channel.assertQueue("notifications", {
  durable: true,
  arguments: { "x-queue-mode": "lazy" },
});

// Message TTL (expire after 1 hour)
channel.sendToQueue("notifications", buffer, {
  expiration: "3600000",
});
```

#### Bottleneck 4: External Provider Rate Limits

**Issue**: Notification providers (SendGrid, Twilio) have rate limits

**Symptoms**:

- 429 responses from providers
- Failed deliveries
- Retry storms

**Mitigations**:

1. **Multiple Providers**: Use backup providers when primary hits limit
2. **Token Bucket**: Implement local rate limiting before API calls
3. **Provider Queues**: Separate queues per provider with different consumption rates
4. **Exponential Backoff**: Increase retry delays after 429 responses
5. **Provider Upgrade**: Purchase higher-tier plans with increased limits

**Implementation**:

```typescript
// Token bucket rate limiter
class RateLimiter {
  private tokens = 100;
  private maxTokens = 100;
  private refillRate = 10; // per second

  async acquire() {
    if (this.tokens < 1) {
      await this.waitForToken();
    }
    this.tokens--;
  }
}
```

#### Bottleneck 5: API Server Network I/O

**Issue**: Network bandwidth saturation

**Symptoms**:

- Slow API responses
- Request timeouts
- High network latency

**Mitigations**:

1. **Response Compression**: Enable gzip compression
2. **Payload Limits**: Restrict maximum job payload size
3. **CDN/Edge**: Deploy API servers in multiple regions
4. **Keep-Alive**: Enable HTTP keep-alive for connection reuse
5. **Bandwidth Upgrade**: Increase network capacity

**Configuration**:

```typescript
import compression from "compression";
app.use(compression());
app.use(express.json({ limit: "10kb" }));
```

#### Bottleneck 6: Worker Database Connection Overhead

**Issue**: Each worker creates separate database connections

**Symptoms**:

- MongoDB max connections reached
- Connection creation latency
- Memory overhead

**Mitigations**:

1. **Connection Pooling**: Share connections across worker processes
2. **Batch Status Updates**: Update multiple jobs in single query
3. **Reduce Update Frequency**: Only update on state changes
4. **Connection Limits**: Configure maxPoolSize per worker
5. **Stateless Workers**: Use external cache (Redis) for transient state

**Best Practice**:

```typescript
// Update only on state change
if (job.status !== newStatus) {
  job.status = newStatus;
  await job.save();
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- RabbitMQ 3.12+
- pnpm 10+

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd week-12/backend
```

2. Install dependencies

```bash
pnpm install
```

3. Start RabbitMQ (Docker)

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

4. Create `.env` file in `src/` directory

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/jobQueueDB
RABBITMQ_URL=amqp://localhost:5672
```

5. Start the API server

```bash
pnpm run dev
```

6. Start worker consumers (in separate terminals)

```bash
pnpm run worker
```

### Testing

Send a test notification:

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "payload": {
      "recipient": "test@example.com",
      "subject": "Test",
      "body": "Hello World"
    }
  }'
```

Check job status:

```bash
curl http://localhost:3000/api/jobs/<job-id>
```

### Production Deployment

1. Use environment variables for configuration
2. Enable RabbitMQ clustering for high availability
3. Deploy MongoDB replica set
4. Implement monitoring (Prometheus, Grafana)
5. Configure auto-scaling for API and workers
6. Set up logging aggregation (ELK, Datadog)
7. Enable rate limiting and DDoS protection
8. Use container orchestration (Kubernetes, ECS)

### Monitoring Recommendations

- **Queue Metrics**: Queue depth, message rate, consumer count
- **Worker Metrics**: Processing time, success rate, error rate
- **Database Metrics**: Connection pool usage, query latency, write throughput
- **API Metrics**: Request rate, response time, error rate
- **Business Metrics**: Delivery success rate by type, average delivery time

---

**License**: ISC

**Author**: Jay

**Version**: 1.0.0

