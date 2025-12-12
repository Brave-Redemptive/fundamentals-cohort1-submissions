# WaveCom Notification System - Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Dashboard<br/>Vite + TypeScript<br/>Port: 5173]
    end

    subgraph "API Layer"
        LB[Load Balancer<br/>Optional]
        API1[API Server 1<br/>Express.js<br/>Port: 5000]
        API2[API Server 2<br/>Express.js]
        API3[API Server N<br/>Express.js]

        LB --> API1
        LB --> API2
        LB --> API3
    end

    subgraph "Message Queue Layer"
        RMQ[RabbitMQ Broker<br/>Port: 5672]
        HPQ[High Priority Queue<br/>CRITICAL/HIGH]
        STQ[Standard Queue<br/>MEDIUM/LOW]
        RTQ[Retry Queue<br/>With Delays]
        DLQ[Dead Letter Queue<br/>Permanent Failures]

        RMQ --> HPQ
        RMQ --> STQ
        RMQ --> RTQ
        RMQ --> DLQ
    end

    subgraph "Worker Layer"
        W1[Worker 1]
        W2[Worker 2]
        W3[Worker 3]
        WN[Worker N]

        HPQ --> W1
        STQ --> W1
        RTQ --> W1

        HPQ --> W2
        STQ --> W2
        RTQ --> W2

        HPQ --> W3
        STQ --> W3
        RTQ --> W3

        HPQ --> WN
        STQ --> WN
        RTQ --> WN
    end

    subgraph "Database Layer"
        MONGO[(MongoDB<br/>Port: 27017)]
        COLL1[notifications<br/>collection]
        COLL2[notificationlogs<br/>collection]

        MONGO --> COLL1
        MONGO --> COLL2
    end

    subgraph "Provider Layer"
        EMAIL[Email Provider<br/>SMTP/SendGrid/SES]
        SMS[SMS Provider<br/>Twilio/SNS]
        PUSH[Push Provider<br/>FCM/APNs]
    end

    subgraph "Monitoring Layer"
        PROM[Prometheus<br/>Metrics]
        LOGS[Winston Logs]
        HEALTH[Health Checks]
    end

    UI -->|HTTP REST| LB
    API1 -->|Write/Read| MONGO
    API1 -->|Publish| RMQ
    API2 -->|Write/Read| MONGO
    API2 -->|Publish| RMQ
    API3 -->|Write/Read| MONGO
    API3 -->|Publish| RMQ

    W1 -->|Update Status| MONGO
    W1 -->|Send| EMAIL
    W1 -->|Send| SMS
    W1 -->|Send| PUSH
    W1 -->|Retry/DLQ| RMQ

    W2 -->|Update Status| MONGO
    W2 -->|Send| EMAIL
    W2 -->|Send| SMS
    W2 -->|Send| PUSH
    W2 -->|Retry/DLQ| RMQ

    W3 -->|Update Status| MONGO
    W3 -->|Send| EMAIL
    W3 -->|Send| SMS
    W3 -->|Send| PUSH
    W3 -->|Retry/DLQ| RMQ

    WN -->|Update Status| MONGO
    WN -->|Send| EMAIL
    WN -->|Send| SMS
    WN -->|Send| PUSH
    WN -->|Retry/DLQ| RMQ

    API1 -.->|Expose| PROM
    API1 -.->|Write| LOGS
    API1 -.->|Report| HEALTH

    W1 -.->|Write| LOGS
    W2 -.->|Write| LOGS
    W3 -.->|Write| LOGS
    WN -.->|Write| LOGS

    style UI fill:#e1f5ff
    style RMQ fill:#fff4e1
    style MONGO fill:#e8f5e9
    style EMAIL fill:#fce4ec
    style SMS fill:#fce4ec
    style PUSH fill:#fce4ec
    style PROM fill:#f3e5f5
    style LOGS fill:#f3e5f5
    style HEALTH fill:#f3e5f5
