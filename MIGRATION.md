# 🚀 Migration vers les Nouveaux Microservices

## Changements Effectués

### Services Remplacés

1. **Auth Service**
   - ❌ Ancien: `auth-service` (Java/Spring Boot)
   - ✅ Nouveau: `auth-service-flask` (Python/Flask)
   - Port: 8081 (inchangé)
   - Base de données: authdb (inchangée)

2. **Catalog Service**
   - ❌ Ancien: `catalog-service` (Java/Spring Boot)
   - ✅ Nouveau: `catalog-service-nestjs` (TypeScript/NestJS)
   - Port: 8082 (inchangé)
   - Base de données: catalogdb (inchangée)

### Services Inchangés (Java/Spring Boot)

- ✅ Gateway Service (Port 8080)
- ✅ Inventory Service (Port 8083)
- ✅ Order Service (Port 8084)
- ✅ Notification Service (Port 8085)

## Architecture Polyglotte

Votre plateforme est maintenant **polyglotte** avec 3 technologies backend :

```
┌─────────────────────────────────────────────────┐
│         Gateway Service (Java/Spring)           │
│              Port 8080                          │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┐
    │             │             │             │
┌───▼────┐  ┌────▼────┐  ┌─────▼────┐  ┌────▼─────┐
│ Auth   │  │ Catalog │  │Inventory │  │  Order   │
│(Flask) │  │(NestJS) │  │  (Java)  │  │  (Java)  │
│8081    │  │8082     │  │8083      │  │8084      │
└────────┘  └─────────┘  └──────────┘  └──────────┘
```

## Lancement de la Plateforme

### Option 1: Docker Compose (Recommandé)

```bash
cd infrastructure/docker
docker-compose up -d
```

### Option 2: Lancement Manuel

**Infrastructure (PostgreSQL + RabbitMQ):**
```bash
cd infrastructure/docker
docker-compose -f docker-compose-infra.yml up -d
```

**Services dans des terminaux séparés:**

1. **Auth Service (Flask):**
```bash
cd backend/auth-service-flask
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

2. **Catalog Service (NestJS):**
```bash
cd backend/catalog-service-nestjs
npm install
npm run start:dev
```

3. **Inventory Service (Java):**
```bash
cd backend/inventory-service
mvn spring-boot:run
```

4. **Order Service (Java):**
```bash
cd backend/order-service
mvn spring-boot:run
```

5. **Notification Service (Java):**
```bash
cd backend/notification-service
mvn spring-boot:run
```

6. **Gateway Service (Java):**
```bash
cd backend/gateway-service
mvn spring-boot:run
```

7. **Frontend (React):**
```bash
cd frontend/react-app
npm install
npm run dev
```

## Accès aux Services

| Service | URL | Swagger/Docs |
|---------|-----|--------------|
| Gateway | http://localhost:8080 | - |
| Auth (Flask) | http://localhost:8081 | http://localhost:8081/apidocs/ |
| Catalog (NestJS) | http://localhost:8082 | http://localhost:8082/api-docs |
| Inventory | http://localhost:8083 | http://localhost:8083/swagger-ui.html |
| Order | http://localhost:8084 | http://localhost:8084/swagger-ui.html |
| Notification | http://localhost:8085 | - |
| Frontend | http://localhost:3000 | - |
| RabbitMQ | http://localhost:15672 | guest/guest |

## Vérification Santé

```bash
# Auth Service (Flask)
curl http://localhost:8081/api/auth/health

# Catalog Service (NestJS)
curl http://localhost:8082/api/products

# Autres services
curl http://localhost:8083/api/inventory
curl http://localhost:8084/api/orders
```

## Avantages de l'Architecture Polyglotte

### Auth Service - Flask (Python)
- ✅ Code simple et élégant
- ✅ Développement ultra-rapide
- ✅ Excellent pour les microservices légers
- ✅ Communauté énorme (PyPI)

### Catalog Service - NestJS (TypeScript)
- ✅ TypeScript type-safe
- ✅ Structure modulaire
- ✅ Performance excellente
- ✅ Similaire à Angular (familier)

### Inventory/Order/Notification - Spring Boot (Java)
- ✅ Robustesse enterprise
- ✅ Écosystème mature
- ✅ Performance optimale
- ✅ Support RabbitMQ natif

## Compatibilité

Tous les services exposent les **mêmes APIs REST** que les versions précédentes :
- ✅ Mêmes endpoints
- ✅ Mêmes formats de réponse
- ✅ Compatibilité totale avec le Gateway
- ✅ Compatibilité avec le Frontend React

## Anciens Services (Archivés)

Les anciens services Java sont toujours disponibles dans :
- `backend/auth-service/` (Java - archivé)
- `backend/catalog-service/` (Java - archivé)

Ils peuvent être restaurés si nécessaire en modifiant le docker-compose.yml.

## Migration des Données

Aucune migration de données nécessaire ! Les nouveaux services utilisent :
- ✅ Même structure de base de données
- ✅ Mêmes noms de tables
- ✅ Mêmes champs
- ✅ Compatibilité totale

## Technologies par Service

| Service | Tech Stack | ORM | Validation | API Docs |
|---------|-----------|-----|------------|----------|
| Auth | Python 3.12 + Flask | SQLAlchemy | Marshmallow | Flasgger |
| Catalog | TypeScript + NestJS | TypeORM | class-validator | Swagger |
| Inventory | Java 23 + Spring Boot | JPA/Hibernate | Jakarta Validation | SpringDoc |
| Order | Java 23 + Spring Boot | JPA/Hibernate | Jakarta Validation | SpringDoc |
| Notification | Java 23 + Spring Boot | - | - | - |
| Gateway | Java 23 + Spring Cloud | - | - | - |

## Prochaines Étapes

1. ✅ Tester l'authentification avec Flask
2. ✅ Tester le catalogue de produits avec NestJS
3. ✅ Tester le flux complet de commande
4. ✅ Vérifier les événements RabbitMQ
5. ✅ Tester le frontend

Votre plateforme est maintenant **moderne**, **polyglotte**, et **best-of-breed** ! 🚀
