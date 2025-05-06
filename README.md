# Compass Reservation API

A RESTful API developed using **NestJS**, **TypeScript**, **Prisma**, and **MySQL** for managing space reservations. It includes JWT authentication, a modular architecture, and auto-generated Swagger documentation.

## 🧭 Table of Contents

- [Requirements](#requirements)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Authentication](#authentication)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Scripts](#scripts)
- [Testing](#testing)
- [Test User (Seed)](#test-user-seed)
- [Testing the API with Postman](#-testing-the-api-with-postman)

## Requirements

- Node.js v18+
- Docker & Docker Compose
- npm

## Tech Stack

| Tool             | Version |
| ---------------- | ------- |
| Node.js          | 18+     |
| NestJS           | 10+     |
| TypeScript       | 5+      |
| Prisma ORM       | 5+      |
| MySQL (Docker)   | 8+      |
| Swagger (nestjs) | 8+      |
| JWT              | Latest  |
| Jest             | 29+     |

## Project Structure

```bash
.
├── dist/                 # Compiled files
├── node_modules/         # Dependencies
├── prisma/               # Prisma scheme & migrations
│   ├── migrations/
│   └── schema.prisma
├── src/                  # Main source code
│   ├── auth/             # Authentication (JWT, login)
│   ├── clients/          # Customer module
│   ├── prisma/           # PrismaService wrapper
│   ├── resources/        # Resource module
│   ├── space/            # Space module
│   └── user/             # User module
├── test/                 # Unit tests e e2e
├── .env.example          # Example of environment variables
├── docker-compose.yml    # Database with Docker
├── README.md             # Project Documentation
├── package.json          # Npm configuration
└── tsconfig.json         # TypeScript configuration

```

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/onelife-dev/ANMAR25_D02_COMPASSRESERVATION.git
cd ANMAR25_D02_COMPASSRESERVATION
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file

```env
MYSQL_ROOT_PASSWORD=your_database_password
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_user_name
MYSQL_PASSWORD=your_user_password
DATABASE_URL="mysql://root:your_password@localhost:3306/compass_reservation"
JWT_SECRET="your_secret"
```

### 4. Run MySQL with Docker

```bash
docker-compose up -d
```

### 5. Generate Prisma client and apply migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start the application

```bash
npm run start:dev
```

API is available at: [http://localhost:3000](http://localhost:3000)

## Authentication

All protected routes require a Bearer token.

1. Make a POST request to `/auth/login`
2. Copy the `access_token` from the response
3. Use it in the Authorization header:

```
Authorization: Bearer <access_token>
```

## API Documentation (Swagger)

Once the server is running, access:

🔗 http://localhost:3000/api

## Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| npm run start:dev      | Start the server in dev mode   |
| npx prisma migrate dev | Run database migrations        |
| npx prisma generate    | Compile project to dist/       |
| npx prisma studio      | Open Prisma Studio (DB Viewer) |
| npm run test           | Run unit tests                 |
| npm run build          | Compile project to dist/       |

## Testing

To run all unit tests:

```bash
npm run test
```

To see coverage:

```bash
npm run test:cov
```

## Test User (Seed)

Execute the command below to create an admin user:

```bash
npx prisma db seed
```

> Ensure your `prisma/seed.ts` file uses environment variables for the credentials.

## 🧪 Testing the API with Postman

### 🔁 1. Import Postman Collection

Create your own or include routes like:

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register a new user         |
| POST   | `/auth/login`    | Authenticate and get token  |
| GET    | `/users`         | List all users (auth)       |
| POST   | `/clients`       | Create a client (auth)      |
| POST   | `/spaces`        | Create a space (auth)       |
| POST   | `/resources`     | Create a resource (auth)    |
| POST   | `/reservations`  | Create a reservation (auth) |

### 🛡️ 2. Set up Environment Variables

Create a Postman environment with:

| Key        | Initial Value           | Example                    |
| ---------- | ----------------------- | -------------------------- |
| `base_url` | `http://localhost:3000` | Your local API base URL    |
| `token`    | _(leave empty)_         | Will be filled after login |

### 🔐 3. Authenticate and Use the Token

1. Send a `POST` request to: `{{base_url}}/auth/login` with:

```json
{
  "email": "your@email.com",
  "password": "yourPassword"
}
```

2. Copy the `access_token` from the response.

3. Go to your environment in Postman and set the `token` variable:

```
token = <your access token>
```

### 🧾 4. Use the Token in Authorization Header

Set Authorization header for all authenticated routes:

```
Authorization: Bearer {{token}}
```

Or configure it in the “Authorization” tab using:

- Type: **Bearer Token**
- Token: `{{token}}`

### 📬 5. Examples

You can use the following examples to test the API routes via Postman.

---

### 🔐 Authentication(Public API)

#### Login

- **Method**: POST
- **Endpoint**: `POST /auth/login`
- **Body**:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

- Successful Response (example):

  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODIzNzE4ODEsImV4cCI6MTY4MjM3NTQ4MX0.example_jwt_token"
  }
  ```

#### User Registration

- **Method**: POST
- **Endpoint**: `POST /auth/register`
- **Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "telephone": "11999999999"
}
```

- Successful Response (example):

```json
{
  "id": 1,
  "name": "New User",
  "email": "new@example.com",
  "telephone": "11999999999",
  "status": "active",
  "createdAt": "2025-05-06T13:21:00.000Z",
  "updatedAt": "2025-05-06T13:21:00.000Z"
}
```

- Error Response (validation - example):

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters",
    "password must contain at least one letter",
    "password must contain at least one number",
    "telephone must be a valid phone number"
  ],
  "error": "Bad Request"
}
```

---

### 👤 Users (Private API - Requires Token)

#### Create User

- **Method**: POST
- **Endpoint**: `{{base_url}}/users`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body**:

```json
{
  "name": "Another User",
  "email": "another@example.com",
  "password": "anotherSecurePassword456",
  "telephone": "21888888888"
}
```

#### Edit User

- **Method**: PATCH
- **Endpoint**: `{{base_url}}/users/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw-JSON)** - partial edits examples:

```json
{
  "name": "Updated Name"
}
```

```json
{
  "telephone": "31777777777"
}
```

**Successful Response (example)**:

```json
{
  "id": 4,
  "name": "Updated Name",
  "email": "another@example.com",
  "telephone": "31777777777",
  "status": "active",
  "createdAt": "2025-05-06T13:25:00.000Z",
  "updatedAt": "2025-05-06T13:27:00.000Z"
}
```

#### List Users (Paginated and Filtered)

- **Method**: GET
- **Endpoint**: `{{base_url}}/users?page=1&limit=10&name=part_of_name&email=part_of_email&status=active`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Query Parameters (optional)**:

- page: Page number (default: 1)

- limit: Items per page (default: 20)

- name: Filter by part of the name.

- email: Filter by part of the email.

- status: Filter by status (active or inactive). If omitted, returns both.

**Successful Response (example)**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "telephone": "00000000000",
      "status": "active",
      "createdAt": "2025-05-06T13:00:00.000Z",
      "updatedAt": "2025-05-06T13:00:00.000Z"
    }
    // ... other users
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### Find User by ID

