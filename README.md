# Task API

A RESTful CRUD API built with Node.js and Express.js, with PostgreSQL persistence and Supabase authentication.

This project was built as part of the FlyRank backend assignment and covers API development, database integration, Docker containerization, authentication, middleware, and Swagger documentation.

## Features

- Create, read, update, and delete tasks
- PostgreSQL database
- Docker and Docker Compose
- Persistent database storage using Docker volumes
- Supabase authentication
- JWT-based protected routes
- Reusable authentication middleware
- Public and protected API endpoints
- Request validation
- Proper HTTP status codes
- Interactive Swagger API documentation
- Bearer token authentication in Swagger

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Supabase Auth
- Docker
- Docker Compose
- Swagger UI
- JavaScript

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/parth60k/Flyrank-01-CRUD-API.git
cd Flyrank-01-CRUD-API
2. Install dependencies
npm install
3. Environment Variables

Create a .env file in the project root:

DB_USER=taskuser
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasksdb

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

PORT=3000

A .env.example file is included as a template.

Never commit .env or real Supabase credentials to GitHub.

4. Start PostgreSQL with Docker
docker compose up -d db
5. Start the API
node server.js

The API will run at:

http://localhost:3000
Docker Compose

The complete application stack can also be started using:

docker compose up -d

This starts:

Express API
PostgreSQL database

PostgreSQL data is stored in a Docker volume so that database data persists across container restarts.

To stop the stack:

docker compose down
API Endpoints
General
Method	Endpoint	Description	Auth
GET	/	Get API information	Public
GET	/health	Check server health	Public
Tasks
Method	Endpoint	Description	Auth
GET	/tasks	Get all tasks	Public
GET	/tasks/:id	Get a task by ID	Public
POST	/tasks	Create a new task	Public
PUT	/tasks/:id	Update a task	Public
DELETE	/tasks/:id	Delete a task	Public
Authentication
Method	Endpoint	Description	Auth
POST	/auth/signup	Create a user account	Public
POST	/auth/login	Login and receive tokens	Public
POST	/auth/logout	Logout current user	Bearer Token
Protected Routes
Method	Endpoint	Description	Auth
GET	/protected/profile	Get authenticated user profile	Bearer Token
GET	/protected/dashboard	Access protected dashboard	Bearer Token
Public Routes
Method	Endpoint	Description	Auth
GET	/public/info	Public API information	Public
Authentication

Authentication is handled using Supabase Auth.

Signup
POST /auth/signup

Request body:

{
  "email": "user@example.com",
  "password": "your_password"
}
Login
POST /auth/login

Request body:

{
  "email": "user@example.com",
  "password": "your_password"
}

A successful login returns:

{
  "access_token": "your_access_token",
  "refresh_token": "your_refresh_token"
}
Protected Requests

Protected routes require the access token in the Authorization header:

Authorization: Bearer <access_token>

The authentication middleware verifies the token using Supabase and attaches the authenticated user to:

req.user
Example Protected Response
{
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
Database

The API uses PostgreSQL for persistent task storage.

PostgreSQL runs inside Docker and uses a named Docker volume:

task-postgres-data

The database schema is initialized using:

sql/init.sql

This allows the database schema to be created automatically when the PostgreSQL container is initialized.

Persistence Verification

Persistence was verified using Docker Compose.

Started the stack with:
docker compose up -d
Created a new task through the API.
Stopped the stack:
docker compose down
Started it again:
docker compose up -d
Called:
GET /tasks
The previously created task was still present.

This confirms that PostgreSQL data persists across container restarts through the Docker volume.

Swagger Documentation

Interactive API documentation is available at:

http://localhost:3000/docs

Swagger UI provides a Try it out interface for testing API endpoints.

Protected endpoints support Bearer JWT authentication through Swagger's Authorize button.

Swagger Screenshot

Add your latest Swagger screenshot here.

Project Structure
Flyrank-01-CRUD-API/
│
├── middleware/
│   └── auth.js
│
├── repositories/
│   └── taskRepository.js
│
├── sql/
│   └── init.sql
│
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── db.js
├── package.json
├── package-lock.json
├── server.js
├── supabase.js
└── README.md
Example cURL Request

Get all tasks:

curl -i http://localhost:3000/tasks

Create a task:

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Learn PostgreSQL\"}"

Get a specific task:

curl -i http://localhost:3000/tasks/1
Error Handling

The API uses appropriate HTTP status codes, including:

200 OK — successful request
201 Created — resource created
204 No Content — successful deletion/logout
400 Bad Request — invalid or missing input
401 Unauthorized — missing or invalid authentication
404 Not Found — resource not found
500 Internal Server Error — unexpected server error
Security

Sensitive environment variables are stored in .env and excluded from Git using .gitignore.

The repository does not contain the actual Supabase credentials.

Author

Parth Mane

Built as part of the FlyRank backend assignment.