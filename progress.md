# ServiceBid Progress

## Setup
- IntelliJ IDEA Ultimate 2026.2, Windows, JDK: Temurin 21 (project SDK)
- Folder: C:\Users\Madhu\Desktop\smaran\B.TECH\Projects\ServiceBid (backend, frontend)
- GitHub: https://github.com/smaran-243/ServiceBid
- Backend: Spring Boot (Maven, package com.servicebid.backend), port 8080
- Frontend: React + Vite (JavaScript), port 5173, started with: npm run dev
- Database: Neon PostgreSQL. DB_HOST, DB_NAME, DB_USER, DB_PASSWORD are set as environment variables in IntelliJ Run Configuration (not in files)
- Dependencies so far: Spring Web, Spring Data JPA, PostgreSQL driver

## Done
- Day 1 complete: health check API (/api/health), Neon connected, React shows backend message, one Git repo pushed to GitHub
- HealthController has @CrossOrigin for http://localhost:5173
- Day 2: Role enum (CUSTOMER, PROVIDER), User entity (table "users"), UserRepository (findByEmail, existsByEmail) created
- application.properties has ddl-auto=update and show-sql=true; users table confirmed created in Neon
- Run Configuration "BackendApplication" must have the 4 DB_ environment variables set (fixed on Day 2)

## Current status
- Day 2 in progress. Done: Role enum (with ADMIN), User, UserRepository, Spring Security + BCrypt (SecurityConfig, all endpoints open for now), POST /api/auth/register (tested in terminal with Invoke-RestMethod, no Postman)
- Next: Task 12, login endpoint

## About me
- Complete beginner in React and Spring Boot, some Java
- Go in small steps, tell me exact file and click paths, text-only replies, keep answers short
- 7-day deadline, follow the instructions file, don't build ahead