# AgriCon Express Backend

A robust backend service for managing agricultural storage facility bookings, built with Node.js, TypeScript, and Prisma. This service connects farmers with storage facility operators to facilitate efficient storage of agricultural produce.

## 🚀 Project Overview

**AgriCon** provides a secure and scalable API for managing bookings between farmers and storage facility operators. The system enables farmers to book storage facilities for their agricultural produce while providing operators with tools to manage their facilities and bookings.

### Key Features

* **User Management**: Support for farmers and facility operators with role-based authentication
* **Facility Management**: Operators can register and manage storage facilities with pricing and availability
* **Booking System**: Farmers can book storage facilities with flexible date ranges
* **Payment Tracking**: Integrated payment status tracking for bookings
* **Role-based Authorization**: Secure access control based on user roles
* **Database Integration**: PostgreSQL database with Prisma ORM

## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Language**: TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: JWT
* **Testing**: Jest
* **Validation**: Express Validator
* **Deployment**: Render

## 📦 Getting Started

### Prerequisites

* Node.js ≥ 16.x
* npm or yarn
* PostgreSQL database
* [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

### Installation Instructions

1️⃣ Clone the repository:

```bash
git clone https://github.com/InternPulse/agricon-express-backend.git
```

2️⃣ Change into the directory:

```bash
cd agricon-express-backend
```

3️⃣ Install dependencies:

```bash
npm install
```

4️⃣ Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/agricon_db"

# JWT secret for authentication
JWT_SECRET="your-secret-key-here"

# Server port
PORT=4000

# Environment
NODE_ENV=development

# Render deployment (optional)
RENDER_SERVICE_ID=""
RENDER_API_KEY=""
```

5️⃣ Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed with mock data
npm run seed
```

6️⃣ Start the development server:

```bash
npm run dev
```

The API will be accessible at `http://localhost:4000`

## 📄 API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Rate Limiting

This API implements comprehensive rate limiting to prevent abuse and ensure fair usage. Different endpoints have specific rate limits based on their usage patterns:

### Rate Limit Configuration

| Endpoint Type | Rate Limit | Window | Description |
|---------------|------------|--------|-------------|
| **General** | 100 requests | 15 minutes | Applied globally to all endpoints |
| **Booking Operations** | 10 requests | 1 hour | For booking creation, updates, and management |
| **Facility Operations** | 20 requests | 15 minutes | For facility management and queries |
| **Health Check** | 30 requests | 1 minute | For health monitoring endpoints |
| **Database Operations** | 5 requests | 5 minutes | For database initialization and maintenance |

### Rate Limit Headers

When rate limits are exceeded, the API returns:
- **Status Code**: `429 Too Many Requests`
- **Headers**: `RateLimit-*` headers with limit information
- **Response**: JSON with error message and retry time

### Example Rate Limit Response

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

## 🔌 Available Endpoints

### 🏥 Health Check
```
GET /api/v1/health - Health check endpoint
POST /api/v1/init-db - Initialize database connection
```

### 🏬 Storage Facilities

```
POST /api/v1/facilities - Create a new storage facility (Operator only)
GET /api/v1/facilities - List all facilities
GET /api/v1/facilities/:facilityId - Get specific facility details
PUT /api/v1/facilities/:facilityId - Update facility (Facility owner only)
DELETE /api/v1/facilities/:facilityId - Remove facility (Facility owner only)
```

### 📦 Bookings

```
POST /api/v1/bookings - Create a new booking (Farmer only)
GET /api/v1/bookings/farmer/me - Get farmer's bookings
GET /api/v1/bookings/operator/me - Get operator's facility bookings
GET /api/v1/bookings/:bookingId - Get specific booking details
PATCH /api/v1/bookings/:bookingId - Update booking
DELETE /api/v1/bookings/:bookingId - Cancel booking
PATCH /api/v1/bookings/:bookingId/expire - Expire booking
```

## 🗄️ Database Schema

The application uses the following main entities:

### Users
- **users_user**: Core user accounts with email, password, and role
- **Farmer**: Farmer profiles with personal information
- **Operator**: Facility operator profiles with business information

### Facilities
- **Facility**: Storage facilities with location, type, capacity, and pricing
- **FacilityType**: Enum (DRYER, STORAGE, PROCESSING, OTHERS)

### Bookings
- **Booking**: Storage bookings with dates, amounts, and payment status
- **Transaction**: Payment transactions linked to bookings

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🚀 Deployment

The application is configured for deployment on Render. The deployment process:

1. Builds the TypeScript code
2. Fixes import statements for production
3. Starts the application on the configured port

### Build Commands

```bash
# Development build
npm run build

# Production build for Render
npm run build:render

# Start production server
npm start
```

## 🧑‍💻 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run start:dev    # Start development server without hot reload
npm run build        # Build TypeScript to JavaScript
npm run build:render # Build for Render deployment
npm run test         # Run tests
npm run lint         # Run ESLint
npm run seed         # Seed database with mock data
npm run migrate      # Run database migrations
```

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── errors/          # Error handling
├── __tests__/       # Test files
├── app.ts           # Express app configuration
└── index.ts         # Application entry point
```

## 🔐 Security Features

- JWT-based authentication
- Role-based authorization (Farmer, Operator, Admin)
- Input validation using Express Validator
- Secure password handling
- CORS protection
- Request rate limiting

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feat/feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feat/feature-name`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues, please report them on the [GitHub Issues page](https://github.com/InternPulse/agricon-express-backend/issues).
