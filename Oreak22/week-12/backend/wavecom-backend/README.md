# WaveCom Notification Delivery System

## Overview

WaveCom accepts notification requests from clients and reliably delivers
messages through provider integrations. Goals:

-   Handle spikes up to **50,000 notifications/min**.
-   Ensure durability (no lost messages).
-   Implement retries, backoff, and provider failover.
-   Provide observability and job status via a small frontend/dashboard.

## Architecture Diagram

    ┌──────────────┐    HTTPS     ┌────────────────┐     (writes)
    │  Clients /   │ ───────────> │  API Gateway   │ ───────────────┐
    │  Dashboard   │              │  (Express.js)  │                │
    └──────────────┘              └────────────────┘                │
            ▲                             │                         ▼
            │                             │                ┌────────────────┐
            │                             │                │   MongoDB      │
            │                             │                │ (Jobs + Logs)  │
            │                             │                └────────────────┘
            │                             │                          ▲
            │                             │ publishes jobId          │
            │                             ▼                          │
            │                      ┌────────────┐                    │
            │                      │  RabbitMQ  │────────────────────┘
            │                      │ (Durable)  │
            │                      └────────────┘
            │                             │
            │                             ▼
            │                   ┌─────────────────────┐
            │                   │   Worker Pool       │
            │                   │ (stateless containers│
            │                   │  or processes)      │
            │                   └─────────────────────┘
            │                             │
            │                             ▼
            │               ┌─────────────────────────────┐
            │               │ Provider Dispatcher / Gate  │
            │               │  ├→ Provider A (SendGrid)   │
            │               │  └→ Provider B (Twilio/SES) │
            │               └─────────────────────────────┘
            │                             │
            │                             ▼
            │                   External Provider Networks

## Components & Responsibilities

-   **API (Express/Node.js)** -- Ingests notifications, persists jobs,
    publishes to queue.
-   **MongoDB** -- Stores job documents, logs, metadata.
-   **RabbitMQ** -- Durable message broker handling decoupled job
    processing.
-   **Workers** -- Stateless processors that dispatch through providers.
-   **Provider Dispatcher** -- Handles provider failover, retries,
    idempotency.
-   **Frontend Dashboard** -- React dashboard to send and track
    notifications.

## Queueing Model & Retry Flow

1.  API stores job in MongoDB → `status=queued`
2.  Publishes `{ jobId }` to RabbitMQ (durable)
3.  Worker consumes, sets `processing`
4.  Dispatch to provider
5.  On success → `delivered`
6.  On failure → log + retry (exponential backoff)
7.  On max failures → DLQ and mark `failed`

## API Design

### POST /api/notifications

Creates a new job.

### GET /api/notifications/:jobId

Fetch job details + logs.

### GET /api/notifications

List jobs with filters.

## Database Schema

### jobs collection

``` json
{
  "_id": "ObjectId",
  "jobId": "uuid",
  "type": "email|sms|push",
  "to": {},
  "payload": {},
  "status": "queued|processing|delivered|failed",
  "attempts": 0,
  "maxAttempts": 5,
  "logs": [],
  "metadata": {},
  "createdAt": "",
  "updatedAt": ""
}
```

## Scaling Strategy

-   Horizontal API scaling
-   Worker autoscaling based on queue depth
-   RabbitMQ clustering
-   MongoDB replica set + sharding
-   Provider failover
-   Connection pooling + batching

## Fault Tolerance Strategy

-   Durable queues
-   Manual ack/nack
-   Dead-letter queues
-   Retry with exponential backoff
-   Provider circuit breakers
-   Database replication
-   Health checks

# Design Defense

## Why this architecture?

This architecture follows scalable distributed principles---decoupling
the API from workers via RabbitMQ, ensuring durable messaging, and
enabling independent horizontal scaling of all components. Stateless
workers and provider failover allow resilient message processing similar
to enterprise-grade notification platforms.

## How will it handle 50,000 notifications/min?

The system handles this because: - RabbitMQ absorbs
high ingestion spikes - Horizontal worker scaling allows parallel
processing - Providers support high throughput with concurrent
connections - API remains non-blocking (work pushed to queue) - Workers
scale based on queue depth and CPU usage

## How does your system degrade gracefully under load?

-   Queue absorbs overflow instead of dropping jobs\
-   Workers autoscale\
-   Retry with exponential backoff & jitter\
-   Circuit breakers prevent failing providers from cascading issues\
-   API returns 202 instead of failing requests\
-   DLQ isolates long-term failing jobs

## Potential bottlenecks and mitigations

  ------------------------------------------------------------------------
  Bottleneck                Cause              Mitigation
  ------------------------- ------------------ ---------------------------
  RabbitMQ saturation       Spike overload     Clustering, queue
                                               partitioning, lazy queues

  Worker CPU exhaustion     Heavy loads        Autoscaling, batching

  Provider rate limits      External           Provider failover, circuit
                            throttling         breakers

  MongoDB write pressure    Too many updates   Sharding, separate logs
                                               collection

  Network latency           Provider region    Regional workers,
                            mismatch           keep-alive connections
  ------------------------------------------------------------------------
