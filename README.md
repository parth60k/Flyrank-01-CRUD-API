# Task API

A simple RESTful CRUD API built with **Node.js** and **Express.js**.

This project manages tasks using an in-memory array instead of a database. It demonstrates the fundamentals of backend API development including routing, request bodies, path parameters, validation, HTTP status codes, and Swagger API documentation.

## Features

- Create tasks
- Get all tasks
- Get a task by ID
- Update tasks
- Delete tasks
- Request validation
- Proper HTTP status codes
- Interactive Swagger API documentation

## Tech Stack

- Node.js
- Express.js
- Swagger UI
- JavaScript

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/parth60k/Flyrank-01-CRUD-API.git
cd Flyrank-01-CRUD-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Get API information | 200 |
| GET | `/health` | Check server health | 200 |
| GET | `/tasks` | Get all tasks | 200 |
| GET | `/tasks/:id` | Get a task by ID | 200 |
| POST | `/tasks` | Create a new task | 201 |
| PUT | `/tasks/:id` | Update a task | 200 |
| DELETE | `/tasks/:id` | Delete a task | 204 |

### POST `/tasks`

Request body:

```json
{
  "title": "Buy milk"
}
```

The server automatically assigns an ID and sets `done` to `false`.

### PUT `/tasks/:id`

Example request:

```json
{
  "title": "Learn Express",
  "done": true
}
```

### DELETE `/tasks/:id`

Successfully deleting a task returns:

```text
204 No Content
```

## Example curl Request

Get all tasks:

```bash
curl -i http://localhost:3000/tasks
```
<img width="826" height="288" alt="image" src="https://github.com/user-attachments/assets/dcd17128-6121-4b55-b330-3c133f562831" />


Example response:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": 1,
    "title": "Learn Express",
    "done": false
  },
  {
    "id": 2,
    "title": "Build CRUD API",
    "done": false
  },
  {
    "id": 3,
    "title": "Learn Swagger",
    "done": true
  }
]
```

> The exact task data may differ depending on the current state of the in-memory task list.

## Swagger Documentation

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

Swagger UI provides a **Try it out** interface for testing all CRUD endpoints directly from the browser.

### Swagger Screenshot

<img width="1892" height="862" alt="image" src="https://github.com/user-attachments/assets/0ce7c6eb-8679-4bcb-85b3-2d1cbf023c09" />



## Project Structure

```text
Flyrank-01-CRUD-API/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Notes

This project intentionally uses an **in-memory data structure** instead of a database. Therefore, tasks are reset whenever the server restarts.

## Author

**Parth Mane**

Built as part of the FlyRank backend assignment.
