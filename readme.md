# 📚 LibraryNext – Library Management API

A robust, RESTful API for managing books and borrowing records in a library system. Built with **Express**, **TypeScript**, and **MongoDB** using **Mongoose**, this system supports validation, business rules, filtering, aggregation, and more.

## 🔗 Live Link

👉 [Deployed API](https://your-deployment-link.com)

## 📹 Video Overview

🎥 [Watch on YouTube](https://your-video-link.com)

---

## 📑 Features

- ✅ **Add, Read, Update, Delete (CRUD)** books
- 🔍 **Filter & Sort** books by genre, creation date, etc.
- 📖 **Borrow Books** with business logic enforcement:
  - Availability control
  - Automatic copy deduction
  - Status update (available/unavailable)
- 📊 **Borrow Summary Report** using MongoDB aggregation
- ✅ **Schema validation** with Mongoose & Zod
- 🧠 **Mongoose static & instance methods**
- ⚙️ **Pre/Post Middleware** for data integrity
- 📦 Built with **TypeScript** for safety and clarity

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB + Mongoose
- **Language**: TypeScript
- **Validation**: Zod + Mongoose Schema
- **Other**: Dotenv, ESLint, Prettier

---

## 📁 Folder Structure

```bash
src/
├── controllers/         # Route logic  
├── models/              # Mongoose schemas  
├── routes/              # API routes  
├── utils/               # Zod schema, helper functions  
├── middlewares/         # Error handling, custom middleware  
├── app.ts               # Main express config  
├── server.ts            # App entry point  
└── config/              # MongoDB connection  
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas or local MongoDB

### Installation

```bash
git clone https://github.com/yourusername/librarynext.git
cd librarynext
npm install
```

## Environment Setup

### Create a .env file in the root directory:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://yourMongoURI
```
## Run in Dev Mode

```bash
npm run dev
```
## 📌 API Endpoints
### 1. 📘 Create a Book
### POST /api/books

```json 
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5
}
```

### 2. 📚 Get All Books

#### GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5

### 3. 🔍 Get a Book by ID

#### GET /api/books/:bookId

### 4. ✏️ Update Book

#### PUT /api/books/:bookId

```bash 
{
  "copies": 50
}
```
5. ❌ Delete Book

#### DELETE /api/books/:bookId

6. 📖 Borrow a Book

#### POST /api/borrow

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```
7. 📊 Borrow Summary

#### GET /api/borrow

#### 📊 Returns total borrowed quantity per book with title and ISBN.

🧪 Sample Error Response

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}

```

## ✅ Bonus Features

- ✅ Clean & maintainable code  
- ✅ Strict API contract matching assignment specs  
- ✅ Reusable validation logic  


---

## 🧑‍💻 Developer

**Mohammad Sumon**  
📧 mohammad.sumon9897@gmail.com  
🔗 [Portfolio](https://mohammadsumon.netlify.app/)
