# 🧪 Tests - Order & Notification Platform

## Overview

Comprehensive test suite covering all microservices with unit tests, integration tests, and end-to-end tests.

## Test Coverage by Service

### 1. Auth Service (Flask/Python) ✅
**Framework**: pytest
**Coverage**: Unit + Integration

**Tests**:
- `test_models.py` - User model tests
  - Password hashing
  - User serialization
  - Database operations
  
- `test_routes.py` - API endpoint tests
  - Registration flow
  - Login flow
  - Validation
  - Error handling

**Run tests**:
```bash
cd backend/auth-service-flask
pip install -r requirements-test.txt
pytest --cov=app tests/
```

### 2. Catalog Service (NestJS/TypeScript) ✅
**Framework**: Jest + Supertest
**Coverage**: Unit + E2E

**Tests**:
- `products.service.spec.ts` - Service layer tests
  - CRUD operations
  - Search functionality
  - Error handling
  
- `products.e2e-spec.ts` - End-to-end tests
  - Full API workflows
  - Database integration
  - Validation

**Run tests**:
```bash
cd backend/catalog-service-nestjs
npm test                 # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage report
```

### 3. Order Service (Java/Spring Boot) ✅
**Framework**: JUnit 5 + Mockito
**Coverage**: Unit + Integration

**Tests**:
- `OrderServiceTest.java` - Business logic tests
  - Order creation
  - Order status updates
  - Total calculation
  - Event publishing

- `OrderControllerTest.java` - API tests
  - REST endpoints
  - Request validation
  - Response formats

**Run tests**:
```bash
cd backend/order-service
mvn test
mvn verify
```

### 4. Inventory Service (Java/Spring Boot) ✅
**Framework**: JUnit 5 + Mockito
**Coverage**: Unit

**Tests**:
- `InventoryServiceTest.java`
  - Stock reservation
  - Stock validation
  - Quantity checks

**Run tests**:
```bash
cd backend/inventory-service
mvn test
```

## Test Categories

### Unit Tests
- ✅ Models/Entities
- ✅ Services/Business Logic
- ✅ Utility functions
- ✅ Mocked dependencies

### Integration Tests
- ✅ Controllers with MockMvc
- ✅ API endpoints
- ✅ Database operations
- ✅ Request/Response validation

### E2E Tests
- ✅ Full service workflows
- ✅ Real database
- ✅ Complete request cycles

## Running All Tests

### Per Service
```bash
# Flask - Auth Service
cd backend/auth-service-flask && pytest

# NestJS - Catalog Service  
cd backend/catalog-service-nestjs && npm test

# Java - Order Service
cd backend/order-service && mvn test

# Java - Inventory Service
cd backend/inventory-service && mvn test
```

### Docker Test Environment
```bash
# Start test database
docker-compose -f infrastructure/docker/docker-compose-test.yml up -d

# Run tests
./run-all-tests.sh

# Cleanup
docker-compose -f infrastructure/docker/docker-compose-test.yml down
```

## Test Coverage Goals

| Service | Unit Tests | Integration Tests | Coverage % |
|---------|-----------|-------------------|------------|
| Auth (Flask) | ✅ | ✅ | 85%+ |
| Catalog (NestJS) | ✅ | ✅ | 80%+ |
| Order (Java) | ✅ | ✅ | 80%+ |
| Inventory (Java) | ✅ | ⚠️ | 75%+ |
| Notification (Java) | ⚠️ | ⚠️ | 60%+ |
| Gateway (Java) | ⚠️ | ⚠️ | 50%+ |

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test-flask:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
      - name: Run tests
        run: |
          cd backend/auth-service-flask
          pip install -r requirements.txt requirements-test.txt
          pytest --cov=app

  test-nestjs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node
        uses: actions/setup-node@v2
      - name: Run tests
        run: |
          cd backend/catalog-service-nestjs
          npm install
          npm test

  test-java:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK
        uses: actions/setup-java@v2
      - name: Run tests
        run: |
          cd backend/order-service
          mvn test
```

## Best Practices

### ✅ Do's
- Write tests before fixing bugs
- Mock external dependencies
- Test edge cases and error scenarios
- Keep tests isolated and independent
- Use descriptive test names
- Maintain high coverage (>80%)

### ❌ Don'ts
- Don't test framework code
- Don't make tests dependent on each other
- Don't use real external services in tests
- Don't ignore failing tests
- Don't write flaky tests

## Troubleshooting

### Common Issues

**Issue**: Tests fail due to database connection
**Solution**: Ensure test database is running or use in-memory database

**Issue**: Flaky tests with timing issues
**Solution**: Use proper waits and assertions, avoid sleep()

**Issue**: Import errors in Python tests
**Solution**: Check PYTHONPATH and install test dependencies

## Next Steps

- [ ] Add notification service tests
- [ ] Add gateway service tests
- [ ] Set up CI/CD pipeline
- [ ] Add performance tests
- [ ] Add security tests (OWASP)
- [ ] Add contract tests between services

---

**Tests ensure quality! 🧪✅**
