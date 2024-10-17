# Task Manager API
---
This is a Task Manager API built with **Node.js** and **Express**. It allows users to register, log in, manage their profile, and manage tasks. The API supports JWT-based authentication and offers CRUD operations for user accounts and tasks.

## Table of Contents
- [Task Manager API](#task-manager-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Setup Environment Variables](#3-setup-environment-variables)
    - [4. Run the Server](#4-run-the-server)
  - [Usage](#usage)
    - [Authentication](#authentication)
  - [Routes](#routes)
    - [Authentication Routes](#authentication-routes)
    - [Account Routes](#account-routes)
    - [Task Routes](#task-routes)
  - [Database Configuration](#database-configuration)
  - [Error Handling](#error-handling)
    - [Example Error Response:](#example-error-response)

## Features
- User Registration and Login with JWT authentication
- CRUD operations for tasks
- User profile management: view and update profile details
- Change password and delete user account
- Task activity logs
- Password validation and encryption using bcrypt

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nocontxtdev/task-manager-api.git
cd task-manager-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add the following variables:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key
```

- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.

### 4. Run the Server

```bash
npm start
```

The server will start on `http://localhost:5000`.

## Usage

The API is **RESTful** and follows typical CRUD operations. You can use tools like **Postman** or **cURL** to interact with the API.

### Authentication

- **Register a new user**:

  **POST** `/api/auth/register`

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```

- **Login** (Receive a JWT token):

  **POST** `/api/auth/login`

  ```json
  {
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```

Once logged in, you'll receive a **JWT token** which must be included in the `Authorization` header for protected routes (in the format: `Bearer <token>`).

---

## Routes

### Authentication Routes

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login to the application and get a JWT token.

### Account Routes

- **GET** `/api/account/profile`: Get the authenticated user's profile details (private).
- **PUT** `/api/account/profile`: Update the user's profile (name, email) (private).
- **PUT** `/api/account/password`: Change the user's password (private).
- **DELETE** `/api/account/delete`: Delete the user's account (private).

### Task Routes

- **POST** `/api/tasks`: Create a new task (private).

  Example request body:

  ```json
  {
    "title": "Task Title",
    "description": "Task description",
    "priority": "high",
    "dueDate": "2023-12-31T23:59:59"
  }
  ```

- **GET** `/api/tasks`: Get all tasks for the authenticated user (private).
- **GET** `/api/tasks/:id`: Get a specific task by ID (private).
- **PUT** `/api/tasks/:id`: Update a task by ID (private).
- **DELETE** `/api/tasks/:id`: Delete a task by ID (private).

---

## Database Configuration

The API uses **MongoDB** as its database. To set up MongoDB:

1. Install MongoDB and run it locally, or use a service like **MongoDB Atlas**.
2. Set the MongoDB URI in the `.env` file.

Example MongoDB URI:

```bash
MONGO_URI=mongodb://localhost:27017/task-manager
```

---

## Error Handling

The API returns **appropriate HTTP status codes** and messages for different types of errors:

- **400 Bad Request**: Invalid data sent by the user.
- **401 Unauthorized**: Invalid token or no token provided.
- **403 Forbidden**: User not authorized for the requested operation.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Example Error Response:

```json
{
  "error": {
    "message": "User not found",
    "stack": "Stack trace details (only in development)"
  }
}
```