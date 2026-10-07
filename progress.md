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
- model: Role (CUSTOMER, PROVIDER, ADMIN), User (table "users": id, name, email unique, password BCrypt hash, role, createdAt), Category, ServiceItem, RequestStatus, ServiceRequest
- repository: UserRepository (findByEmail, existsByEmail), CategoryRepository, ServiceItemRepository, ServiceRequestRepository
- dto: RegisterRequest, LoginRequest, CategoryRequest, ServiceItemRequest, ServiceItemResponse, ServiceRequestCreate, ServiceRequestResponse
- service: AuthService (register, login), CategoryService, ServiceItemService, ServiceRequestService
- controller: AuthController, MeController, CatalogController, AdminCatalogController, CustomerRequestController, ProviderRequestController
- security: JwtService (generateToken, isTokenValid, extractEmail, extractRole), JwtAuthFilter
- config: SecurityConfig (BCrypt PasswordEncoder bean, csrf disabled, JwtAuthFilter registered, endpoints protected, role rules by URL path, CorsConfigurationSource bean allowing http://localhost:5173)

## Frontend structure (frontend/src)
* main.jsx (BrowserRouter), App.jsx (routes: /, /register, /login, /customer, /provider)
* api/api.js: token helpers and apiFetch
* pages: Register, Login, CustomerDashboard, ProviderDashboard
* components: LogoutButton, ProtectedRoute

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
    * Task 14: JwtService (parse/validate/extract email and role), JwtAuthFilter (reads Bearer token, sets user and role in SecurityContext), registered in SecurityConfig (endpoints still open)
    * Task 15: GET /api/me, endpoints protected (public: /api/auth/**, /api/health, /error, OPTIONS), role rules (/api/customer/** CUSTOMER, /api/provider/** PROVIDER, /api/admin/** ADMIN). Tested: no token 403, valid token works, fake token 403, wrong role 403
    * Task 16: React Router installed, BrowserRouter in main.jsx, api/api.js (saveToken, getToken, removeToken, apiFetch adds Bearer token), placeholder pages and routes in App.jsx
    * Task 17: Register page (name, email, password, role CUSTOMER/PROVIDER, 409 message, redirects to /login)
    * Task 18: Login page (saves token, calls /api/me, redirects by role). Fixed CORS with a global CorsConfigurationSource bean in SecurityConfig (allows http://localhost:5173)
    * Task 19: LogoutButton, dashboards show logged-in email, ProtectedRoute (checks token and role through /api/me, redirects to /login)
- Test user in Neon: cust@test.com / secret123 / CUSTOMER , prov@test.com / secret123 / PROVIDER , * admin@test.com / secret123 / ADMIN

- Day 3 (in progress, not pushed yet):
  * Task 20: Category entity (table categories), ServiceItem entity (table services, ManyToOne Category). Named ServiceItem to avoid a clash with Spring's @Service
  * Task 21: CategoryRepository, ServiceItemRepository
  * Task 22: DTOs (CategoryRequest, ServiceItemRequest, ServiceItemResponse), CategoryService, ServiceItemService (400/404/409 via ResponseStatusException)
  * Task 23: CatalogController (GET /api/categories, /api/services, /api/services/{id}, any logged-in user), AdminCatalogController (POST/PUT/DELETE under /api/admin/categories and /api/admin/services, ADMIN only). Tested.
  * Admin user created: admin@test.com / secret123 (registered as CUSTOMER, then role changed in Neon SQL Editor). Fixed Neon users_role_check constraint to allow ADMIN
  * Task 24: RequestStatus enum (OPEN, ACCEPTED, CANCELLED, COMPLETED), ServiceRequest entity (table service_requests: service, customer, description, budget, scheduledAt, location, status default OPEN, createdAt)
  * Task 25: ServiceRequestRepository (findByCustomerIdOrderByCreatedAtDesc, findByStatusOrderByCreatedAtDesc), DTOs ServiceRequestCreate, ServiceRequestResponse
  * Task 26: ServiceRequestService (create with validation, customer's own requests, view one, provider OPEN requests), CustomerRequestController (POST/GET /api/customer/requests, GET /api/customer/requests/{id}), ProviderRequestController (GET /api/provider/requests, GET /api/provider/requests/{id}, OPEN only). Tested with PowerShell: create, list, view, 400 on empty description, customer token gets 403 on provider endpoint
- Day 3 complete and pushed

- Day 4 (bidding + accept bid):
  * Task 27: BidStatus enum (PENDING, ACCEPTED, REJECTED, WITHDRAWN), Bid entity (table bids), BidRepository
  * Task 28: DTOs BidCreate, BidResponse
  * Task 29: BidService (submitBid: amount > 0, request must be OPEN else 409, duplicate bid 409; getMyBids), ProviderBidController (POST /api/provider/requests/{requestId}/bids returns 201, GET /api/provider/bids)
  * Task 30: BidService.getBidsForMyRequest (owner only, others get 404, cheapest first), CustomerBidController (GET /api/customer/requests/{requestId}/bids)
  * Task 31: BookingStatus enum (REQUESTED, BID_ACCEPTED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED), Booking entity (table bookings), BookingRepository, BookingResponse DTO, BookingService.acceptBid (@Transactional), CustomerBookingController (POST /api/customer/bids/{bidId}/accept returns 201)
  * Tested: 2 providers bid on one request, customer sees both (cheapest first), accept bid creates booking (BID_ACCEPTED, agreed amount 900), chosen bid ACCEPTED, other bid REJECTED, request ACCEPTED, accepting again gives 409, request no longer in provider OPEN list
- Test user added: prov2@test.com / secret123 / PROVIDER
- Day 4 complete and pushed
  - Day 4/5 (booking lists + status updates):
  * BookingService: getMyBookingsAsCustomer, getMyBookingsAsProvider, updateStatus (only the booking's provider, allowed moves only, else 409; wrong provider gets 404)
  * DTO: BookingStatusUpdate (record with status)
  * CustomerBookingListController (GET /api/customer/bookings), ProviderBookingController (GET /api/provider/bookings, PATCH /api/provider/bookings/{bookingId}/status)
  * Request status follows the booking: COMPLETED or CANCELLED
  * Tested: customer and provider lists (each sees only their own), invalid jump 409, BID_ACCEPTED -> CONFIRMED -> IN_PROGRESS -> COMPLETED, completed booking locked (409), wrong provider 404, request status COMPLETED
  * Note: CORS in SecurityConfig must allow PATCH before the React app calls the status endpoint
  - Booking lists and status updates complete and pushed- 
- Day 5 (reviews + provider rating):
  * Review entity (table reviews: booking OneToOne unique, customer, provider, rating, comment, createdAt)
  * ReviewRepository (existsByBookingId, findByProviderIdOrderByCreatedAtDesc, findAverageRatingByProviderId)
  * DTOs: ReviewCreate, ReviewResponse, ProviderRatingResponse
  * ReviewService: createReview (only the booking's customer, rating 1-5 else 400, booking must be COMPLETED else 409, one review per booking else 409), getReviewsForProvider, getProviderRating
  * ReviewController: POST /api/customer/bookings/{bookingId}/review (201), GET /api/providers/{providerId}/reviews, GET /api/providers/{providerId}/rating (any logged-in user)
  * Tested: bad rating 400, review created, duplicate 409, provider review list, average rating 5 with count 1
- Day 5 backend complete (pushed)
- Day 6 (frontend, customer side) complete and pushed:
  * Backend: PATCH added to CORS in SecurityConfig
  * Pages: BrowseServices (/customer/services), CreateRequest (/customer/request/:serviceId), RequestDetail (/customer/requests/:requestId, bids + Accept button), MyBookings (/customer/bookings, review form on COMPLETED bookings)
  * CustomerDashboard: My requests list with "View bids" links, links to Browse services and My bookings
  * Tested in browser: create request, provider bid, accept bid, booking list, review form
- Day 6 (frontend, provider side) complete and pushed:
  * Pages: PlaceBid (/provider/requests/:requestId), MyBids (/provider/bids), ProviderBookings (/provider/bookings, status buttons BID_ACCEPTED -> CONFIRMED -> IN_PROGRESS -> COMPLETED, plus cancel)
  * ProviderDashboard: Open requests list with "Place a bid" links, links to My bids and My bookings
  * Tested in browser: place bid, my bids, booking status updates to COMPLETED
- Day 6 (data + ratings) complete:
  * Added data through the admin API: 9 categories (Cleaning 1, Plumbing 2, Electrical 3, AC Repair 4, Painting 5, Computer Repair 6, Appliance Repair 7, Pest Control 8, Salon at Home 9) and 18 new services (19 total including Home Cleaning). Checked: GET /api/services count = 19 and Browse services page shows them all
  * RequestDetail now shows each provider's average rating and review count next to their bid (calls GET /api/providers/{providerId}/rating, shows "No reviews yet" if none)
  * Test users: prov2@test.com (PROVIDER, id 5). Tests in Neon: request 1 COMPLETED, request 2 went through bid, accept, booking, completed via provider UI
- Day 6 (UI polish) complete:
  * Replaced the Vite template index.css with plain CSS (no Tailwind): light theme, cards, blue buttons, inputs
  * Navbar component (links change by role, uses /api/me, Logout), used in App.jsx
  * New home page with hero text and 3 step cards
  * StatusBadge component (colored status pills) used in CustomerDashboard, MyBookings, MyBids, ProviderBookings
  * Loading states on MyBids, ProviderBookings, ProviderDashboard, BrowseServices
- Day 7 (customer cancel + provider profile) complete:
  * Customer cancel: BookingService.cancelAsCustomer (only the booking's customer, only from BID_ACCEPTED or CONFIRMED, else 409; request becomes CANCELLED), POST /api/customer/bookings/{bookingId}/cancel in CustomerBookingListController, "Cancel booking" button in MyBookings.jsx
  * Provider profile: ProviderProfile entity (table provider_profiles: user, bio, phone), ProviderProfileRepository, DTOs ProviderProfileRequest/Response, ProviderProfileService, ProviderProfileController (GET/PUT /api/provider/profile, GET /api/providers/{providerId}/profile)
  * Provider services: ProviderOffering entity (table provider_offerings, unique provider+service), ProviderOfferingRepository, ProviderServicesRequest, ProviderOfferingService, ProviderOfferingController (GET/PUT /api/provider/services, GET /api/providers/{providerId}/services)
  * Frontend: ProviderProfile page (/provider/profile, bio, phone, tick services, save), link on ProviderDashboard, provider bio shown next to each bid in RequestDetail
  * Service ids start at 2 (id 1 does not exist)
  * Tested: cancel works, second cancel 409, profile and services saved and shown in browser
- Day 8: Admin dashboard
  * Backend: `AdminOverviewController` with GET /api/admin/users, /api/admin/bookings, /api/admin/requests (ADMIN only)
  * Added `AdminUserResponse` DTO (no password), `getAllBookings()` and `getAllRequests()` (newest first)
  * Frontend: `AdminDashboard.jsx` page at /admin with tables for users, requests and bookings 
  * ProtectedRoute` with role ADMIN, "Admin" link in Navbar, Login redirects ADMIN to /admin 
  * Tested: admin sees all tables, customer is redirected to /login 
- Day 9: Deployment (all free)
  * Backend on Render (Free, Docker): `backend/Dockerfile`, `.dockerignore`, `server.port=${PORT:8080}`
  * Frontend on Vercel (Hobby): `vercel.json` so React Router refresh works 
  * api.js` reads `VITE_API_URL`; `SecurityConfig` reads `CORS_ORIGINS` (both fall back to localhost)
  * Render env variables: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, CORS_ORIGINS 
  * Live frontend: https://service-bid.vercel.app
  * Live backend: https://servicebid-ynj4.onrender.com (free instance sleeps when idle, first request takes about a minute)
  * Tested: login and Browse services work on the live site

## Current status
* Backend core workflow complete: auth, catalog, requests, bids, accept bid, bookings, status updates, reviews, provider rating.
* Next: deployment (Vercel, Render, Neon), README. Optional if time allows (free only): admin dashboard, provider profile. First, allow PATCH in SecurityConfig CORS. Then customer pages (browse services, create request, my requests, view bids, accept bid, bookings, review) and provider pages (open requests, submit bid, my bids, bookings, update status).
* Later: admin dashboard, deployment (Vercel, Render, Neon), README.

## About me
- Complete beginner in React and Spring Boot, some Java
- Small steps, exact file and click paths, text-only replies, keep answers short
- 7-day deadline, follow the instructions file, don't build ahead