# ServiceBid demo script (about 8 minutes)

## Before the demo
- Open https://servicebid-ynj4.onrender.com/api/health about 2 minutes before. The free backend sleeps, and this wakes it up.
- Open two browser windows: a normal one and an Incognito one. Each holds a different login.
- Make sure prov and prov2 have ticked overlapping services in My profile (for example Plumbing).
- Optional: have one completed booking with a review, so the provider stats and chart look full.

## 1. Home page (logged out)
- Open https://service-bid.vercel.app
- Say: "ServiceBid is a marketplace where providers compete with bids, so the customer gets the best price."
- Scroll slowly: categories, trending photos, how it works, why choose us. Sections slide in on scroll.
- Click the round moon button to show dark mode (circular transition). Switch back.

## 2. Customer posts a request (normal window)
- Login: cust@test.com / secret123
- Click Browse services, type "plumb" in the search box.
- Click "Request this service".
- Fill in: description, budget 1000, date, location, and a bid deadline about 10 minutes from now.
- Submit. On the dashboard, point at the live countdown on the request card.

## 3. Providers bid (Incognito window)
- Login: prov@test.com / secret123
- Point at the bell: the red number shows the new matching request.
- Click the bell item, then place a bid: amount 900, message, "2 hours".
- Say: "Providers only see requests for services they offer, and bids are refused after the deadline."
- Logout, login as prov2@test.com, place a bid of 800.

## 4. Customer compares and accepts (normal window)
- Click the bell: "2 bids waiting". Open the request.
- Show the bids: cheapest first, smart tags (Lowest price, Top rated, Best value), ratings, bios.
- Click a provider name to show the public profile and reviews, then go back.
- Click "Accept this bid". A booking is created and the other bid is rejected.

## 5. Provider does the job (Incognito window)
- Login as the provider whose bid was accepted.
- Bell: "Your bid was accepted". Open My bookings.
- Click Confirm, then Start work (In progress).
- Say: "The provider cannot mark the job complete. Only the customer can."

## 6. Customer completes and reviews (normal window)
- Open My bookings. Show the progress timeline.
- Click the job-done button, then give a star rating and a comment.
- Open the invoice and use Print -> Save as PDF.

## 7. Provider dashboard (Incognito window)
- Open the provider dashboard: completed jobs, total earned and rating count up, plus the earnings chart.
- Optional, on a spare request: show "Withdraw bid" on My bids.

## 8. Admin (either window)
- Login: admin@test.com / secret123
- Admin page: counts and tables for users, requests and bookings.
- Click Catalog: add a category and a service, then open Browse services as a customer to show it appears.

## Closing points
- Roles and security: JWT login, role rules on every URL, passwords hashed with BCrypt.
- Rules in the backend: one bid per provider, only open requests get bids, only the owner can cancel or accept, completion needs the customer.
- Stack: React + Vite on Vercel, Spring Boot on Render (Docker), PostgreSQL on Neon. All free.
- Future: payments, chat, maps, image uploads.

## If something goes wrong
- A page shows an error or loads for a long time: the backend is waking up. Wait about a minute and refresh.
- A request has no bids to show: log in as the provider and place a bid first.