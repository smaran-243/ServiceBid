# ServiceBid Progress

## Setup
- IntelliJ IDEA Ultimate 2026.2, Windows (PowerShell terminal), JDK: Temurin 21 (project SDK)
- Folder: C:\Users\Madhu\Desktop\smaran\B.TECH\Projects\ServiceBid (backend, frontend)
- GitHub: https://github.com/smaran-243/ServiceBid (one repo, branch main)
- Backend: Spring Boot 4.1.1 (Maven, package com.servicebid.backend), port 8080
- Frontend: React + Vite (JavaScript), port 5173, started with: npm run dev
- Database: Neon PostgreSQL
- Environment variables are set ONLY in the IntelliJ Run Configuration "BackendApplication": DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET (40+ chars). Never put them in files.
- Dependencies: Spring Web, Spring Data JPA, PostgreSQL driver, Spring Security, jjwt 0.12.6 (api, impl, jackson)
- No Postman. APIs are tested with Invoke-RestMethod in the IntelliJ terminal (Alt+F12)
- Git is done manually in the terminal (git add ., git status, git commit, git push). core.pager is set to cat.

## application.properties
- spring.datasource.url/username/password read DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
- spring.jpa.hibernate.ddl-auto=update
- spring.jpa.show-sql=true
- app.jwt.secret=${JWT_SECRET}
- app.jwt.expiration-ms=86400000

## Backend structure (com.servicebid.backend)
- Root: BackendApplication, HealthController (GET /api/health, @CrossOrigin for http://localhost:5173)
- model: Role (CUSTOMER, PROVIDER, ADMIN), User (table "users": id, name, email unique, password BCrypt hash, role, createdAt)
- repository: UserRepository (findByEmail, existsByEmail)
- dto: RegisterRequest, LoginRequest (records)
- service: AuthService (register, login)
- controller: AuthController (POST /api/auth/register, POST /api/auth/login)
- security: JwtService (generateToken only, no validation yet)
- config: SecurityConfig (BCrypt PasswordEncoder bean, csrf disabled, CORS default, ALL endpoints still open: temporary)

## Done
- Day 1 complete: health check API, Neon connected, React shows backend message, GitHub repo
- Day 2 backend:
    - Task 6: Role enum, User entity, UserRepository
    - Task 7: users table confirmed in Neon (fixed missing env variables in Run Configuration)
    - Task 8: manual Git fix (rebase) and push
    - Task 9: added ADMIN to Role
    - Task 10: Spring Security + BCrypt, SecurityConfig with all endpoints open
    - Task 11: POST /api/auth/register (ADMIN cannot self-register, 409 on duplicate email, tested)
    - Task 12: JwtService + JWT_SECRET variable
    - Task 13: POST /api/auth/login returns {"token": "..."} (401 on wrong credentials, tested)
- Test user in Neon: cust@test.com / secret123 / CUSTOMER

## Current status
- Day 2 in progress. Tasks 6 to 13 complete and pushed.
- Next: Task 14, JWT filter (token parsing/validation in JwtService, OncePerRequestFilter reading "Authorization: Bearer <token>", sets user and role in SecurityContext, registered in SecurityConfig)
- Then: Task 15 protect endpoints + GET /api/me + role rules (keep /api/auth/** and /api/health public, allow OPTIONS preflight)
- Then: Task 16 React setup (router, API helper with token), Task 17 Register page, Task 18 Login page (redirect by role), Task 19 basic dashboards with logout and route protection. Day 2 ends after Task 19.

## About me
- Complete beginner in React and Spring Boot, some Java
- Small steps, exact file and click paths, text-only replies, keep answers short
- 7-day deadline, follow the instructions file, don't build ahead