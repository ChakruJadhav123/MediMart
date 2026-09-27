# ✅ ORACLE DATABASE SETUP - SUMMARY

## What Has Been Done

Your **MediMart application is now fully configured for Oracle Database**!

### Changes Made:

✅ **Entity Classes Fixed**
- Customer, Admin, Medicine, Order, Payment, OrderedMedicine, Chatbot
- All now use Oracle SEQUENCE instead of IDENTITY
- Table names corrected for Oracle compatibility

✅ **Configuration Files Ready**
- `application.properties` - Set to use Oracle profile
- `application-oracle.properties` - Oracle-specific settings
- `oracle-schema.sql` - Complete Oracle DDL schema

✅ **Quick Start Scripts Created**
- `run-oracle.bat` - For Windows Command Prompt
- `run-oracle.ps1` - For PowerShell
- `ORACLE_SETUP_COMPLETE.md` - Detailed guide

---

## What You Need to Do Next

### Step 1: Rebuild the Application

The source code is updated, but the JAR needs to be rebuilt. Choose ONE option:

**Option A: Using VS Code (Easy) ⭐ RECOMMENDED**
1. Open VS Code
2. Open the project folder
3. Right-click on `backend/src/main/java/com/medimart/MedimartApplication.java`
4. Select "Run as Java Application"
5. Wait for compilation and startup

**Option B: Using PowerShell Script**
```powershell
# From project root directory
.\run-oracle.ps1
```

**Option C: Using Command Prompt Script**
```cmd
# From project root directory
run-oracle.bat
```

**Option D: Manual Maven Build** (requires Maven installed)
```bash
cd backend
mvn clean package -DskipTests
java -Dspring.profiles.active=oracle -jar target/medimart-backend-1.0.0.jar
```

### Step 2: Verify Oracle Database Connection

When the app starts, you'll see:
```
Started MedimartApplication in X seconds
Tomcat started on port(s): 8080 (http)
```

This means **application is running and connected to Oracle**!

### Step 3: Test Login/Registration

**Register a new user using curl:**
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"cFullname\":\"John Doe\",\"cLoginId\":\"johndoe\",\"cPassword\":\"password123\",\"cEmail\":\"john@example.com\",\"cContact\":\"9876543210\",\"cAddress\":\"123 Main St\",\"cGender\":\"Male\"}"
```

Or use **Postman**:
- POST: `http://localhost:8080/api/auth/register`
- Body (JSON):
```json
{
  "cFullname": "John Doe",
  "cLoginId": "johndoe",
  "cPassword": "password123",
  "cEmail": "john@example.com",
  "cContact": "9876543210",
  "cAddress": "123 Main St",
  "cGender": "Male"
}
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

### Step 4: Verify Data in Oracle

Connect to Oracle and check:
```sql
sqlplus hr/hr@localhost:1521/orcl

-- Check registered users
SELECT c_id, c_fullname, c_login_id, c_email FROM customer;
```

You should see the registered user data!

---

## Troubleshooting

### Problem: "Cannot connect to Oracle database"
- Ensure Oracle is running: `lsnrctl status`
- Check connection string: `jdbc:oracle:thin:@localhost:1521:orcl`
- Verify credentials: `hr` / `hr`

### Problem: "Tables don't exist"
- This is normal! Hibernate will create them automatically on first run
- OR manually run `oracle-schema.sql` before starting

### Problem: "Permission denied" error
- Grant Oracle user permissions:
```sql
GRANT CREATE TABLE TO hr;
GRANT CREATE SEQUENCE TO hr;
GRANT CREATE TRIGGER TO hr;
```

### Problem: Application won't start with error about "IDENTITY"
- This means you're using the old JAR - **rebuild the application**

---

## Files Created/Modified

| File | Purpose |
|------|---------|
| `ORACLE_SETUP_COMPLETE.md` | Comprehensive setup guide |
| `oracle-schema.sql` | Oracle database schema |
| `application-oracle.properties` | Oracle configuration |
| `run-oracle.bat` | Windows batch script |
| `run-oracle.ps1` | PowerShell script |
| Source code (.java files) | Updated with Oracle sequences |

---

## What Happens When Application Starts

1. **Spring Boot initializes** with Oracle profile
2. **Hibernate connects** to Oracle database using `application-oracle.properties`
3. **Tables are auto-created** if they don't exist (via DDL)
4. **Tomcat starts** on port 8080
5. **API is ready** for registration and login requests
6. **Data is saved** to Oracle database (not H2 or file)

---

## Quick Database Query Cheat Sheet

```sql
-- Login to Oracle
sqlplus hr/hr@localhost:1521/orcl

-- View all customers
SELECT * FROM customer;

-- View specific customer
SELECT * FROM customer WHERE c_login_id = 'johndoe';

-- View all admins
SELECT * FROM admin;

-- Count registrations
SELECT COUNT(*) as total_customers FROM customer;

-- Delete test data (if needed)
DELETE FROM customer WHERE c_login_id = 'johndoe';
COMMIT;
```

---

## Expected Next Step: Frontend Integration

After verifying the backend works:

```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

Frontend will communicate with backend at `http://localhost:8080/api`

---

## ✨ You're All Set!

Your application is **fully configured and ready for Oracle**. 

**Next Action:** Rebuild using one of the methods above and start the application!

For detailed help, see: `ORACLE_SETUP_COMPLETE.md`

---

**Questions?** Check the troubleshooting section above or review the detailed guide.
