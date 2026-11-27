FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
COPY Script_Pokedex.sql .
RUN mvn --batch-mode --no-transfer-progress -f backend/pom.xml package \
    && cp backend/target/pokedex-*.jar /pokedex.jar

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /pokedex.jar .
USER 10001:10001
EXPOSE 10000
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=50.0", "-jar", "pokedex.jar"]