```

## Notification Lifecycle Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as API Server
    participant DB as MongoDB
    participant Queue as RabbitMQ
    participant Worker
    participant Provider as Email/SMS/Push Provider

    Client->>API: POST /api/notifications
    activate API

    API->>API: Validate Request (Joi)

    API->>DB: Create Notification Document
    activate DB
    DB-->>API: Document ID + Status: PENDING
    deactivate DB

    API->>DB: Create Audit Log (PENDING)

    API->>Queue: Publish Message to Queue
    activate Queue
    Note over Queue: Route by Priority:<br/>HIGH/CRITICAL → high_priority<br/>MEDIUM/LOW → notifications
    Queue-->>API: Message Queued
    deactivate Queue

    API->>DB: Update Status: QUEUED
    API->>DB: Create Audit Log (QUEUED)

    API-->>Client: 201 Created {id, status: QUEUED}
    deactivate API

    Queue->>Worker: Consume Message
    activate Worker

    Worker->>DB: Update Status: PROCESSING
    Worker->>DB: Create Audit Log (PROCESSING)

    Worker->>Provider: Send Notification
    activate Provider

    alt Success
        Provider-->>Worker: 200 OK {messageId}
        deactivate Provider

        Worker->>DB: Update Status: SENT<br/>sentAt, processingTimeMs, providerMessageId
        Worker->>DB: Create Audit Log (SENT)
        Worker->>Queue: ACK (remove from queue)

    else Provider Failure
        Provider-->>Worker: 5xx Error / Timeout
        deactivate Provider

        alt Retry Count < Max Retries
            Worker->>DB: Update Status: RETRYING<br/>Increment retryCount
            Worker->>DB: Create Audit Log (RETRYING)
            Worker->>Queue: Publish to Retry Queue (with delay)
            Worker->>Queue: ACK (remove from original queue)

            Note over Queue: Exponential Backoff:<br/>Attempt 2: 5s<br/>Attempt 3: 25s<br/>Attempt 4: 125s

            Queue->>Worker: Consume from Retry Queue (after delay)
            Worker->>Provider: Retry Send

        else Retry Count >= Max Retries
            Worker->>DB: Update Status: FAILED<br/>failedAt, error
            Worker->>DB: Create Audit Log (FAILED)
            Worker->>Queue: Publish to Dead Letter Queue
            Worker->>Queue: ACK (remove from queue)
        end
    end

    deactivate Worker

    Client->>API: GET /api/notifications/{id}
    activate API
    API->>DB: Query Notification + Logs
    activate DB
    DB-->>API: Notification + Audit Trail
    deactivate DB
    API-->>Client: 200 OK {notification, logs}
    deactivate API
```

## Data Model Diagram

```mermaid
erDiagram
    NOTIFICATION ||--o{ NOTIFICATION_LOG : has

    NOTIFICATION {
        ObjectId _id PK
        string type "EMAIL|SMS|PUSH"
        string recipient "email|phone|token"
        string subject "optional"
        string message
        string status "PENDING|QUEUED|PROCESSING|SENT|FAILED|RETRYING"
        string priority "LOW|MEDIUM|HIGH|CRITICAL"
        number retryCount
        number maxRetries
        object metadata
        date scheduledAt
        date sentAt
        date failedAt
        string error
        string providerMessageId
        number processingTimeMs
        date createdAt
        date updatedAt
    }

    NOTIFICATION_LOG {
        ObjectId _id PK
        ObjectId notificationId FK
        string status
        string message
        date timestamp
        object metadata
    }
```

## Queue Architecture

```mermaid
graph LR
    subgraph "API Servers"
        API[API Server<br/>Publisher]
    end

    subgraph "RabbitMQ Exchange"
        EX[Topic Exchange<br/>notifications.topic]
    end

    subgraph "Queues"
        HPQ[high_priority<br/>Routing: priority.high<br/>priority.critical]
        STQ[notifications<br/>Routing: priority.medium<br/>priority.low]
        RTQ[retry<br/>Routing: retry.*<br/>Delayed Messages]
        DLQ[notifications_dlq<br/>Routing: dlq.*<br/>Manual Review]
    end

    subgraph "Workers"
        W1[Worker Pool]
        W2[Worker Pool]
        W3[Worker Pool]
    end

    API -->|Publish with<br/>routing key| EX

    EX -->|priority.critical<br/>priority.high| HPQ
    EX -->|priority.medium<br/>priority.low| STQ
    EX -->|retry.*| RTQ
    EX -->|dlq.*| DLQ

    HPQ -->|Prefetch: 10| W1
    STQ -->|Prefetch: 10| W1
    RTQ -->|Prefetch: 10| W1

    HPQ -->|Prefetch: 10| W2
    STQ -->|Prefetch: 10| W2
    RTQ -->|Prefetch: 10| W2

    HPQ -->|Prefetch: 10| W3
    STQ -->|Prefetch: 10| W3
    RTQ -->|Prefetch: 10| W3

    W1 -->|Failed:<br/>Retry or DLQ| EX
    W2 -->|Failed:<br/>Retry or DLQ| EX
    W3 -->|Failed:<br/>Retry or DLQ| EX

    style HPQ fill:#ff6b6b
    style STQ fill:#4dabf7
    style RTQ fill:#ffd43b
    style DLQ fill:#868e96
```

