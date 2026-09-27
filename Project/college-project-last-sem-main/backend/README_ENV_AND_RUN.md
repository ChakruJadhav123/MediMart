# MediMart Backend - Maven/Environment Run Guide

## What works right now
- The backend can start using the existing **Spring profiles + application-*.properties**.
- Your `backend/run_backend.log` shows it successfully runs with **H2**.

## Important
- Maven Wrapper (`mvnw`) expects `backend/.mvn/wrapper/maven-wrapper.jar`.
- If the jar is missing, wrapper-based commands may fail.

So for “successfully run” we recommend running with either:
1) prebuilt jar (already present),
2) system Maven (`mvn`) if installed,
3) Maven wrapper (`mvnw`) after we ensure wrapper jar exists.

---

## 1) Run using prebuilt jar (recommended)
Backend jar exists at:
- `backend/target/medimart-backend-1.0.0.jar`

### H2 (works out of the box)
From project root:
```bat
java -Dspring.profiles.active=working -jar backend\target\medimart-backend-1.0.0.jar
```

- API will be on `http://localhost:8081` (check `application-working.properties`).

### Oracle
```bat
java -Dspring.profiles.active=oracle -jar backend\target\medimart-backend-1.0.0.jar
```

---

## 2) Run with Maven (system Maven)
If you have `mvn` in PATH:
```bat
cd backend
mvn -DskipTests package
java -Dspring.profiles.active=working -jar target\medimart-backend-1.0.0.jar
```

---

## Environment (.env)
Spring loads `.env[.properties]` using:
- `backend/src/main/resources/application.properties`

So create:
- `backend/.env` (copy from `backend/.env.example`)

and put values for:
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER`
- (plus any other variables referenced by application-*.properties)

---

## What to do if you want Maven Wrapper
Add this missing file:
- `backend/.mvn/wrapper/maven-wrapper.jar`

Then `backend/mvnw.cmd` will work.

