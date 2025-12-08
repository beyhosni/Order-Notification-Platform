# 🛒 Order & Notification Platform

A complete **microservices-based order and notification platform** built with modern technologies including Spring Boot, React, RabbitMQ, PostgreSQL, Docker, Kubernetes, and Terraform.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Local with Docker)](#quick-start-local-with-docker)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Terraform Infrastructure](#terraform-infrastructure)
- [Testing the Application](#testing-the-application)

## 🏗 Architecture

The platform consists of 6 microservices in a **polyglot architecture** communicating asynchronously via RabbitMQ:

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│   React     │────▶│   Gateway    │────▶│ Auth Service   │
│  Frontend   │     │   Service    │     │ (Flask/Python) │
└─────────────┘     │  (Java)      │     └────────────────┘
                    └──────────────┘              
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼──────┐  ┌──────▼─────┐  ┌──────▼──────┐
    │  Catalog   │  │ Inventory  │  │   Order     │
    │  Service   │  │  Service   │  │  Service    │
    │ (NestJS)   │  │  (Java)    │  │  (Java)     │
    └────────────┘  └─────┬──────┘  └──────┬──────┘
                          │                 │
                    ┌─────▼─────────────────▼─────┐
                    │       RabbitMQ              │
                    │  (Message Broker)           │
                    └─────────────┬───────────────┘
                                  │
                         ┌────────▼────────┐
                         │  Notification   │
                         │    Service      │
                         │    (Java)       │
                         └─────────────────┘
```

**Technology Stack:**
- **Auth Service**: Python 3.12 + Flask + SQLAlchemy
- **Catalog Service**: TypeScript + NestJS + TypeORM
- **Gateway/Inventory/Order/Notification**: Java 23 + Spring Boot

**Event Flow:**
1. User places order → `order.created` event published
2. Inventory service reserves stock
3. Payment processed → `order.paid` event published
4. Order shipped → `order.shipped` event published
5. Notification service sends notifications for all events

## 🚀 Technologies

### Backend Microservices
**Auth Service (Python/Flask)**:
- **Python 3.12** - Modern Python
- **Flask 3.0** - Lightweight framework
- **SQLAlchemy** - Python ORM
- **PyJWT** - JWT authentication
- **Bcrypt** - Password hashing
- **Flasgger** - Swagger documentation

**Catalog Service (TypeScript/NestJS)**:
- **TypeScript** - Type-safe JavaScript
- **NestJS 10** - Progressive Node.js framework
- **TypeORM** - TypeScript ORM
- **class-validator** - Validation
- **Swagger** - API documentation

**Inventory/Order/Notification Services (Java/Spring Boot)**:
- **Java 23** - Latest Java features
- **Spring Boot 3.2** - Microservices framework
- **Spring Cloud Gateway** - API Gateway
- **Spring Security + JWT** - Authentication
- **Spring AMQP** - RabbitMQ integration
- **PostgreSQL** - Relational database
- **RabbitMQ** - Message broker

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local orchestration
- **Kubernetes** - Production orchestration
- **Terraform** - Infrastructure as Code
- **Helm** - Kubernetes package manager

## 📁 Project Structure

```
Order-Notification-Platform/
├── backend/
│   ├── shared-lib/              # Shared events and DTOs (Java)
│   ├── gateway-service/         # API Gateway (Java - Port 8080)
│   ├── auth-service-flask/      # Authentication (Python/Flask - Port 8081) ⭐ NEW
│   ├── catalog-service-nestjs/  # Product Catalog (TypeScript/NestJS - Port 8082) ⭐ NEW
│   ├── inventory-service/       # Stock Management (Java - Port 8083)
│   ├── order-service/           # Order Management (Java - Port 8084)
│   ├── notification-service/    # Notifications (Java - Port 8085)
│   ├── auth-service/            # [Archived] Original Java version
│   └── catalog-service/         # [Archived] Original Java version
├── frontend/
│   └── react-app/               # React Frontend (Port 3000)
├── infrastructure/
│   ├── docker/
│   │   └── docker-compose.yml   # Local deployment
│   ├── kubernetes/              # K8s manifests
│   └── terraform/               # Infrastructure provisioning
├── README.md
├── MIGRATION.md                 # ⭐ Migration guide for new services
└── QUICK_START.md
```

## ✅ Prerequisites

### For Local Development (Docker)
- Docker Desktop 20.10+
- Docker Compose 2.0+
- Maven 3.8+ (for local builds)
- Java 23 JDK (for local builds)
- Node.js 18+ (for frontend development)

### For Kubernetes Deployment
- kubectl 1.27+
- Helm 3.12+
- Kubernetes cluster (minikube, kind, or cloud provider)

### For Terraform
- Terraform 1.0+
- Configured kubectl access to cluster

## 🚢 Quick Start (Local with Docker)

### 1. Clone and Navigate
```powershell
cd Order-Notification-Platform
```

### 2. Build Backend Services (Optional - Docker will build automatically)
```powershell
cd backend
# Build shared library first
cd shared-lib
mvn clean install
cd ..

# Build all services
$services = @("gateway-service", "auth-service", "catalog-service", "inventory-service", "order-service", "notification-service")
foreach ($service in $services) {
    cd $service
    mvn clean package -DskipTests
    cd ..
}
cd ..
```

### 3. Start All Services with Docker Compose
```powershell
cd infrastructure\docker
docker-compose up -d
```

**Wait for services to start** (check logs):
```powershell
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### 5. Initialize Test Data (Optional)
Create a sample product via Catalog Service:
```powershell
curl -X POST http://localhost:8082/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Sample Product",
    "description": "A great product",
    "price": 29.99,
    "category": "Electronics"
  }'
```

Create inventory for the product:
```powershell
curl -X POST http://localhost:8083/api/inventory `
  -H "Content-Type: application/json" `
  -d '{
    "productId": "<product-id-from-above>",
    "quantity": 100,
    "reserved": 0
  }'
```

### 6. Test the Flow
1. Open http://localhost:3000
2. Register a new account
3. Browse products
4. Add products to cart
5. Place an order
6. Check RabbitMQ management UI to see events
7. Check notification service logs for notifications

### 7. Stop Services
```powershell
docker-compose down
```

## ☸️ Kubernetes Deployment

### 1. Build and Push Docker Images
```powershell
# Set your registry
$REGISTRY="your-docker-registry"

# Build and push all services
$services = @("gateway-service", "auth-service", "catalog-service", "inventory-service", "order-service", "notification-service")
foreach ($service in $services) {
    docker build -t ${REGISTRY}/${service}:latest ./backend/$service
    docker push ${REGISTRY}/${service}:latest
}

# Build and push frontend
docker build -t ${REGISTRY}/frontend:latest ./frontend/react-app
docker push ${REGISTRY}/frontend:latest
```

### 2. Update Kubernetes Manifests
Update image references in `infrastructure/kubernetes/*.yaml` files with your registry.

### 3. Deploy to Kubernetes
```powershell
cd infrastructure\kubernetes

# Create namespace
kubectl apply -f namespace.yaml

# Create secrets and ConfigMap
kubectl apply -f secrets.yaml
kubectl apply -f configmap.yaml

# Deploy databases and messaging
kubectl apply -f postgres.yaml
kubectl apply -f rabbitmq.yaml

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n order-platform --timeout=300s
kubectl wait --for=condition=ready pod -l app=rabbitmq -n order-platform --timeout=300s

# Deploy microservices
kubectl apply -f gateway-service.yaml
# Apply other service manifests...

# Check deployments
kubectl get all -n order-platform
```

### 4. Access the Application
```powershell
# Get gateway service external IP
kubectl get svc gateway-service -n order-platform
```

Visit the external IP in your browser.

## 🏗️ Terraform Infrastructure

### 1. Configure Variables
```powershell
cd infrastructure\terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 2. Initialize Terraform
```powershell
terraform init
```

### 3. Plan Infrastructure
```powershell
terraform plan
```

### 4. Apply Infrastructure
```powershell
terraform apply
```

This will provision:
- Kubernetes namespace
- PostgreSQL via Helm
- RabbitMQ via Helm
- ConfigMaps and Secrets

### 5. Get Outputs
```powershell
terraform output
```

## 🧪 Testing the Application

### Register and Login
1. Go to http://localhost:3000
2. Click "Register"
3. Create an account
4. Login with your credentials

### Place an Order
1. View products in the catalog
2. Add products to cart
3. Click "Place Order"
4. Check "My Orders" to see order status

### Monitor Events
1. Open RabbitMQ Management UI: http://localhost:15672
2. Go to "Queues" tab
3. See messages in:
   - `inventory-queue` (order.created events)
   - `notification-order-created`
   - `notification-order-paid`
   - `notification-order-shipped`

### Check Logs
```powershell
# Notification service logs (see notifications)
docker-compose logs -f notification-service

# Order service logs (see event publishing)
docker-compose logs -f order-service

# All services
docker-compose logs -f
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?query=...` - Search products

### Order Endpoints (Requires Auth)
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get user's orders

### Inventory Endpoints (Requires Auth)
- `GET /api/inventory` - Get all inventory
- `GET /api/inventory/{productId}` - Get inventory for product

## 🛠️ Development

### Backend
```powershell
# Run service locally
cd backend\auth-service
mvn spring-boot:run
```

### Frontend
```powershell
cd frontend\react-app
npm install
npm run dev
```

## 📝 License

This project is created for educational purposes.

## 🤝 Contributing

This is a demonstration project showcasing microservices architecture.

---

**Built with ❤️ using Spring Boot, React, RabbitMQ, and Kubernetes**
