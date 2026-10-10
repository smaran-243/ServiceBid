# ServiceBid

A service marketplace with competitive bidding. Customers post a request, providers compete with bids, and the customer accepts the best offer, tracks the job and leaves a review.

**Live demo**
- Frontend: https://service-bid.vercel.app
- Backend API: https://servicebid-ynj4.onrender.com

The backend runs on a free Render instance that sleeps when idle. The first request after a pause can take about a minute.

## Demo accounts (password: secret123)

| Role | Email |
|------|-------|
| Customer | cust@test.com |
| Provider | prov@test.com |
| Provider | prov2@test.com |
| Admin | admin@test.com |

## Features

**Customer**
- Browse 19 services in 9 categories, with search
- Post a request with description, budget, date and location
- Compare bids side by side, with smart tags (Lowest price, Top rated, Best value)
- Accept a bid, which creates a booking
- Track the booking with a progress timeline
- Confirm the job is done, then leave a star review
- Cancel a booking before work starts
- View a provider's public profile and reviews
- Invoice for completed bookings (print or save as PDF)

**Provider**
- Choose the services they offer, and write a bio
- See only open requests that match their services
- Place bids and manage bookings (Confirmed, In progress)
- Dashboard with completed jobs, total earned, average rating and an earnings chart

**Admin**
- Overview of all users, requests and bookings

**General**
- JWT login with roles (Customer, Provider, Admin)
- Dark mode, toast messages, empty states, loading skeletons
- Responsive layout for mobile

## Tech stack

- Frontend: React, Vite, React Router, plain CSS, react-hot-toast
- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, JWT (jjwt)
- Database: PostgreSQL on Neon
- Hosting (all free tiers): Vercel (frontend), Render with Docker (backend), Neon (database)
- Avatars: DiceBear (https://www.dicebear.com), free cartoon faces generated from a name

## Run locally

Backend (folder `backend`), with these environment variables set: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (40+ characters). Then run `BackendApplication`. It starts on port 8080.

Frontend (folder `frontend`):

```
npm install
npm run dev
```

It opens on http://localhost:5173.

## Future improvements

- Online payments   
- In-app chat between customer and provider
- Maps and distance to the job location
- Image uploads for requests and provider profiles
- Notifications and bid deadlines with a countdown
- Sidebar layout for dashboards