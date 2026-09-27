# MediMart Oracle Setup - Quick Checklist ✅

## Prerequisites Check

- [ ] Oracle database installed and running
  - Test: `lsnrctl status`
- [ ] Oracle user `hr` exists with password `hr`
  - Test: `sqlplus hr/hr@localhost:1521/orcl`
- [ ] Java is available
  - Verified: Java 21 found via VS Code
- [ ] Internet connection (for Maven downloads)

---

## Setup Steps

### 1️⃣ Rebuild Application

Choose one method:

**Method A: VS Code (Easiest)**
- [ ] Open VS Code
- [ ] Open project folder
- [ ] Right-click `MedimartApplication.java` → "Run as Java Application"
- [ ] Wait for "Started MedimartApplication" message

**Method B: PowerShell**
- [ ] Open PowerShell in project root
- [ ] Run: `.\run-oracle.ps1`
- [ ] Wait for startup

**Method C: Command Prompt**
- [ ] Open CMD in project root
- [ ] Run: `run-oracle.bat`
- [ ] Wait for startup

**Method D: Manual Maven**
- [ ] Ensure Maven is installed
- [ ] Run: `cd backend && mvn clean package -DskipTests`
- [ ] Run: `java -Dspring.profiles.active=oracle -jar target/medimart-backend-1.0.0.jar`

### 2️⃣ Verify Application Started

- [ ] See message: "Tomcat started on port(s): 8080"
- [ ] No error about database connection
- [ ] No error about table creation

### 3️⃣ Test Registration Endpoint

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"cFullname":"Test","cLoginId":"test1","cPassword":"pass123","cEmail":"test1@test.com","cContact":"9876543210","cAddress":"Test","cGender":"M"}'
```

- [ ] Get 201 response with user data

### 4️⃣ Test Login Endpoint

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginId":"test1","password":"pass123"}'
```

- [ ] Get JWT token in response
- [ ] User details returned

### 5️⃣ Verify Data in Oracle

```sql
sqlplus hr/hr@localhost:1521/orcl
SELECT * FROM customer;
```

- [ ] See registered user record
- [ ] Email and login ID match

---

## Troubleshooting Checklist

### Application Won't Start

- [ ] Oracle is running (`lsnrctl status`)
- [ ] Oracle connection credentials correct (`hr` / `hr`)
- [ ] Port 8080 is not already in use
- [ ] Rebuilt with updated source code
- [ ] Check console for specific error message

### "Connection refused" Error

- [ ] Start Oracle database service
- [ ] Verify listener: `lsnrctl start`
- [ ] Check Oracle is listening on port 1521
- [ ] Verify hostname is `localhost` in connection string

### "User doesn't have permission" Error

```sql
-- Connect as SYSTEM or SYS, then:
GRANT CREATE TABLE TO hr;
GRANT CREATE SEQUENCE TO hr;
GRANT CREATE TRIGGER TO hr;
```

### Registration/Login Returns 500 Error

- [ ] Check application console for error stack
- [ ] Ensure tables exist: `SELECT * FROM customer;`
- [ ] Verify database connection is still active
- [ ] Check CORS settings if calling from frontend

### "Table doesn't exist" Error

- [ ] Restart application (let Hibernate create tables)
- [ ] OR manually run `oracle-schema.sql`
- [ ] Check application logs for table creation messages

---

## Performance Tips

- [ ] Use connection pooling (already configured)
- [ ] Enable query logging during development:
  - Uncomment in `application-oracle.properties`:
    ```
    logging.level.org.hibernate.SQL=DEBUG
    ```
- [ ] Monitor active sessions in Oracle
- [ ] Archive old data periodically

---

## Development Workflow

1. **Register a test user** via API
2. **Verify in Oracle** the data is saved
3. **Login** and get JWT token
4. **Use token** for authenticated endpoints
5. **Repeat** tests to verify consistency

---

## Cleanup (if needed)

### Delete Test Data
```sql
DELETE FROM customer WHERE c_login_id = 'test1';
COMMIT;
```

### Reset Sequences
```sql
DROP SEQUENCE customer_seq;
CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;
```

### Full Reset (recreate schema)
```sql
@oracle-schema.sql
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `README_ORACLE_SETUP.md` | This summary |
| `ORACLE_SETUP_COMPLETE.md` | Detailed guide |
| `oracle-schema.sql` | Database schema |
| `run-oracle.ps1` | PowerShell startup script |
| `run-oracle.bat` | Windows batch startup script |
| `backend/src/main/resources/application.properties` | Configuration |

---

## Success Indicators ✅

- [ ] Application starts without errors
- [ ] Tomcat listens on port 8080
- [ ] Registration endpoint works
- [ ] Data appears in Oracle tables
- [ ] Login works and returns JWT
- [ ] Frontend (optional) connects successfully

---

## Next Steps

1. ✅ **Rebuild** application
2. ✅ **Start** application
3. ✅ **Test** endpoints
4. ✅ **Verify** data in Oracle
5. ⏭️ **Deploy** frontend (optional)
6. ⏭️ **Go to production**

---

**Good luck! Your application is ready for Oracle Database! 🚀**
