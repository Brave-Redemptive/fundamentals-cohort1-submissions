# legacybridge-backend

Modern API layer for integrating legacy systems with a scalable Node.js microservice architecture.

LegacyBridge Backend provides an abstraction layer over an older banking/financial system, enabling reliable data transformation, caching, retries, and consistent API responses across multiple versions (v1 & v2).

## Features

==> API Versioning

V1 & V2 routes with different transformation logic.

Ensures backward compatibility with legacy consumers.

==> Data Transformation Service

Normalizes inconsistent legacy responses.

Applies unified schema before returning to the client.

## FOLDER STRUCTURE

legacybridge-backend/
├── .github/workflows/ci.yml
├── docker-compose.yml (optional)
├── Dockerfile
├── package.json
├── tsconfig.json
├── jest.config.ts
├── src/
│ ├── index.ts
│ ├── server.ts
│ ├── config/
│ │ └── index.ts
│ ├── routes/
│ │ ├── v1/
│ │ │ └── customers.ts
│ │ └── v2/
│ │ └── customers.ts
│ ├── controllers/
│ │ └── customersController.ts
│ ├── services/
│ │ ├── legacyClient.ts
│ │ ├── transform.ts
│ │ └── retryHttp.ts
│ ├── cache/
│ │ ├── redisCache.ts
│ │ └── memoryCache.ts
│ ├── middlewares/
│ │ └── errorHandler.ts
│ ├── utils/
│ │ └── logger.ts
│ └── tests/
│ ├── transform.test.ts
│ └── legacyClient.test.ts
├── postman_collection.json
└── README.md

## Tech Stacks

| Layer             | Technology                 |
| ----------------- | -------------------------- |
| Backend Framework | Node.js + Express          |
| Language          | TypeScript                 |
| Cache             | Redis / In-memory          |
| Testing           | Jest                       |
| Containerization  | Docker & Docker Compose    |
| CI/CD             | GitHub Actions             |
| HTTP Client       | Axios (with retry wrapper) |

## Required Variables

| Key              | Description          | Example                     |
| ---------------- | -------------------- | --------------------------- |
| `PORT`           | API port             | `5000`                      |
| `REDIS_URL`      | Redis connection URL | `redis://localhost:6379`    |
| `CACHE_DRIVER`   | `redis` or `memory`  | `memory`                    |
| `LEGACY_API_URL` | Legacy upstream URL  | `https://legacy-system/api` |

## Setup

1. `cp .env.example .env` and fill values
2. `npm ci`
3. `npm run dev`

## Postman Collection

A full Postman collection is included in:

==> postman_collection.json

Import it into Postman to view all routes with sample requests.

## Testing

Run all tests:
npm test

## License

MIT License — feel free to use and modify.

## En
