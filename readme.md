# Inventory Management

![License](https://img.shields.io/github/license/samuelfsilva/inventory-management)
![Last Commit](https://img.shields.io/github/last-commit/samuelfsilva/inventory-management)

A modern full-stack inventory management system built with TypeScript, Express, SQL Server, and Next.js.

<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/7656/7656399.png" alt="Inventory Management System" width="300" height="300" />
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
- API: http://localhost:3333
- API Docs: http://localhost:3333/doc

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
│   │   ├── database/      # DB connections & migrations
│   │   ├── entities/      # TypeORM entities
│   │   ├── middleware/    # Middleware
│   │   ├── migration/     # TypeORM migrations
│   │   ├── routes/        # API routes
│   │   ├── schema/        # Joi validation schemas
│   │   ├── test/          # Unit tests
│   │   ├── index.ts       # Entry point
│   │   ├── server.ts      # Express server
│   │   ├── swagger.ts     # Swagger setup
│   │   └── vite.config.ts # Vite configuration
├── database/           # SQL Server setup
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/        # Main
│   │   ├── components/ # UI components
│   │   ├── pages/      # Pages
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
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3333

# Backend
API_PORT=3333
FRONTEND_URLS=http://localhost:3000

# Database
DB_HOST=sqlserver
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrongPassword
DB_DATABASE=inventory

# Docker
DOCKER_FRONTEND_PORT=3000
```

## 📌 API Endpoints

| Method | Endpoint                                     | Description                         |
| ------ | -------------------------------------------- | ----------------------------------- |
| GET    | /batch                                       | Get all batchs                      |
| GET    | /batch/:id                                   | Get batch by ID                     |
| POST   | /batch                                       | Create a batch                      |
| PUT    | /batch/:id                                   | Update a batch                      |
| DELETE | /batch/:id                                   | Delete a batch                      |
| GET    | /category                                    | Get all categories                  |
| GET    | /category/:id                                | Get category by ID                  |
| POST   | /category                                    | Create a category                   |
| PUT    | /category/:id                                | Update a category                   |
| DELETE | /category/:id                                | Delete a category                   |
| GET    | /deposit                                     | Get all deposits                    |
| GET    | /deposit/:id                                 | Get deposit by ID                   |
| POST   | /deposit                                     | Create a deposit                    |
| PUT    | /deposit/:id                                 | Update a deposit                    |
| DELETE | /deposit/:id                                 | Delete a deposit                    |
| GET    | /group                                       | Get all groups                      |
| GET    | /group/:id                                   | Get group by ID                     |
| GET    | /group/:id/products                          | Get products of the group by ID     |
| GET    | /group/description/:description              | Get group by description            |
| GET    | /group/description-like/:description         | Get groups with similar description |
| POST   | /group                                       | Create a group                      |
| PUT    | /group/:id                                   | Update a group                      |
| DELETE | /group/:id                                   | Delete a group                      |
| GET    | /moment_item                                 | Get all moment items                |
| GET    | /moment_item/:id                             | Get moment item by ID               |
| POST   | /moment_item                                 | Create a moment item                |
| PUT    | /moment_item/:id                             | Update a moment item                |
| DELETE | /moment_item/:id                             | Delete a moment item                |
| GET    | /movement                                    | Get all movements                   |
| GET    | /movement/active                             | Get all active movements            |
| GET    | /movement/:id                                | Get movement by ID                  |
| GET    | /movement/:id/items                          | Get items of the movement by ID     |
| GET    | /movement/movementDate/:movementDate         | Get movements by date               |
| GET    | /movement/movementPeriod/:startDate/:endDate | Get movements within a period       |
| POST   | /movement                                    | Create a movement                   |
| PUT    | /movement/:id                                | Update a movement                   |
| DELETE | /movement/:id                                | Delete a movement                   |
| GET    | /product                                     | Get all products                    |
| GET    | /product/:id                                 | Get product by ID                   |
| GET    | /product/active                              | Get all active products             |
| POST   | /product                                     | Create a product                    |
| PUT    | /product/:id                                 | Update a product                    |
| DELETE | /product/:id                                 | Delete a product                    |
| GET    | /stock                                       | Get all stock                       |
| GET    | /stock/active                                | Get all active stock                |
| GET    | /stock/:id                                   | Get stock by ID                     |
| GET    | /stock/batch/:id                             | Get stock by batch ID               |
| GET    | /stock/deposit/:id                           | Get stock by deposit ID             |
| GET    | /stock/product/:id                           | Get stock by product ID             |
| POST   | /stock                                       | Create a stock                      |
| PUT    | /stock/:id                                   | Update a stock                      |
| DELETE | /stock/:id                                   | Delete a stock                      |
| GET    | /user                                        | Get all users                       |
| GET    | /user/:id                                    | Get user by ID                      |
| GET    | /user/firstName/:firstName                   | Get user by first name              |
| GET    | /user/active                                 | Get all active users                |
| POST   | /user                                        | Create a user                       |
| PUT    | /user/:id                                    | Update a user                       |
| DELETE | /user/:id                                    | Delete a user                       |

Full API documentation is available at `/doc` when running the application.

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
