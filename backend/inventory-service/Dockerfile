FROM maven:3.9-eclipse-temurin-23-alpine AS builder
WORKDIR /app

# Copy and build shared-lib first
COPY shared-lib /app/shared-lib
WORKDIR /app/shared-lib
RUN mvn clean install -DskipTests

# Build the service
WORKDIR /app/service
COPY inventory-service/pom.xml .
COPY inventory-service/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:23-jre-alpine
WORKDIR /app
COPY --from=builder /app/service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
