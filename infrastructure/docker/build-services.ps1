# Script to build all backend services locally before Docker

Write-Host "🔨 Building Order & Notification Platform..." -ForegroundColor Cyan

# Build shared library first
Write-Host "`n📦 Building shared-lib..." -ForegroundColor Yellow
Set-Location "..\..\backend\shared-lib"
mvn clean install -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build shared-lib" -ForegroundColor Red
    exit 1
}

# Build all services
$services = @("gateway-service", "auth-service", "catalog-service", "inventory-service", "order-service", "notification-service")

foreach ($service in $services) {
    Write-Host "`n📦 Building $service..." -ForegroundColor Yellow
    Set-Location "..\$service"
    mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build $service" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ All services built successfully!" -ForegroundColor Green
Write-Host "`n🐳 Now you can run: docker-compose up -d" -ForegroundColor Cyan

Set-Location "..\..\infrastructure\docker"
