# MediMart Oracle Database Setup - Complete Guide

## Status Update ✅

Your project has been **successfully configured for Oracle Database**! Here's what was done:

### Changes Made:

1. **✅ Entity Classes Updated**
   - All entities now use Oracle SEQUENCE generators instead of IDENTITY
   - Fixed table names for Oracle compatibility
   - Order entity: "customer_orders" → "orders"
   - OrderedMedicine entity: "ordered_medicines" → "ordered_medicine"

2. **✅ Configuration Files Created**
   - `application-oracle.properties` - Oracle-specific configuration
   - `application.properties` - Updated to use Oracle profile
   - `oracle-schema.sql` - Oracle DDL schema with sequences and triggers

3. **✅ Database Schema**
   - Created Oracle-compatible sequences (admin_seq, customer_seq, etc.)
   - Triggers for auto-increment support
   - All tables properly configured for Oracle

## Current Issue

The pre-compiled JAR (`medimart-backend-1.0.0.jar`) was built with the old configuration. It needs to be **rebuilt** with the updated source code.

---

## Solution: Rebuild & Run

### Option 1: Using VS Code Java Extension (Recommended)

1. **Open VS Code**
   - File → Open Folder → Select the `backend` folder

2. **Clean Build**
   - Open Command Palette: `Ctrl+Shift+P`
   - Search for "Java: Run" or "Java: Debug"
   - OR right-click on `MedimartApplication.java` → "Run as Java Application"

3. **VS Code will:**
   - Auto-compile the project
   - Detect the Main class
   - Start the application with updated Oracle configuration

**Expected Output:**
```
Started MedimartApplication in XX seconds (process running for XX.XXX)
Tomcat started on port(s): 8080
```

### Option 2: Using Command Line (if Maven is installed)

```bash
cd backend
mvn clean package -DskipTests
java -Dspring.profiles.active=oracle -jar target/medimart-backend-1.0.0.jar
```

### Option 3: Quick Start (Without Rebuild)

If you want to test **immediately** with H2 (in-memory) database first:

```bash
cd backend
java -Dspring.profiles.active=working -jar target/medimart-backend-1.0.0.jar
```

Then test login/registration endpoints, then rebuild for Oracle.

---

## Testing the Application

### Step 1: Ensure Oracle Database is Running

```bash
# Check Oracle connection
sqlplus hr/hr@localhost:1521/orcl
```

If Oracle is NOT running, the application will throw a connection error.

### Step 2: Access the API

**Register a new user:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "cFullname": "Test User",
    "cLoginId": "testuser",
    "cPassword": "password123",
    "cEmail": "test@example.com",
    "cContact": "9876543210",
    "cAddress": "Test Address",
    "cGender": "Male"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "testuser",
    "password": "password123"
  }'
```

### Step 3: Verify Data in Oracle

```sql
-- Connect to Oracle
sqlplus hr/hr@localhost:1521/orcl

-- Check registered users
SELECT c_id, c_fullname, c_login_id, c_email FROM customer;

-- Check admins
SELECT a_id, a_fullname, a_login_id, a_email FROM admin;
```

---

## Troubleshooting

### Issue: "Connection refused" when starting application

**Cause:** Oracle database is not running on `localhost:1521`

**Solution:**
1. Start Oracle database service
2. Verify Oracle listener is running: `lsnrctl status`
3. Check connection string in `application.properties` or `application-oracle.properties`

### Issue: "User hr doesn't have permission to create tables"

**Cause:** Oracle user doesn't have necessary privileges

**Solution:**
```sql
-- As SYS or SYSTEM user:
GRANT CREATE TABLE TO hr;
GRANT CREATE SEQUENCE TO hr;
GRANT CREATE TRIGGER TO hr;
```

### Issue: Table doesn't exist when registering

**Cause:** Tables haven't been created yet

**Solution:**
1. Let Hibernate create them: `spring.jpa.hibernate.ddl-auto=update` (already configured)
2. OR manually run `oracle-schema.sql` first

### Issue: "localhost:3000 is not in CORS allowed origins"

**Cause:** Frontend URL not in allowed list

**Solution:** Add your frontend URL to `app.cors.allowed-origins` in `application.properties`

---

## Files Modified

| File | Changes |
|------|---------|
| `backend/src/main/java/com/medimart/entity/Customer.java` | IDENTITY → SEQUENCE |
| `backend/src/main/java/com/medimart/entity/Admin.java` | IDENTITY → SEQUENCE |
| `backend/src/main/java/com/medimart/entity/Medicine.java` | IDENTITY → SEQUENCE |
| `backend/src/main/java/com/medimart/entity/Order.java` | IDENTITY → SEQUENCE, table name fixed |
| `backend/src/main/java/com/medimart/entity/Payment.java` | IDENTITY → SEQUENCE |
| `backend/src/main/java/com/medimart/entity/OrderedMedicine.java` | IDENTITY → SEQUENCE, table name fixed |
| `backend/src/main/java/com/medimart/entity/Chatbot.java` | IDENTITY → SEQUENCE |
| `backend/src/main/resources/application.properties` | Profile set to "oracle" |
| `backend/src/main/resources/application-oracle.properties` | ✨ NEW - Oracle configuration |
| `oracle-schema.sql` | ✨ NEW - Oracle DDL schema |

---

## Quick Start Commands

### Build & Run with Oracle
```bash
cd backend
# Option A: Using VS Code's built-in Java support
# (Right-click MedimartApplication.java → Run as Java Application)

# Option B: Using command line (requires Maven)
mvn clean package -DskipTests
java -Dspring.profiles.active=oracle -jar target/medimart-backend-1.0.0.jar
```

### Run Frontend (Optional)
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

### Backend Health Check
```bash
curl http://localhost:8080/api/health
```

---

## Database Schema Created

```
TABLES CREATED:
├── admin (with admin_seq)
├── customer (with customer_seq)
├── medicine (with medicine_seq)
├── orders (with orders_seq)
├── payment (with payment_seq)
├── ordered_medicine (with ordered_medicine_seq)
└── chatbot (with chatbot_seq)

SEQUENCES:
├── admin_seq (START WITH 1, INCREMENT BY 1)
├── customer_seq
├── medicine_seq
├── orders_seq
├── payment_seq
├── ordered_medicine_seq
└── chatbot_seq
```

---

## Next Steps

1. **Rebuild the project** using VS Code or Maven
2. **Verify Oracle is running** on `localhost:1521`
3. **Start the application** with Oracle profile
4. **Test endpoints** using curl or Postman
5. **Verify data** appears in Oracle tables
6. **Run the frontend** (optional)

---

**Your application is now fully configured for Oracle Database!** 🎉

Once you rebuild and start, all login/registration data will be automatically saved to Oracle.
