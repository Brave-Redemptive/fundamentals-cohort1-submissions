# PayVerse Backend

This backend demonstrates three architectural trade-offs:

1. SQL vs NoSQL → SQL chosen for ACID guarantees.
2. REST vs gRPC → REST chosen for developer velocity & compatibility.
3. WebSockets vs SSE → SSE chosen for simplicity & unidirectional notifications.

## Tech Stack
- Node.js + Express
- PostgreSQL
- Docker Compose
- Server-Sent Events (SSE)

## Run Locally

1. Copy environment file:
   cp .env.example .env

2. Start containers:
   docker-compose up --build

3. Apply migrations:
   psql -h localhost -p 5433 -U postgres -f src/db/migrations.sql

4. Start API:
   npm run dev

## Endpoints

### Create Payment
POST /payments
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 50
}

### Get Payment
GET /payments/:id

### SSE Stream
GET /events/stream

## Postman Collection
Located at:
`docs/postman_collection.json`
