# LegacyBridge - Backend

Integration service that connects a legacy payment API to modern microservices.

## Features

- Node.js + Express + TypeScript
- Mock legacy API included for local development
- Transformations for legacy payloads → modern `/v2` API
- API version negotiation (header / query / path)
- Retry logic (axios-retry) and timeout handling
- In-memory caching (NodeCache). Optional Redis notes included.
- Unit tests (Jest)
- Postman collection provided

## Quickstart

1. Clone / create project files
2. Install dependencies
   ```bash
   npm install
3. Copy .env.example to .env and adjust values if needed.
4. Start mock legacy server (in separate terminal): npm run mock
5. Start the backend: npm run dev
6. Test endpoints:

GET /v2/payments

GET /v2/payments/:id

GET /v2/customers

## Error handling and retries

Axios client uses axios-retry to reattempt transient network and 5xx failures up to 3 times with exponential backoff.

All errors flow through a central errorHandler middleware.

## Testing
Run unit tests: npm test

