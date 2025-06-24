# AgriCon Express Backend

A robust backend service for managing agricultural facility bookings and operations, built with Node.js, TypeScript, and Prisma.

## 🚀 Project Overview

AgriCon Express provides a secure and scalable API for handling agricultural facility bookings, facility management, and user operations within an agricultural infrastructure ecosystem.

### Key features include:
- Facility management (view, update)
- Booking operations (create, delete)
- User authentication and authorization
- Health monitoring and database connectivity

## 🛠️ Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Jest** (for testing)

## 📦 Getting Started

### Prerequisites

- Node.js ≥ 16.x
- npm or yarn
- PostgreSQL
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

## Installation Instructions

1. Clone the repository:

```bash
git clone https://github.com/InternPulse/agricon-express-backend.git
```

2. Change into the project directory:

```bash
cd agricon-express-backend
```

3. Set appropriate values for the following Compulsory Environment Variables:

```txt
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:port/database"
# Secret key for signing JWTs
JWT_SECRET="your-secret-key"
# API Port
PORT=4000
```

4. Install the App dependencies:

```bash
npm install
```

5. Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma db push
```

6. Start the App:

```bash
npm run dev
```

The API should now be running locally at [http://localhost:4000/](http://localhost:4000/)

## 🔌 Available Endpoints

Here's an overview of available routes:

### 🏥 Health & Database
```
GET /api/v1/health – Health check endpoint
POST /api/v1/init-db – Initialize database tables
```

### 🏭 Facilities
```
GET /api/v1/facilities/:facilityId – Get facility details
PUT /api/v1/facilities/:facilityId – Update facility details
```

### 📅 Bookings
```
POST /api/v1/bookings/create-booking – Create a new booking
DELETE /api/v1/bookings/:bookingId – Delete a booking
```

## 🔐 Authentication

The application currently uses mock authentication for development purposes. When making API requests, include the following header:

```
mock-user: farmer@example.com
```

### Example Request
```bash
curl -X POST http://localhost:4000/api/v1/bookings/create-booking \
-H "Content-Type: application/json" \
-H "mock-user: farmer@example.com" \
-d '{
  "facilityId": "your-facility-id-here",
  "amount": 150.00,
  "startDate": "2025-06-20T10:00:00.000Z",
  "endDate": "2025-06-25T10:00:00.000Z"
}'
```

## 🗄️ Database Schema

The application uses the following main entities:

- **User** - Base user entity (referenced from Django)
- **Farmer** - Agricultural producers who book facilities
- **Operator** - Facility owners who manage infrastructure
- **Facility** - Agricultural infrastructure (dryers, storage, processing)
- **Booking** - Facility reservations made by farmers

## 🧪 Running Tests
```bash
npm test
```

## 🛠️ Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build the TypeScript code
- `npm run lint` - Run ESLint

## ��‍💻 Contributing

- Fork the repo
- Create your branch (git checkout -b feat/feature-name)
- Commit your changes
- Push and open a Pull Request

## 📝 Notes

- The application is configured to work with Render.com PostgreSQL database
- Mock authentication is used for development; real JWT authentication is prepared but commented out
- Database schema includes references to Django/.NET tables for user management