## Scaling Strategy Diagram

```mermaid
graph TB
    subgraph "Load: 0-50K/min (Normal)"
        N1[5 API Servers]
        N2[50 Workers]
        N3[1 MongoDB Replica Set]
        N4[1 RabbitMQ Cluster]
        N5[Queue Depth: < 1000]

        N1 --- N2
        N2 --- N3
        N3 --- N4
        N4 --- N5
    end

    subgraph "Load: 50K-100K/min (Elevated)"
        E1[10 API Servers]
        E2[100 Workers]
        E3[1 MongoDB Replica Set<br/>+ 2 Read Replicas]
        E4[1 RabbitMQ Cluster<br/>3 nodes]
        E5[Queue Depth: 1000-5000]
        E6[Redis Cache Enabled]

        E1 --- E2
        E2 --- E3
        E3 --- E4
        E4 --- E5
        E5 --- E6
    end

    subgraph "Load: 100K-200K/min (High)"
        H1[20 API Servers]
        H2[200 Workers]
        H3[Sharded MongoDB<br/>3 shards + replicas]
        H4[RabbitMQ Cluster<br/>5 nodes + partitioned queues]
        H5[Queue Depth: 5000-20000]
        H6[Redis Cache + CDN]
        H7[Multi-Provider Strategy]

        H1 --- H2
        H2 --- H3
        H3 --- H4
        H4 --- H5
        H5 --- H6
        H6 --- H7
    end

    subgraph "Load: 200K+/min (Extreme)"
        X1[50+ API Servers]
        X2[300+ Workers]
        X3[Sharded MongoDB<br/>Auto-scaling]
        X4[RabbitMQ Federation<br/>Multi-region]
        X5[Priority Queue Only]
        X6[Aggressive Rate Limiting]
        X7[Provider Batching]

        X1 --- X2
        X2 --- X3
        X3 --- X4
        X4 --- X5
        X5 --- X6
        X6 --- X7
    end

    N5 -->|Auto-Scale| E5
    E5 -->|Auto-Scale| H5
    H5 -->|Emergency Scale| X5

    style N5 fill:#51cf66
    style E5 fill:#ffd43b
    style H5 fill:#ff922b
    style X5 fill:#ff6b6b
```

## Circuit Breaker State Machine

```mermaid
stateDiagram-v2
    [*] --> Closed: Initial State

    Closed --> Open: Failure Threshold Reached<br/>(10 consecutive failures)
    Closed --> Closed: Success /<br/>Failure < Threshold

    Open --> HalfOpen: Timeout Elapsed<br/>(30 seconds)
    Open --> Open: All Requests Rejected<br/>Fast Fail

    HalfOpen --> Closed: Success
    HalfOpen --> Open: Failure

    note right of Closed
        Normal Operation
        - Allow all requests
        - Track failure count
        - Reset on success
    end note

    note right of Open
        Circuit Tripped
        - Reject all requests
        - Return error immediately
        - Wait for timeout
    end note

    note right of HalfOpen
        Testing Recovery
        - Allow single request
        - Success → Closed
        - Failure → Open
    end note
```

## Retry Logic Flow

