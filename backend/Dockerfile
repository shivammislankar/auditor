# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the JAR without running tests to save time/memory
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM mcr.microsoft.com/playwright/java:v1.40.0-jammy
WORKDIR /app
# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
# Copy the axe script (ensure this path matches your project structure)
COPY src/main/resources/axe.min.js src/main/resources/axe.min.js

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]