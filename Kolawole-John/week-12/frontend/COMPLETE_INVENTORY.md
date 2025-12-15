wavecom-notifications/
│
├── README.md # Complete architecture & design defense
├── QUICKSTART.md # PowerShell setup guide
├── docker-compose.yml # MongoDB + RabbitMQ services
│
├── backend/ # Node.js + Express + TypeScript
│ ├── src/
│ │ ├── config/
│ │ │ ├── database.ts # MongoDB connection with retry
│ │ │ ├── rabbitmq.ts # RabbitMQ connection manager
│ │ │ └── logger.ts # Winston logging setup
│ │ │
│ │ ├── models/
│ │ │ ├── Notification.ts # Main notification schema
│ │ │ └── NotificationLog.ts # Audit log schema
│ │ │
│ │ ├── services/
│ │ │ ├── notification/
│ │ │ │ └── NotificationService.ts # Core business logic
│ │ │ ├── queue/
│ │ │ │ └── QueueService.ts # RabbitMQ operations
│ │ │ ├── retry/
│ │ │ │ └── RetryService.ts # Exponential backoff
│ │ │ └── provider/
│ │ │ ├── EmailProvider.ts # Mock email with circuit breaker
│ │ │ ├── SMSProvider.ts # Mock SMS with circuit breaker
│ │ │ └── PushProvider.ts # Mock push notifications
│ │ │
│ │ ├── middleware/
│ │ │ ├── errorHandler.ts # Global error handling
│ │ │ ├── rateLimiter.ts # Rate limiting (100 req/min)
│ │ │ └── validator.ts # Joi validation schemas
│ │ │
│ │ ├── controllers/
│ │ │ └── notificationController.ts # HTTP request handlers
│ │ │
│ │ ├── routes/
│ │ │ └── notificationRoutes.ts # API route definitions
│ │ │
│ │ ├── workers/
│ │ │ └── notificationWorker.ts # Queue consumer process
│ │ │
│ │ ├── utils/
│ │ │ ├── constants.ts # App-wide constants
│ │ │ └── metrics.ts # Prometheus metrics
│ │ │
│ │ ├── types/
│ │ │ └── index.ts # TypeScript type definitions
│ │ │
│ │ └── server.ts # Main Express app entry point
│ │
│ ├── logs/ # Winston log files (auto-generated)
│ ├── package.json # Dependencies & scripts
│ ├── tsconfig.json # TypeScript configuration
│ ├── .env # Environment variables
│ ├── .env.example # Environment template
│ └── .gitignore # Git ignore rules
│
└── frontend/ # React + TypeScript + Vite
├── src/
│ ├── components/
│ │ ├── dashboard/ # Dashboard components
│ │ ├── notifications/ # Notification UI components
│ │ ├── charts/ # Chart components (Recharts)
│ │ └── layout/
│ │ └── Layout.tsx # Main layout wrapper
│ │
│ ├── pages/
│ │ ├── Dashboard.tsx # Main dashboard page
│ │ ├── NotificationCreate.tsx # Create notification form
│ │ └── NotificationStatus.tsx # Status detail page
│ │
│ ├── services/
│ │ └── api.ts # Axios API client
│ │
│ ├── hooks/
│ │ └── useNotifications.ts # Custom React hooks
│ │
│ ├── types/
│ │ └── notification.ts # Frontend type definitions
│ │
│ ├── utils/
│ │ └── constants.ts # Frontend constants
│ │
│ ├── App.tsx # Main App component
│ └── main.tsx # React entry point
│
├── public/ # Static assets
├── package.json # Frontend dependencies
├── tsconfig.json # TypeScript config
├── vite.config.ts # Vite bundler config
├── tailwind.config.js # Tailwind CSS config
├── .env # Frontend environment
└── .env.example # Environment template
