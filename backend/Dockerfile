# Step 1: Use a Java 21 image (or 17, depending on your project)
FROM mcr.microsoft.com/playwright/java:v1.40.0-jammy

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy your built JAR file into the container
# (Make sure to run 'mvn clean package' first!)
COPY target/*.jar app.jar

# Step 4: Copy your axe.min.js so the app can find it
COPY src/main/resources/axe.min.js src/main/resources/axe.min.js

# Step 5: Expose the port your app runs on
EXPOSE 8080

# Step 6: Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]