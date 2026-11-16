# GigFlow

A full-stack freelance marketplace. Clients post gigs, freelancers bid on them, and a client hires one freelancer, which closes the gig and rejects the other pending bids.

**Live:** https://trygigflow.vercel.app

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![Node](https://img.shields.io/badge/node-LTS-brightgreen.svg)

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [API overview](#api-overview)
- [Data model](#data-model)
- [How hiring works](#how-hiring-works)
- [Authentication and security](#authentication-and-security)
- [Testing](#testing)
- [Known limitations](#known-limitations)
- [License](#license)

## Features

- **Accounts:** register and log in with email and password. One user can act as both client and freelancer.
- **Gigs:** create, edit, delete, browse and search by title. Gigs have a category (Web Dev, Design, Writing, Marketing, Data, Other) and a difficulty level (Basic, Intermediate, Advanced).
- **Bids:** freelancers bid on open gigs with a message and a price, and can withdraw a bid. A freelancer cannot bid on their own gig or bid twice on the same gig.
- **Hiring:** the gig owner views the bids on their gig and hires one. The chosen bid becomes `hired`, the gig becomes `assigned`, and the other pending bids become `rejected`.
- **Profiles and reviews:** user profiles with bio, skills and rating summary, and reviews between users.
- **Dashboard** with an overview of a user's gigs and bids.

## Tech stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, Vite, React Router 7, Zustand, Axios, React Hook Form, Tailwind CSS 3 |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT (HttpOnly cookie, also accepted as a Bearer token), bcryptjs |
| Validation | express-validator |

## Project structure

```text
GigFlow/
├── backend/
│   ├── index.js              Entry point
│   ├── env.example           Environment variable template
│   ├── test-race-condition.js  Manual script (see Testing)
│   └── src/
│       ├── app.js            Express app setup
│       ├── config/           Database connection
│       ├── routes/           Route definitions
│       ├── controllers/      Request handlers and business rules
│       ├── validators/       express-validator rules
│       ├── middleware/       Auth, authorization, error handler, request sanitising
│       ├── models/           Mongoose schemas (User, Gig, Bid, Review)
│       └── utils/            JWT, response and error helpers
├── frontend/
│   ├── vercel.json           SPA rewrite for Vercel
│   └── src/
│       ├── pages/            Home, Gigs, GigDetails, CreateGig, ViewBids, Dashboard, profile pages, Login, Register
│       ├── components/       Layout, route guards, gig / bid / review components
│       ├── store/            Zustand stores (auth, gig, bid, profile, review)
│       ├── services/         API calls
│       └── utils/            Axios client
└── CHANGES.md                Notes on later additions (profiles, reviews, dashboard)
```

## Getting started

### Prerequisites

- A current Node.js LTS release
- A MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
npm install
cp env.example .env
```

Set these values in `backend/.env`:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev      # nodemon
# or: npm start
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

If `VITE_API_URL` is not set, the client falls back to `http://localhost:8000`.

```bash
npm run dev      # http://localhost:5173
npm run build    # production build
```

## API overview

All routes are under `/api`. "Auth" means the request must carry a valid JWT.

| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register`, `/auth/login` | No | Create account, log in |
| GET | `/gigs`, `/gigs/:id` | No | List gigs (supports `?search=`), get one gig |
| POST / PATCH / DELETE | `/gigs`, `/gigs/:id` | Yes | Create, update, delete a gig (owner) |
| POST | `/bids` | Yes | Place a bid on a gig |
| GET | `/bids/:gigId` | Yes | List bids on a gig (gig owner) |
| PATCH | `/bids/:bidId/withdraw` | Yes | Withdraw a bid |
| PATCH | `/bids/:bidId/hire` | Yes | Hire the freelancer behind a bid (gig owner) |
| GET / PATCH | `/profile/me`, `/profile/me/stats`, `/profile/:userId` | Mixed | Profiles |
| POST / GET | `/reviews`, `/reviews/user/:userId`, `/reviews/gig/:gigId` | Mixed | Reviews |
| GET | `/dashboard` | Yes | Dashboard data |

## Data model

- **User:** name, unique email, hashed password (bcrypt, 10 salt rounds), optional profile fields (bio, skills, photo, portfolio) and rating summary.
- **Gig:** title, description, budget, owner, category, difficulty, `status` of `open` or `assigned`. Indexed on status, category + status, difficulty, and a text index on title.
- **Bid:** gig, freelancer, message, price, `status` of `pending`, `hired`, `rejected` or `withdrawn`. A unique compound index on (gig, freelancer) enforces one bid per freelancer per gig.
- **Review:** gig, bid, reviewer, reviewee, rating; unique per (gig, bid, reviewer).

## How hiring works

`PATCH /api/bids/:bidId/hire` (in `controllers/hiringController.js`):

1. Loads the bid and its gig.
2. Checks that the caller owns the gig, the gig is still `open`, and the bid is still `pending`.
3. Marks the bid `hired`, marks the gig `assigned`, and rejects the other pending bids on that gig.

Step 3 is three separate database writes. See the first known limitation below.

## Authentication and security

- Passwords are hashed with bcryptjs (10 salt rounds).
- On register and login the server sets a `token` cookie (HttpOnly, `Secure` in production, `SameSite=None` in production and `Lax` in development, 7-day lifetime). It also returns the token in the response body. The frontend stores it in browser local storage (via the persisted Zustand auth store) and sends it as an `Authorization: Bearer` header, so page scripts can read the token even though the cookie itself is HttpOnly.
- Protected routes use an `authenticate` middleware; owner-only actions (hiring, viewing a gig's bids, editing a gig) check ownership in the controller.
- Request bodies are validated with express-validator. The global `sanitizeInput` middleware only trims strings; it does not escape or filter HTML.
- CORS reflects the request origin with credentials enabled (`origin: true`).
- Duplicate-key errors from MongoDB are translated into friendly API errors.

## Testing

There is no automated test suite. `backend/test-race-condition.js` is a manual script intended to send two hire requests at the same time. It contains placeholder gig IDs, bid IDs and a cookie that you must fill in before running it, and its results have not been recorded in this repository.

Manual checklist: registration and login, protected routes, creating and searching gigs, bidding (including own-gig and duplicate-bid rejection), hiring (gig becomes `assigned`, other bids become `rejected`, hiring on an assigned gig is refused).

## Known limitations

- **The hire flow is not atomic.** The status checks and the three writes are separate operations with no transaction and no conditional update on the gig. Two hire requests for different bids on the same gig that arrive close together could both pass the checks. This was identified by reading the code and has not been reproduced. A fix would be to make the gig update the deciding write (update it only where `status` is `open` and continue only if it matched) or to run the three writes in one transaction.
- **Rate limiters are not active.** `middleware/security.js` defines `apiLimiter` and `authLimiter` with `express-rate-limit`, but they are not mounted in the app, so no rate limiting is applied yet.
- **Token exposure:** the JWT is also kept in local storage and sent as a Bearer header (see above), so the HttpOnly cookie does not keep it away from page scripts, and cookie settings alone do not protect against CSRF.
- **CORS** currently allows any origin with credentials; it should be restricted to the known frontend origin before real use.
- **No automated tests** and no CI.
- Demonstration project: no email verification, password reset or payments.

## License

ISC (see `backend/package.json`). There is no separate `LICENSE` file.
