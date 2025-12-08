# Catalog Service - NestJS Version

## 🚀 Description

Product Catalog Management Service built with **NestJS**, **TypeScript**, and **PostgreSQL**. This is a modern rewrite of the Java Spring Boot catalog-service.

## 🛠️ Technologies

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Database
- **Swagger/OpenAPI** - API documentation
- **class-validator** - DTO validation

## 📋 Features

- ✅ Full CRUD operations for products
- ✅ Search products by name/description
- ✅ Filter products by category
- ✅ Input validation with class-validator
- ✅ Swagger UI documentation
- ✅ TypeORM with PostgreSQL
- ✅ Docker support
- ✅ Environment configuration

## 🏃 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL running on port 5432
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
```

### Running the app

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Access

- **API**: http://localhost:8082/api/products
- **Swagger UI**: http://localhost:8082/api-docs
- **Health**: http://localhost:8082

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/search?query=laptop` | Search products |
| GET | `/api/products/category/:category` | Get products by category |
| POST | `/api/products` | Create new product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

## 🐳 Docker

```bash
# Build image
docker build -t catalog-service-nestjs .

# Run container
docker run -p 8082:8082 \
  -e DB_HOST=postgres \
  -e DB_PASSWORD=postgres \
  catalog-service-nestjs
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
└── products/
    ├── products.module.ts       # Products module
    ├── products.controller.ts   # REST controller
    ├── products.service.ts      # Business logic
    ├── entities/
    │   └── product.entity.ts    # TypeORM entity
    └── dto/
        ├── create-product.dto.ts  # Create DTO
        └── update-product.dto.ts  # Update DTO
```

## 🔧 Configuration

Environment variables in `.env`:

```env
NODE_ENV=development
PORT=8082
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=catalogdb
```

## 📝 Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Watch mode
npm run start:dev
```

## 🌟 Comparison with Spring Boot Version

| Feature | Spring Boot | NestJS |
|---------|-------------|--------|
| Language | Java 23 | TypeScript |
| Framework | Spring Boot 3.2 | NestJS 10 |
| ORM | JPA/Hibernate | TypeORM |
| API Docs | SpringDoc | Swagger |
| Validation | Jakarta Validation | class-validator |
| Performance | ⚡⚡⚡ | ⚡⚡⚡⚡ |
| Dev Experience | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 📄 License

MIT