- **Method**: GET
- **Endpoint**: `{{base_url}}/users/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "telephone": "00000000000",
  "status": "active",
  "createdAt": "2025-05-06T13:00:00.000Z",
  "updatedAt": "2025-05-06T13:00:00.000Z"
}
```

- Error Response (user not found): (same structure as error in edit)

#### Delete User (Inactivate)

- **Method**: DELETE
- **Endpoint**: `{{base_url}}/users/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- Error Response (user not found): (same structure as error in edit)

### 👤 Clients (Private API - Requires Token)

#### Create Client

- **Method**: POST
- **Endpoint**: `{{base_url}}/clients`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw- JSON)**:

```json
{
  "name": "New Client",
  "cpf": "123.456.789-00",
  "birthDate": "1990-01-15",
  "email": "client@example.com",
  "telephone": "5577777777777"
}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "New Client",
  "cpf": "123.456.789-00",
  "birthDate": "1990-01-15",
  "email": "client@example.com",
  "telephone": "55777777777",
  "status": "active",
  "createdAt": "2025-05-06T14:00:00.000Z",
  "updatedAt": "2025-05-06T14:00:00.000Z"
}
```

**Error Response (validation - example)**:

```json
{
  "statusCode": 400,
  "message": [
    "cpf must be a valid CPF number",
    "email must be an email",
    "birthDate must be a valid date"
  ],
  "error": "Bad Request"
}
```

**Error Response (CPF or Email already exists)**:

```json
{
  "statusCode": 409,
  "message": "CPF or Email already exists",
  "error": "Conflict"
}
```

#### Edit Client

- **Method**: PATCH
- **Endpoint**: `{{base_url}}/clients/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw-JSON)** - partial edits examples:

