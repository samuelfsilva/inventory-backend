# Inventory Management

![License](https://img.shields.io/github/license/samuelfsilva/inventory-management)
![Last Commit](https://img.shields.io/github/last-commit/samuelfsilva/inventory-management)

A modern full-stack inventory management system built with TypeScript, Express, SQL Server, and Next.js.

<p align="center">
  <img src="/api/placeholder/800/400" alt="Inventory Management System" />
</p>

## 🚀 Features

- ✅ Product management with real-time inventory tracking
- ✅ Category organization system
- ✅ User authentication and role-based access control
- ✅ Responsive Material UI interface
- ✅ Complete API documentation with Swagger
- ✅ Containerized with Docker for easy deployment

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: SQL Server
- **Documentation**: Swagger
- **Testing**: Vitest

### Frontend
- **Framework**: Next.js 15
- **UI Library**: Material UI 6
- **State Management**: React Hooks
- **API Client**: Axios

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Linting**: ESLint
- **Development**: Nodemon, TypeScript

## 📋 Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local development)

## 🔧 Installation

1. **Clone the repository**

```bash
git clone https://github.com/samuelfsilva/inventory-management.git
cd inventory-management
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

3. **Start with Docker**

```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:8080
- API Docs: http://localhost:8080/api-docs

## 💻 Development

### Backend

```bash
cd backend
npm install
npm run dev         # Start development server
npm run swagger     # Generate API docs
npm test           # Run tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Start development server
npm run build      # Build for production
```

### Database Migrations

```bash
# Generate migration
npm run homologation:migrate:generate ./src/database/migrations/MigrationName

# Apply migrations
npm run homologation:migrate

# Revert migrations
npm run homologation:migrate:revert
```

## 📊 Project Structure

```
inventory-management/
├── backend/            # Express API with TypeORM
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── database/    # DB connections & migrations
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   └── index.ts     # Entry point
├── database/           # SQL Server setup
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # UI components
│   │   ├── services/   # API services
│   │   └── utils/      # Utilities
├── .dockerignore
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
└── docker-compose.yml
```

## ⚙️ Environment Variables

```
# Docker Configuration
DOCKER_NODE_VERSION=latest
DOCKER_FRONTEND_PORT=3000

# Database Configuration
DB_HOST=sqlserver
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrongPassword
DB_DATABASE=inventory

# API Configuration
API_PORT=8080
FRONTEND_URLS=http://localhost:3000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/products | Get all products |
| GET    | /api/products/:id | Get product by ID |
| POST   | /api/products | Create a product |
| PUT    | /api/products/:id | Update a product |
| DELETE | /api/products/:id | Delete a product |
| GET    | /api/categories | Get all categories |
| GET    | /api/inventory | Get inventory status |

Full API documentation is available at `/api-docs` when running the application.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/)
- [Next.js](https://nextjs.org/)
- [TypeORM](https://typeorm.io/)
- [Material UI](https://mui.com/)
- [Docker](https://www.docker.com/)
