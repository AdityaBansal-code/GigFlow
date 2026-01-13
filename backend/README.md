# GigFlow Backend API

A mini-freelance marketplace platform backend built with Node.js, Express.js, and MongoDB. This API allows **Clients** to post jobs (Gigs) and **Freelancers** to apply for them (Bids).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Project Structure](#project-structure)

## Features

- ✅ User Authentication (Sign-up & Login with JWT)
- ✅ Gig Management (Create, Browse, Search)
- ✅ Bidding System (Submit bids on gigs)
- ✅ Hiring Logic (Clients can hire freelancers)
- ✅ Role-based Access Control
- ✅ Input Validation
- ✅ Error Handling
- ✅ Rate Limiting
- ✅ Request Sanitization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies
- **Validation**: express-validator
- **Security**: express-rate-limit, bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GigFlow/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Update `.env` file with your configuration (see [Environment Variables](#environment-variables))

5. Start MongoDB (if running locally):
```bash
mongod
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gigflow

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Authentication**: Not required
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Login User
- **POST** `/api/auth/login`
- **Description**: Login and receive JWT token in HttpOnly cookie
- **Authentication**: Not required
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Gigs

#### Get All Open Gigs
- **GET** `/api/gigs`
- **Description**: Get all open gigs (public endpoint)
- **Authentication**: Not required
- **Query Parameters**:
  - `search` (optional): Search gigs by title (case-insensitive)
- **Example**: `/api/gigs?search=web development`
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Web Development Project",
      "description": "Need a full-stack developer",
      "budget": 5000,
      "status": "open",
      "ownerId": {
        "_id": "...",
        "name": "Client Name",
        "email": "client@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Create Gig
- **POST** `/api/gigs`
- **Description**: Create a new gig
- **Authentication**: Required
- **Request Body**:
```json
{
  "title": "Web Development Project",
  "description": "Need a full-stack developer for e-commerce site",
  "budget": 5000
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "Gig created successfully",
  "data": {
    "_id": "...",
    "title": "Web Development Project",
    "description": "Need a full-stack developer for e-commerce site",
    "budget": 5000,
    "status": "open",
    "ownerId": {
      "_id": "...",
      "name": "Client Name",
      "email": "client@example.com"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Bids

#### Create Bid
- **POST** `/api/bids`
- **Description**: Submit a bid on a gig
- **Authentication**: Required
- **Request Body**:
```json
{
  "gigId": "gig_id_here",
  "message": "I have 5 years of experience in web development",
  "price": 4500
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "Bid created successfully",
  "data": {
    "_id": "...",
    "gigId": "...",
    "freelancerId": {
      "_id": "...",
      "name": "Freelancer Name",
      "email": "freelancer@example.com"
    },
    "message": "I have 5 years of experience",
    "price": 4500,
    "status": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Get Bids by Gig
- **GET** `/api/bids/:gigId`
- **Description**: Get all bids for a specific gig (owner only)
- **Authentication**: Required
- **Authorization**: Only gig owner can access
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "gigId": "...",
      "freelancerId": {
        "_id": "...",
        "name": "Freelancer Name",
        "email": "freelancer@example.com"
      },
      "message": "I have 5 years of experience",
      "price": 4500,
      "status": "pending",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Hiring

#### Hire Freelancer
- **PATCH** `/api/bids/:bidId/hire`
- **Description**: Hire a freelancer (changes gig status to 'assigned' and rejects other bids)
- **Authentication**: Required
- **Authorization**: Only gig owner can hire
- **Response** (200):
```json
{
  "success": true,
  "message": "Freelancer hired successfully",
  "data": {
    "bid": {
      "_id": "...",
      "status": "hired",
      "freelancerId": {...},
      "gigId": {...}
    },
    "gig": {
      "_id": "...",
      "status": "assigned",
      ...
    }
  }
}
```

## Database Schema

### User
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, validated),
  password: String (required, min 6 chars, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Gig
```javascript
{
  title: String (required, trimmed),
  description: String (required),
  budget: Number (required, min 0),
  ownerId: ObjectId (ref: 'User', required),
  status: String (enum: ['open', 'assigned'], default: 'open'),
  createdAt: Date,
  updatedAt: Date
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: 'Gig', required),
  freelancerId: ObjectId (ref: 'User', required),
  message: String (required, trimmed),
  price: Number (required, min 0),
  status: String (enum: ['pending', 'hired', 'rejected'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- Gig: `status`, `title` (text index for search)
- Bid: `{gigId, freelancerId}` (compound unique), `gigId`, `status`

## Authentication

The API uses JWT (JSON Web Tokens) stored in HttpOnly cookies for authentication.

1. **Register/Login**: User receives a JWT token in an HttpOnly cookie
2. **Protected Routes**: Include the cookie in requests (automatically handled by browsers)
3. **Token Expiration**: 7 days (configurable via `JWT_EXPIRE`)

**Cookie Settings**:
- `httpOnly: true` (prevents XSS attacks)
- `secure: true` (in production, HTTPS only)
- `sameSite: 'strict'` (CSRF protection)

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": "Stack trace (development only)"
}
```

**HTTP Status Codes**:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (authorization failed)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## Security Features

1. **Rate Limiting**:
   - API routes: 100 requests per 15 minutes per IP
   - Auth routes: 5 requests per 15 minutes per IP

2. **Input Validation**: All inputs validated using express-validator

3. **Request Sanitization**: Automatic trimming and sanitization of user inputs

4. **Password Security**: 
   - Bcrypt hashing (10 salt rounds)
   - Passwords never returned in API responses

5. **CORS**: Configured to allow credentials (cookies)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── gigController.js      # Gig management logic
│   │   ├── bidController.js      # Bidding logic
│   │   └── hiringController.js   # Hiring logic
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── authorization.js      # Authorization checks
│   │   ├── errorHandler.js      # Global error handler
│   │   └── security.js           # Rate limiting, sanitization
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Gig.js                # Gig schema
│   │   └── Bid.js                # Bid schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── gigRoutes.js          # Gig endpoints
│   │   ├── bidRoutes.js          # Bid endpoints
│   │   ├── hiringRoutes.js       # Hiring endpoints
│   │   └── index.js              # Main router
│   ├── utils/
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   ├── errors.js              # Custom error classes
│   │   ├── jwt.js                 # JWT utilities
│   │   └── response.js            # Response helpers
│   ├── validators/
│   │   ├── authValidator.js       # Auth validation
│   │   ├── gigValidator.js        # Gig validation
│   │   └── bidValidator.js       # Bid validation
│   └── app.js                     # Express app setup
├── index.js                       # Entry point
├── package.json
├── env.example                    # Environment variables template
└── README.md
```

## License

ISC

## Author

GigFlow Development Team