```json
{
  "name": "Updated Name"
}
```

```json
{
  "telephone": "31777777777"
}
```

**Successful Response (example)**:

```json
{
  "id": 4,
  "name": "Updated Name",
  "email": "another@example.com",
  "telephone": "31777777777",
  "status": "active",
  "createdAt": "2025-05-06T13:25:00.000Z",
  "updatedAt": "2025-05-06T13:27:00.000Z"
}
```

**Error Response (client not found)**:

```json
{
  "statusCode": 404,
  "message": "Client not found",
  "error": "Not Found"
}
```

#### List Clients (Paginated and Filtered)

- **Method**: GET
- **Endpoint**: `{{base_url}}/clients?page=1&limit=10&name=part_of_name&email=part_of_email&cpf=part_of_cpf&status=active`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Query Parameters (optional)**:

- page: Page number (default: 1)

- limit: Items per page (default: 20)

- name: Filter by part of the name.

- email: Filter by part of the email.

- status: Filter by status (active or inactive). If omitted, returns both.

- cpf: Filter by part of the cpf.

**Successful Response (example)**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "New Client",
      "cpf": "123.456.789-00",
      "birthDate": "1990-01-15",
      "email": "client@example.com",
      "telephone": "55777777777",
      "status": "active",
      "createdAt": "2025-05-06T14:00:00.000Z",
      "updatedAt": "2025-05-06T14:00:00.000Z"
    }
    // ... other clients
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

#### Find Client by ID

- **Method**: GET
- **Endpoint**: `{{base_url}}/clients/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "New Client",
  "cpf": "123.456.789-00",
  "birthDate": "1990-01-15",
  "email": "client@example.com",
  "telephone": "55777777777",
  "status": "active",
  "createdAt": "2025-05-06T14:00:00.000Z",
  "updatedAt": "2025-05-06T14:00:00.000Z"
}
```

**Error Response (client not found)**:

```json
{
  "statusCode": 404,
  "message": "Client not found",
  "error": "Not Found"
}
```

#### Delete Client (Inactivate)

- **Method**: DELETE
- **Endpoint**: `{{base_url}}/clients/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- Error Response (client not found): (same structure as error in find)

### 🏢 Spaces (Private API - Requires Token)

#### Create Space

- **Method**: POST
- **Endpoint**: `{{base_url}}/spaces`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw- JSON)**:

```json
{
  "name": "Meeting Room B",
  "description": "Smaller room for up to 6 people",
  "capacity": 6
}
```

**Successful Response (example)**:

```json
{
  "id": 2,
  "name": "Meeting Room B",
  "description": "Smaller room for up to 6 people",
  "capacity": 6,
  "status": "active",
  "createdAt": "2025-05-06T15:00:00.000Z",
  "updatedAt": "2025-05-06T15:00:00.000Z"
}
```

**Error Response (validation - example)**:

```json
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "description must be a string",
    "capacity must be a number"
  ],
  "error": "Bad Request"
}
```

**Error Response (Name already exists)**:

```json
{
  "statusCode": 409,
  "message": "Space name already exists",
  "error": "Conflict"
}
```

#### Edit Space

- **Method**: PATCH
- **Endpoint**: `{{base_url}}/spaces/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw-JSON)** - partial edits examples:

