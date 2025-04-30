# Compass Reservation API

A RESTful API developed using NestJS, TypeScript, Prisma, and MySQL for managing space reservations. It includes authentication with JWT, modular architecture, and Swagger documentation.

---

## Requirements

- Node.js v18+
- Docker & Docker Compose
- npm

---

## Tech Stack

- NestJS 10+
- Prisma ORM
- MySQL 8
- JWT Authentication
- Swagger 8 for API docs
- Jest for unit testing

---

## Installation & Setup

- Clone the repository

```bash
git clone https://github.com/onelife-dev/ANMAR25_D02_COMPASSRESERVATION.git
cd ANMAR25_D02_COMPASSRESERVATION
```

- Install dependencies

```bash
npm install
```

- Create a .env file

```env
DATABASE_URL="mysql://root:your-password@localhost:3306/compass_reservation"
JWT_SECRET="your-secret"
```

- Run MySQL with Docker

```bash
docker-compose up -d
```

- Generate Prisma client and apply migrations

```bash
npx prisma generate
npx prisma migrate dev
```

- Start the application

```bash
npm run dev
```

---

## API Documentation (Swagger)

Once the server is running, access:

🔗 http://localhost:3000/api

---

## Authentication

All protected routes require a Bearer token.

- Make a POST request to /auth/login
- Copy the access_token from the response
- Use it in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Scripts

| Command              | Description                         |
|----------------------|-------------------------------------|
| npm run dev    | Start the server in dev mode        |
| npx prisma migrate   | Run database migrations             |
| npx prisma studio    | Open Prisma Studio (DB Viewer)      |
| npm run test         | Run unit tests                      |
| npm run build        | Compile project to dist/            |

---

## Test User (Seed)

You can create a seed user with the following command:

```bash
npx prisma db seed
```

Make sure your seed.ts uses credentials from environment variables.

---