```mermaid
flowchart TD
    START([Worker Receives Message])

    START --> PROCESS[Update Status: PROCESSING]
    PROCESS --> PROVIDER[Call Provider API]

    PROVIDER --> SUCCESS{Success?}

    SUCCESS -->|Yes| UPDATE_SENT[Update Status: SENT<br/>Save sentAt, processingTime<br/>Save providerMessageId]
    UPDATE_SENT --> LOG_SENT[Create Audit Log: SENT]
    LOG_SENT --> ACK[ACK Message]
    ACK --> END1([Complete])

    SUCCESS -->|No| CHECK_RETRY{retryCount < maxRetries?}

    CHECK_RETRY -->|Yes| INCREMENT[Increment retryCount]
    INCREMENT --> UPDATE_RETRY[Update Status: RETRYING]
    UPDATE_RETRY --> LOG_RETRY[Create Audit Log: RETRYING]
    LOG_RETRY --> CALC_DELAY[Calculate Delay<br/>delay = 5^retryCount seconds]
    CALC_DELAY --> PUBLISH_RETRY[Publish to Retry Queue<br/>with x-delay header]
    PUBLISH_RETRY --> ACK2[ACK Original Message]
    ACK2 --> END2([Queued for Retry])

    CHECK_RETRY -->|No| UPDATE_FAILED[Update Status: FAILED<br/>Save failedAt, error]
    UPDATE_FAILED --> LOG_FAILED[Create Audit Log: FAILED]
    LOG_FAILED --> PUBLISH_DLQ[Publish to DLQ]
    PUBLISH_DLQ --> ACK3[ACK Original Message]
    ACK3 --> ALERT[Trigger Alert]
    ALERT --> END3([Moved to DLQ])

    style SUCCESS fill:#ffd43b
    style UPDATE_SENT fill:#51cf66
    style UPDATE_FAILED fill:#ff6b6b
    style UPDATE_RETRY fill:#ff922b
    style PUBLISH_DLQ fill:#868e96
```

## Monitoring Dashboard Layout

```mermaid
graph TB
    subgraph "Real-Time Metrics Dashboard"
        subgraph "Row 1: System Health"
            M1[API Status<br/>UP/DOWN]
            M2[Database Status<br/>Connected/Disconnected]
            M3[Queue Status<br/>Connected/Disconnected]
            M4[Success Rate<br/>96.5%]
        end

        subgraph "Row 2: Throughput"
            M5[Notifications/min<br/>Line Chart<br/>Last 1 hour]
            M6[Queue Depth<br/>Line Chart<br/>All Queues]
        end

        subgraph "Row 3: Notifications by Status"
            M7[Pending<br/>100]
            M8[Queued<br/>500]
            M9[Processing<br/>50]
            M10[Sent<br/>48000]
            M11[Failed<br/>1200]
            M12[Retrying<br/>150]
        end

        subgraph "Row 4: Performance"
            M13[Avg Processing Time<br/>187ms]
            M14[p95 Latency<br/>450ms]
            M15[p99 Latency<br/>850ms]
            M16[Error Rate<br/>2.4%]
        end

        subgraph "Row 5: Distribution"
            M17[By Type<br/>Pie Chart<br/>Email/SMS/Push]
            M18[By Priority<br/>Bar Chart<br/>Low/Med/High/Critical]
            M19[Top Errors<br/>Table<br/>Last 100]
        end
    end

    style M1 fill:#51cf66
    style M2 fill:#51cf66
    style M3 fill:#51cf66
    style M4 fill:#ffd43b
```

## Deployment Architecture (Production)

