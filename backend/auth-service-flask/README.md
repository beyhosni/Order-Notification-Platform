# Auth Service - Flask Version

## 🚀 Description

Authentication and Authorization Service built with **Python**, **Flask**, and **PostgreSQL** with JWT token support. This is a modern rewrite of the Java Spring Boot auth-service.

## 🛠️ Technologies

- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - Python ORM
- **PostgreSQL** - Database
- **PyJWT** - JWT token handling
- **Bcrypt** - Password hashing
- **Marshmallow** - Schema validation
- **Flasgger** - Swagger/OpenAPI documentation
- **Gunicorn** - Production WSGI server

## 📋 Features

- ✅ User registration with validation
- ✅ User login with JWT token generation
- ✅ Bcrypt password hashing
- ✅ Email and username uniqueness validation
- ✅ Swagger UI documentation
- ✅ SQLAlchemy with PostgreSQL
- ✅ CORS support
- ✅ Database migrations with Flask-Migrate
- ✅ Docker support

## 🏃 Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL running on port 5432
- pip or virtualenv

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Database Setup

```bash
# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade
```

### Running the app

```bash
# Development mode
python run.py

# Or with Flask CLI
flask run --port 8081

# Production mode with Gunicorn
gunicorn --bind 0.0.0.0:8081 --workers 4 run:app
```

### Access

- **API**: http://localhost:8081/api/auth
- **Swagger UI**: http://localhost:8081/apidocs/
- **Health**: http://localhost:8081/api/auth/health

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/health` | Health check |

### Example: Register

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "johndoe",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "uuid-here",
  "username": "johndoe",
  "email": "john@example.com",
  "roles": ["USER"]
}
```

## 🐳 Docker

```bash
# Build image
docker build -t auth-service-flask .

# Run container
docker run -p 8081:8081 \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/authdb \
  -e JWT_SECRET_KEY=your-secret-key \
  auth-service-flask
```

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

## 📦 Project Structure

```
auth-service-flask/
├── app/
│   ├── __init__.py           # Application factory
│   ├── extensions.py         # Flask extensions
│   ├── models/
│   │   └── user.py          # User model
│   ├── routes/
│   │   └── auth_routes.py   # Auth endpoints
│   ├── schemas/
│   │   └── auth_schemas.py  # Marshmallow schemas
│   └── utils/
│       └── jwt_utils.py     # JWT utilities
├── config.py                # Configuration
├── run.py                   # Application entry point
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
└── .env.example            # Environment variables example
```

## 🔧 Configuration

Environment variables in `.env`:

```env
FLASK_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/authdb
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
JWT_EXPIRATION_HOURS=24
```

## 🌟 Comparison with Spring Boot Version

| Feature | Spring Boot | Flask |
|---------|-------------|-------|
| Language | Java 23 | Python 3.12 |
| Framework | Spring Boot 3.2 | Flask 3.0 |
| ORM | JPA/Hibernate | SQLAlchemy |
| Password | BCrypt (Spring) | Bcrypt (Python) |
| JWT | JJWT | PyJWT |
| Validation | Jakarta Validation | Marshmallow |
| API Docs | SpringDoc | Flasgger |
| Performance | ⚡⚡⚡⚡ | ⚡⚡⚡ |
| Dev Speed | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Simplicity | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## 📝 Development

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Format code
black .

# Lint code
flake8 app/

# Type checking
mypy app/
```

## 🔒 Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with HS256 algorithm
- CORS enabled for specified origins
- Input validation with Marshmallow
- SQL injection prevention via SQLAlchemy

## 📄 License

MIT

---

**Built with ❤️ using Python, Flask, and PostgreSQL**