```json
{
  "capacity": 8
}
```

**Successful Response (example)**:

```json
{
  "id": 2,
  "name": "Meeting Room B",
  "description": "Smaller room for up to 6 people",
  "capacity": 8,
  "status": "active",
  "createdAt": "2025-05-06T15:00:00.000Z",
  "updatedAt": "2025-05-06T15:05:00.000Z"
}
```

**Error Response:** (similar to create space):

**Error Response (space not found)**:

```json
{
  "statusCode": 404,
  "message": "Space not found",
  "error": "Not Found"
}
```

#### List Space (Paginated and Filtered)

- **Method**: GET
- **Endpoint**: `{{base_url}}/spaces?page=1&limit=10&name=reunions&capacity=5&status=active`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Query Parameters (optional)**:

- page: Page number (default: 1)

- limit: Items per page (default: 20)

- name: Filter by part of the name.

- capacity: Filter by part of the capacity.

- status: Filter by status (active or inactive). If omitted, returns both.

**Successful Response (example)**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Meeting Room A",
      "description": "Spacious room with projector",
      "capacity": 10,
      "status": "active",
      "createdAt": "2025-05-06T12:00:00.000Z",
      "updatedAt": "2025-05-06T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Meeting Room B",
      "description": "Smaller room for up to 6 people",
      "capacity": 8,
      "status": "active",
      "createdAt": "2025-05-06T15:00:00.000Z",
      "updatedAt": "2025-05-06T15:05:00.000Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Find Space by ID

- **Method**: GET
- **Endpoint**: `{{base_url}}/spaces/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "Meeting Room A",
  "description": "Spacious room with projector",
  "capacity": 10,
  "status": "active",
  "createdAt": "2025-05-06T12:00:00.000Z",
  "updatedAt": "2025-05-06T12:00:00.000Z"
}
```

**Error Response (space not found)**:(same structure as error in edit):

#### Delete Space (Inactivate)

- **Method**: DELETE
- **Endpoint**: `{{base_url}}/spaces/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- Error Response (client not found): (same structure as error in find)

### 🏢 Resources (Private API - Requires Token)

#### Create Resource

- **Method**: POST
- **Endpoint**: `{{base_url}}/resources`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw- JSON)**:

```json
{
  "name": "Projector",
  "description": "HD Projector for presentations"
}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "Projector",
  "description": "HD Projector for presentations",
  "createdAt": "2025-05-06T12:00:00Z",
  "updatedAt": "2025-05-06T12:00:00Z"
}
```

#### Edit Resource

- **Method**: PUT
- **Endpoint**: `{{base_url}}/resources/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw-JSON)**:

```json
{
  "name": "Updated Projector",
  "description": "Updated HD Projector for presentations"
}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "Updated Projector",
  "description": "Updated HD Projector for presentations",
  "createdAt": "2025-05-06T12:00:00Z",
  "updatedAt": "2025-05-06T12:30:00Z"
}
```

**Error Response:** (similar to create resource):

**Error Response (space not found)**:

```json
{
  "statusCode": 404,
  "message": "Space not found",
  "error": "Not Found"
}
```

#### List Space (Paginated and Filtered)

- **Method**: GET
- **Endpoint**: `{{base_url}}/resources?page=1&limit=10&name=reunions&capacity=5&status=active`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Query Parameters (optional)**:

- page: Page number (default: 1)

- limit: Items per page (default: 20)

- name: Filter by part of the name.

- status: Filter by status (active or inactive). If omitted, returns both.

**Successful Response (example)**:

```json
{
  [
  {
    "id": 1,
    "name": "Projector",
    "description": "HD Projector for presentations",
    "createdAt": "2025-05-06T12:00:00Z",
    "updatedAt": "2025-05-06T12:00:00Z"
  },
  {
    "id": 2,
    "name": "Whiteboard",
    "description": "Large whiteboard for brainstorming",
    "createdAt": "2025-05-06T12:00:00Z",
    "updatedAt": "2025-05-06T12:00:00Z"
  }
]
}
```

#### Find Space by ID

