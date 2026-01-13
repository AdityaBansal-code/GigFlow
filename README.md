# GigFlow - Mini Freelance Marketplace Platform

A full-stack freelance marketplace platform where **Clients** can post jobs (Gigs) and **Freelancers** can submit bids to work on them. Built with modern web technologies following industry best practices.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Security Features](#-security-features)
- [Contributing](#-contributing)

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure sign-up and login with JWT tokens
- 💼 **Gig Management** - Create, browse, and search for freelance jobs
- 💰 **Bidding System** - Freelancers can submit bids on open gigs
- 🎯 **Hiring Logic** - Clients can hire freelancers and manage bids
- 🔍 **Search & Filter** - Search gigs by title with real-time results
- 👥 **Fluid Roles** - Users can be both clients and freelancers

### Technical Features
- ✅ JWT authentication with HttpOnly cookies
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting for API protection
- ✅ Responsive UI with Tailwind CSS
- ✅ State management with Zustand
- ✅ Error handling and user feedback
- ✅ RESTful API design

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, express-rate-limit, cookie-parser, CORS

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

## 📁 Project Structure

```
GigFlow/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Input validation schemas
│   │   └── app.js             # Express app setup
│   ├── index.js               # Entry point
│   ├── package.json
│   └── README.md              # Backend documentation
│
├── frontend/                   # Frontend React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API service functions
│   │   ├── store/             # Zustand state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── README.md              # Frontend documentation
│
└── README.md                   # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AdityaBansal-code/Gig.git
cd GigFlow
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Update .env with your configuration
# Edit the .env file with your MongoDB URI and JWT secret
```

**Backend Environment Variables** (`.env`):
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Frontend Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### Option 2: Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Gig Endpoints

#### Get All Open Gigs
```http
GET /api/gigs?search=web development
```

#### Create Gig (Protected)
```http
POST /api/gigs
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "title": "Web Development Project",
  "description": "Need a full-stack developer",
  "budget": 5000
}
```

### Bid Endpoints

#### Create Bid (Protected)
```http
POST /api/bids
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "gigId": "gig_id_here",
  "message": "I have 5 years of experience",
  "price": 4500
}
```

#### Get Bids for Gig (Protected - Owner Only)
```http
GET /api/bids/:gigId
Cookie: token=<jwt_token>
```

#### Hire Freelancer (Protected - Owner Only)
```http
PATCH /api/bids/:bidId/hire
Cookie: token=<jwt_token>
```

For complete API documentation, see [backend/README.md](backend/README.md)

## 🏗️ Architecture

### Database Schema

**User Model:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Gig Model:**
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: 'open' | 'assigned',
  createdAt: Date,
  updatedAt: Date
}
```

**Bid Model:**
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: 'pending' | 'hired' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

### Key Features Implementation

#### Hiring Logic
When a client hires a freelancer:
1. Selected bid status changes to `'hired'`
2. Gig status changes to `'assigned'`
3. All other pending bids are automatically rejected
4. Prevents duplicate hiring on the same gig

#### Bidding System
- Freelancers cannot bid on their own gigs
- One bid per freelancer per gig (enforced by compound index)
- Only open gigs accept new bids
- Bids are sorted by creation date

#### Authentication Flow
1. User registers/logs in
2. Server generates JWT token
3. Token stored in HttpOnly cookie (secure, XSS-protected)
4. Cookie automatically sent with subsequent requests
5. Server validates token on protected routes

## 🔒 Security Features

### Backend Security
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Secure token generation with expiration
- **HttpOnly Cookies**: Prevents XSS attacks
- **Rate Limiting**: 
  - API routes: 100 requests/15 min
  - Auth routes: 5 requests/15 min
- **Input Validation**: express-validator on all inputs
- **CORS**: Configured for credential support
- **Request Sanitization**: Automatic trimming and sanitization

### Frontend Security
- **Protected Routes**: Authentication-based route guards
- **Credential Handling**: Automatic cookie management
- **Input Validation**: Client-side validation with React Hook Form
- **Error Handling**: User-friendly error messages

## 🎨 Frontend Features

### Pages
- **Home/Gigs**: Browse and search available gigs
- **Login/Register**: User authentication
- **Create Gig**: Post new jobs (authenticated users)
- **Gig Details**: View full gig information
- **View Bids**: See all bids for owned gigs (owners only)

### Components
- Layout with responsive header
- Protected and public route wrappers
- Reusable form components
- Loading states and error handling
- Success/error notifications
- Status badges for gigs and bids

### State Management (Zustand)
- **Auth Store**: User authentication state
- **Gig Store**: Gig listing and search
- **Bid Store**: Bid management
- Persistent storage for user session

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User registration with validation
- [ ] Login with correct/incorrect credentials
- [ ] Protected route access
- [ ] Session persistence

**Gig Management:**
- [ ] Create new gig
- [ ] Browse all gigs
- [ ] Search gigs by title
- [ ] View gig details

**Bidding:**
- [ ] Submit bid on open gig
- [ ] Prevent bidding on own gig
- [ ] Prevent duplicate bids
- [ ] View bids (owner only)

**Hiring:**
- [ ] Hire freelancer
- [ ] Verify gig status changes to 'assigned'
- [ ] Verify other bids are rejected
- [ ] Prevent hiring on assigned gig

## 📖 Additional Documentation

- [Backend Implementation Plan](backend/IMPLEMENTATION_PLAN.md)
- [Frontend Architecture Guide](frontend/FRONTEND_ARCHITECTURE_GUIDE.md)
- [Backend README](backend/README.md)
- [Assignment Requirements](backend/Full_stack_dev_assignment.pdf)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Aditya Bansal

## 🙏 Acknowledgments

- Built as a full-stack development assignment
- Follows industry best practices for MERN stack applications
- Implements secure authentication patterns
- Uses modern React patterns and hooks

---

**Note**: This is a demonstration project. For production use, additional features like email verification, password reset, payment integration, and comprehensive testing should be implemented.