```mermaid
graph TB
    subgraph "Internet"
        USERS[Users/Clients]
    end

    subgraph "CDN Layer"
        CF[CloudFlare CDN<br/>Static Assets<br/>DDoS Protection]
    end

    subgraph "Load Balancer"
        ALB[Application Load Balancer<br/>AWS ALB / nginx]
    end

    subgraph "Kubernetes Cluster"
        subgraph "Frontend Pods"
            FE1[Frontend Pod 1<br/>React App]
            FE2[Frontend Pod 2<br/>React App]
            FE3[Frontend Pod N<br/>React App]
        end

        subgraph "Backend Pods"
            BE1[API Pod 1<br/>Express Server]
            BE2[API Pod 2<br/>Express Server]
            BE3[API Pod N<br/>Express Server]
        end

        subgraph "Worker Pods"
            WK1[Worker Pod 1<br/>Queue Consumer]
            WK2[Worker Pod 2<br/>Queue Consumer]
            WK3[Worker Pod N<br/>Queue Consumer]
        end

        subgraph "Autoscaler"
            HPA[Horizontal Pod Autoscaler<br/>CPU/Queue-based]
        end
    end

    subgraph "Data Layer (AWS/Cloud)"
        MONGO[MongoDB Atlas<br/>M30 Cluster<br/>3-node Replica Set]
        RABBIT[RabbitMQ Cloud<br/>3-node Cluster<br/>High Availability]
        REDIS[Redis ElastiCache<br/>Caching Layer]
    end

    subgraph "Observability"
        PROM[Prometheus<br/>Metrics Collection]
        GRAF[Grafana<br/>Dashboards]
        ELK[ELK Stack<br/>Log Aggregation]
    end

    USERS --> CF
    CF --> ALB
    ALB --> FE1
    ALB --> FE2
    ALB --> FE3

    FE1 --> ALB
    FE2 --> ALB
    FE3 --> ALB

    ALB --> BE1
    ALB --> BE2
    ALB --> BE3

    BE1 --> MONGO
    BE1 --> RABBIT
    BE1 --> REDIS

    BE2 --> MONGO
    BE2 --> RABBIT
    BE2 --> REDIS

    BE3 --> MONGO
    BE3 --> RABBIT
    BE3 --> REDIS

    WK1 --> RABBIT
    WK1 --> MONGO

    WK2 --> RABBIT
    WK2 --> MONGO

    WK3 --> RABBIT
    WK3 --> MONGO

    HPA -.->|Scale| BE1
    HPA -.->|Scale| BE2
    HPA -.->|Scale| BE3
    HPA -.->|Scale| WK1
    HPA -.->|Scale| WK2
    HPA -.->|Scale| WK3

    BE1 -.->|Metrics| PROM
    BE2 -.->|Metrics| PROM
    BE3 -.->|Metrics| PROM
    WK1 -.->|Metrics| PROM
    WK2 -.->|Metrics| PROM
    WK3 -.->|Metrics| PROM

    PROM --> GRAF

    BE1 -.->|Logs| ELK
    BE2 -.->|Logs| ELK
    BE3 -.->|Logs| ELK
    WK1 -.->|Logs| ELK
    WK2 -.->|Logs| ELK
    WK3 -.->|Logs| ELK

    style CF fill:#4dabf7
    style ALB fill:#4dabf7
    style MONGO fill:#51cf66
    style RABBIT fill:#ffd43b
    style REDIS fill:#ff6b6b
    style PROM fill:#f3e5f5
    style GRAF fill:#f3e5f5
    style ELK fill:#f3e5f5
```

## Cost Optimization Strategy

```mermaid
graph LR
    subgraph "Development"
        D1[Local Docker<br/>MongoDB + RabbitMQ<br/>Cost: $0]
        D2[1 API Server<br/>1 Worker<br/>Cost: $0]
        D3[Total: $0/month]

        D1 --- D2
        D2 --- D3
    end

    subgraph "Staging"
        S1[MongoDB Atlas M10<br/>Shared Cluster<br/>Cost: $57]
        S2[CloudAMQP Rabbit<br/>Lemur Plan<br/>Cost: $0]
        S3[2 API Servers<br/>t3.small<br/>Cost: $30]
        S4[2 Workers<br/>t3.small<br/>Cost: $30]
        S5[Total: $117/month]

        S1 --- S2
        S2 --- S3
        S3 --- S4
        S4 --- S5
    end

    subgraph "Production (50K/min)"
        P1[MongoDB Atlas M30<br/>3-node Replica<br/>Cost: $390]
        P2[CloudAMQP Rabbit<br/>Tiger Plan<br/>Cost: $119]
        P3[10 API Servers<br/>t3.medium<br/>Cost: $370]
        P4[50 Workers<br/>t3.small<br/>Cost: $750]
        P5[Redis ElastiCache<br/>cache.t3.micro<br/>Cost: $12]
        P6[Load Balancer<br/>Application LB<br/>Cost: $23]
        P7[Total: $1,664/month]

        P1 --- P2
        P2 --- P3
        P3 --- P4
        P4 --- P5
        P5 --- P6
        P6 --- P7
    end

    style D3 fill:#51cf66
    style S5 fill:#ffd43b
    style P7 fill:#ff922b
```

---

## Additional Resources

- **Main Documentation:** [README.md](README.md)
- **Frontend Setup:** [frontend/FRONTEND_SETUP.md](frontend/FRONTEND_SETUP.md)
- **API Documentation:** See README.md API section
- **Deployment Guide:** See README.md Getting Started section

---

**Architecture designed for scale, reliability, and observability**
