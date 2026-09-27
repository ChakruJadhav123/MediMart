# MediMart Oracle Database Setup & Run Guide

## Prerequisites

1. **Oracle Database** - Must be running locally
   - Default connection: `jdbc:oracle:thin:@localhost:1521:orcl`
   - Default user: `hr` / `hr`
   - If your credentials differ, update `application.properties`

2. **Java 17+** - Verify with: `java -version`

3. **Node.js & npm** - For frontend (optional for initial setup)

## Step 1: Prepare Oracle Database

### Option A: Auto-create tables (Recommended - Hibernate will do it)
The application is configured with `spring.jpa.hibernate.ddl-auto=update`, which means Hibernate will:
- Automatically create tables if they don't exist
- Update table structure if needed
- This happens on first run

### Option B: Manual SQL import (Optional)
If you want to pre-create tables, run the SQL script in your Oracle Database:

```sql
-- Open Oracle SQL*Plus or your client
@oracle-schema.sql
```

Or copy the content of `oracle-schema.sql` and execute in Oracle directly.

## Step 2: Update Database Credentials (if needed)

Edit `backend/src/main/resources/application.properties`:

```properties
# Default Oracle Configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:orcl
spring.datasource.username=hr
spring.datasource.password=hr
```

**If your Oracle instance has different credentials:**
- Change `username` and `password` accordingly
- Ensure the user has permissions to create tables

## Step 3: Run the Backend

### Using Maven Wrapper (if available):
```bash
cd backend
./mvnw spring-boot:run
```

### Using Java directly (after building):
```bash
cd backend
javac -version  # Verify Java is installed
# Then run using VS Code Java Extension or build with IDE
```

### Using VS Code Java Extension:
1. Open the project in VS Code
2. Right-click on `MedimartApplication.java`
3. Select "Run as Java Application"
4. OR Press `Ctrl+Shift+D` and select "Java" configuration

**Expected Output on Success:**
```
[main] o.s.b.w.e.t.TomcatWebServer: Tomcat started on port(s): 8080 (http)
[main] c.m.MedimartApplication: Started MedimartApplication in X seconds
```

## Step 4: Test Login/Registration Endpoints

### Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "cFullname": "John Doe",
    "cLoginId": "johndoe",
    "cPassword": "password123",
    "cEmail": "john@example.com",
    "cContact": "9876543210",
    "cAddress": "123 Main St",
    "cGender": "Male"
  }'
```

**Expected Response:**
```json
{
  "cId": 1,
  "cFullname": "John Doe",
  "cLoginId": "johndoe",
  "cEmail": "john@example.com",
  "cContact": "9876543210",
  "cAddress": "123 Main St",
  "cGender": "Male"
}
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "johndoe",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "loginId": "johndoe",
  "fullName": "John Doe",
  "role": "USER"
}
```

## Step 5: Verify Data in Oracle

Connect to Oracle and run:

```sql
SELECT * FROM customer;
SELECT * FROM admin;
```

You should see the registered users in these tables.

## Step 6: Run the Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Troubleshooting

### Issue: "No suitable driver found for jdbc:oracle:thin:"
- **Solution**: Ensure `ojdbc11` dependency is in `pom.xml` (already included)
- Check Oracle database is running on `localhost:1521`

### Issue: "User hr doesn't have permission to create tables"
- **Solution**: Log in as `SYS` or `SYSTEM` and grant permissions:
  ```sql
  GRANT CREATE TABLE TO hr;
  GRANT CREATE SEQUENCE TO hr;
  ```

### Issue: "Connection refused" on localhost:1521
- **Solution**: 
  - Start Oracle Database instance
  - Verify Oracle listener is running
  - Check connection string matches your Oracle setup

### Issue: Table name doesn't match (e.g., "customer_orders" vs "orders")
- **Solution**: Already fixed! Tables now match Oracle schema
- Tables created: `admin`, `customer`, `medicine`, `orders`, `payment`, `ordered_medicine`, `chatbot`

## File Structure

```
backend/
├── pom.xml (contains ojdbc11 Oracle driver)
├── src/main/java/com/medimart/
│   ├── entity/ (Updated for Oracle sequences)
│   ├── repository/
│   ├── controller/
│   ├── service/
│   └── ...
└── src/main/resources/
    └── application.properties (Oracle configured)

oracle-schema.sql (Optional pre-creation script)
```

## What Happens on Application Startup

1. Spring Boot initializes
2. Hibernate connects to Oracle using configured credentials
3. Hibernate checks if tables exist:
   - If NO: Creates tables using the entity definitions
   - If YES: Updates table structure if needed
4. Application loads and starts Tomcat on port 8080
5. Login/registration data is now persisted to Oracle

## Common Queries

**Check all customers:**
```sql
SELECT c_id, c_fullname, c_login_id, c_email FROM customer;
```

**Check all admins:**
```sql
SELECT a_id, a_fullname, a_login_id, a_email FROM admin;
```

**Delete all customer data (testing):**
```sql
DELETE FROM customer;
DELETE FROM customer_seq;
```

---

**Your application is now configured to save login/registration data to Oracle Database!**
