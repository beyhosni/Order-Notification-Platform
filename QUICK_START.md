# 🚀 Guide de Démarrage Rapide - Order & Notification Platform

## ✅ Infrastructure Démarrée

L'infrastructure est maintenant en cours d'exécution :
- **PostgreSQL** : Port 5432
- **RabbitMQ** : Port 5672 (AMQP) et 15672 (Management UI)

Accès RabbitMQ Management : http://localhost:15672 (guest/guest)

## 📋 Prochaines Étapes pour Lancer l'Application Complète

### Option 1 : Lancer les Services avec Maven (Recommandé pour le Développement)

#### 1. Ouvrir des Terminaux Séparés

**Terminal 1 - Auth Service:**
```powershell
cd backend\auth-service
mvn spring-boot:run
```

**Terminal 2 - Catalog Service:**
```powershell
cd backend\catalog-service  
mvn spring-boot:run
```

**Terminal 3 - Inventory Service:**
```powershell
cd backend\inventory-service
mvn spring-boot:run
```

**Terminal 4 - Order Service:**
```powershell
cd backend\order-service
mvn spring-boot:run
```

**Terminal 5 - Notification Service:**
```powershell
cd backend\notification-service
mvn spring-boot:run
```

**Terminal 6 - Gateway Service:**
```powershell
cd backend\gateway-service
mvn spring-boot:run
```

**Terminal 7 - Frontend:**
```powershell
cd frontend\react-app
npm install
npm run dev
```

#### 2. Vérifier les Services

Une fois tous les services démarrés :
- Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- Catalog Service: http://localhost:8082
- Inventory Service: http://localhost:8083
- Order Service: http://localhost:8084
- Notification Service: http://localhost:8085
- Frontend: http://localhost:3000

### Option 2 : Build et Run avec Maven d'abord

Si vous voulez compiler une seule fois puis lancer :

#### 1. Build Shared Library
```powershell
cd backend\shared-lib
mvn clean install -DskipTests
```

#### 2. Build All Services
```powershell
cd backend\gateway-service
mvn clean package -DskipTests

cd ..\auth-service
mvn clean package -DskipTests

cd ..\catalog-service
mvn clean package -DskipTests

cd ..\inventory-service
mvn clean package -DskipTests

cd ..\order-service
mvn clean package -DskipTests

cd ..\notification-service
mvn clean package -DskipTests
```

#### 3. Run JAR files
Dans des terminaux séparés :
```powershell
# Terminal 1
cd backend\auth-service\target
java -jar *.jar

# Terminal 2
cd backend\catalog-service\target
java -jar *.jar

# etc...
```

## 🧪 Tester l'Application

### 1. Accéder au Frontend
Ouvrez http://localhost:3000 dans votre navigateur

### 2. Créer un Compte
Cliquez sur "Register" et créez un compte utilisateur

### 3. Ajouter des Produits de Test

Via curl ou Postman :
```powershell
# Créer un produit
curl -X POST http://localhost:8082/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Laptop Gaming",
    "description": "High performance gaming laptop",
    "price": 1299.99,
    "category": "Electronics",
    "imageUrl": "https://example.com/laptop.jpg"
  }'

# Notez le productId retourné, puis créez l'inventaire
curl -X POST http://localhost:8083/api/inventory `
  -H "Content-Type: application/json" `
  -d '{
    "productId": "PRODUCT-ID-ICI",
    "quantity": 100,
    "reserved": 0
  }'
```

### 4. Passer une Commande
1. Connectez-vous sur http://localhost:3000
2. Parcourez les produits
3. Ajoutez au panier
4. Passez commande

### 5. Vérifier les Événements RabbitMQ
- Ouvrez http://localhost:15672 (guest/guest)
- Allez dans l'onglet "Queues"
- Vous verrez les messages dans :
  - `inventory-queue`
  - `notification-order-created`
  - `notification-order-paid`
  - `notification-order-shipped`

### 6. Vérifier les Notifications
Regardez les logs du `notification-service` - vous verrez les notifications formatées !

## 🛑 Arrêter l'Application

### Arrêter l'Infrastructure
```powershell
cd infrastructure\docker
docker-compose -f docker-compose-infra.yml down
```

### Arrêter les Services Maven
Appuyez sur `Ctrl+C` dans chaque terminal

## 📚 Ressources

- **RabbitMQ Management**: http://localhost:15672
- **Documentation API**: Voir README.md
- **Architecture**: Voir walkthrough.md

## ⚠️ Troubleshooting

### Port déjà utilisé
Si un port est déjà utilisé, modifiez la configuration dans `application.yml` de chaque service.

### Erreur de connexion PostgreSQL
Vérifiez que PostgreSQL est démarré :
```powershell
docker ps
```

### Erreur de connexion RabbitMQ
Vérifiez que RabbitMQ est démarré et healthy.

---

**Bon développement ! 🚀**