- **Method**: GET
- **Endpoint**: `{{base_url}}/resources/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "name": "Projector",
  "description": "HD Projector for presentations",
  "createdAt": "2025-05-06T12:00:00Z",
  "updatedAt": "2025-05-06T12:00:00Z"
}
```

**Error Response (space not found)**:(same structure as error in edit):

#### Delete Space (Inactivate)

- **Method**: DELETE
- **Endpoint**: `{{base_url}}/resources/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- Error Response (client not found): (same structure as error in find)

### : 📅 Reservations (Private API - Requires Token)

#### Create Reservation

- **Method**: POST
- **Endpoint**: `{{base_url}}/resources`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw- JSON)**:

```json
{
  "clientId": 1,
  "spaceId": 1,
  "resourceIds": [1],
  "startTime": "2025-05-10T10:00:00Z",
  "endTime": "2025-05-10T12:00:00Z"
}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "clientId": 1,
  "spaceId": 1,
  "resourceIds": [1],
  "startTime": "2025-05-10T10:00:00Z",
  "endTime": "2025-05-10T12:00:00Z",
  "createdAt": "2025-05-06T12:00:00Z",
  "updatedAt": "2025-05-06T12:00:00Z"
}
```

#### Edit Resource

- **Method**: PUT
- **Endpoint**: `{{base_url}}/reservation/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- **Body(raw-JSON)**:

```json
{
  "clientId": 1,
  "spaceId": 1,
  "resourceIds": [1, 2],
  "startTime": "2025-05-10T11:00:00Z",
  "endTime": "2025-05-10T13:00:00Z"
}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "clientId": 1,
  "spaceId": 1,
  "resourceIds": [1, 2],
  "startTime": "2025-05-10T11:00:00Z",
  "endTime": "2025-05-10T13:00:00Z",
  "createdAt": "2025-05-06T12:00:00Z",
  "updatedAt": "2025-05-06T13:00:00Z"
}
```

**Error Response:** (similar to create resource):

**Error Response (space not found)**:

```json
{
  "statusCode": 404,
  "message": "Space not found",
  "error": "Not Found"
}
```

#### List Reservations (Paginated and Filtered)

- **Method**: GET
- **Endpoint**: `{{base_url}}/reservation?page=1&limit=10&name=reunions&capacity=5&status=active`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Query Parameters (optional)**:

- page: Page number (default: 1)

- limit: Items per page (default: 20)

- cpf: Filter by cpf.

- status: Filter by status (active or inactive). If omitted, returns both.

**Successful Response (example)**:

```json
{
[
  {
    "id": 1,
    "clientId": 1,
    "spaceId": 1,
    "resourceIds": [1],
    "startTime": "2025-05-10T10:00:00Z",
    "endTime": "2025-05-10T12:00:00Z",
    "createdAt": "2025-05-06T12:00:00Z",
    "updatedAt": "2025-05-06T12:00:00Z"
  },
  {
    "id": 2,
    "clientId": 2,
    "spaceId": 2,
    "resourceIds": [2],
    "startTime": "2025-05-11T14:00:00Z",
    "endTime": "2025-05-11T16:00:00Z",
    "createdAt": "2025-05-06T13:00:00Z",
    "updatedAt": "2025-05-06T13:00:00Z"
  }
]

}
```

#### Find Space by ID

- **Method**: GET
- **Endpoint**: `{{base_url}}/reservation/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

**Successful Response (example)**:

```json
{
  "id": 1,
  "clientId": 1,
  "spaceId": 1,
  "resourceIds": [1],
  "startTime": "2025-05-10T10:00:00Z",
  "endTime": "2025-05-10T12:00:00Z",
  "createdAt": "2025-05-06T12:00:00Z",
  "updatedAt": "2025-05-06T12:00:00Z"
}
```

**Error Response (space not found)**:(same structure as error in edit):

#### Delete Space (Inactivate)

- **Method**: DELETE
- **Endpoint**: `{{base_url}}/reservation/:id`
- **Headers**:

```
Authorization: Bearer {{token}}
```

- Error Response (client not found): (same structure as error in find)
