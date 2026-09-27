# Terminal Commands Guide for MediMart

Follow these steps to manually run and stop your application services.

## 1. How to RUN the Servers

Open two separate terminal windows (PowerShell or CMD) in your project root directory.

### **Backend (Spring Boot)**
1. Navigate to the backend folder:
   ```powershell
   cd e:/College_project/medimart-fullstack/medimart/backend
   ```
2. Build and run the application:
   ```powershell
   mvn spring-boot:run
   ```
   *Note: If you have already built the jar file, you can also use:*
   ```powershell
   java -jar target/medimart-backend-1.0.0.jar
   ```

### **Frontend (Vite/React)**
1. Navigate to the frontend folder:
   ```powershell
   cd e:/College_project/medimart-fullstack/medimart/frontend
   ```
2. Install dependencies (only required the first time):
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

---

## 2. How to STOP the Servers

### **The Standard Way (Manual)**
In the terminal window where the server is running, simply press:
**`Ctrl + C`**
When asked "Terminate batch job (Y/N)?", type **`Y`** and press Enter.

### **The "Force Stop" Way (If stuck)**
If a server is running in the background and won't stop, use these commands in any terminal:

1. **Find the Process ID (PID):**
   - For Backend (Port 8080): `netstat -ano | findstr :8080`
   - For Frontend (Port 3000): `netstat -ano | findstr :3000`
2. **Kill the Process:**
   ```powershell
   taskkill /F /PID <NUMBER_FOUND_IN_STEP_1>
   ```

---
