# AgriCon Express Backend

A robust backend service for managing agricultural operations that connect farmers to storage facilities, built with Node.js, TypeScript, and Prisma.

## 🚀 Project Overview

**AgriCon Nigeria** provides a secure and scalable API for facilitating connections between farmers and storage providers, enabling efficient storage of agricultural produce and reducing post-harvest losses.

### Key features include:

* Farmer registration and management
* Storage facility registration and availability tracking
* Produce storage requests and assignments
* Notifications for storage confirmations and updates
* Analytics on produce stored, storage utilization, and farmer activity

## 🛠️ Tech Stack

* **Node.js**
* **TypeScript**
* **Express.js**
* **Prisma ORM**
* **MySQL**
* **Jest** (for testing)

## 📦 Getting Started

### Prerequisites

* Node.js ≥ 16.x
* npm or yarn
* MySQL
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

3️⃣ Set the required environment variables:

```txt
# MySQL connection string
DATABASE_URL=""
# Secret key for signing JWTs
JWT_SECRET_KEY=
# API Port
PORT=5000
```

4️⃣ Install dependencies:

```bash
npm install
```

5️⃣ Generate Prisma client & apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

6️⃣ Start the application:

```bash
npm run dev
```

The API will be accessible at [http://localhost:5000/](http://localhost:5000/)

## 📄 API Documentation

You can explore and test endpoints via our Postman collection:
🔗 [View Postman Collection](https://documenter.getpostman.com/view/43614350/2sB2ixjZkQ)

## 🔌 Available Endpoints

### 👨‍🌾 Farmers

```
POST /api/v1/farmers – Register a new farmer

GET /api/v1/farmers – List all farmers

GET /api/v1/farmers/:id – Get details of a specific farmer
```

### 🏬 Storage Facilities

```
POST /api/v1/storage-facilities – Register a new storage facility

GET /api/v1/storage-facilities – List all storage facilities

GET /api/v1/storage-facilities/:id – Get details of a specific facility

GET /api/v1/storage-facilities/availability – Get available facilities
```

### 📦 Produce Storage

```
POST /api/v1/storage-requests – Create a produce storage request

GET /api/v1/storage-requests – List all storage requests

GET /api/v1/storage-requests/:id – Get details of a storage request

PUT /api/v1/storage-requests/:id – Update a storage request

DELETE /api/v1/storage-requests/:id – Cancel a storage request
```

### 🔔 Notifications

```
POST /api/v1/notifications – Send a notification

GET /api/v1/notifications – List all notifications

PATCH /api/v1/notifications/:id/read – Mark as read
```

### 📊 Analytics

```
GET /api/v1/analytics/storage – Get storage utilization stats

GET /api/v1/analytics/farmers – Get farmer activity stats
```

## 🧪 Running Tests

Run unit and integration tests:

```bash
npm test
```

## 🧑‍💻 Contributing

* Fork this repository
* Create your feature branch (`git checkout -b feat/feature-name`)
* Commit your changes (`git commit -m 'Add feature'`)
* Push to the branch (`git push origin feat/feature-name`)
* Open a Pull Request
