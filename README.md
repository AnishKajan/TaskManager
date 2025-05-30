# 📝 TaskManager

A full-stack task management application that allows users to sign up, log in, and manage categorized tasks (Work, School, Personal). Built using **MongoDB**, **Express.js**, **React**, and **Node.js** — and styled with **Material UI**. Dockerized for local containerized development.

---

## ⚙️ Tech Stack

- **Frontend:** React + Material UI
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT + Bcrypt
- **Containerization:** Docker + Docker Compose

---

## 📁 Project Structure

```
TaskManager/
├── backend/
│   ├── db/
│   │   └── mongoClient.js        # MongoDB connection setup
│   ├── routes/
│   │   ├── auth.js               # Signup/Login routes using JWT & bcrypt
│   │   └── tasks.js              # Task CRUD operations per user
│   ├── .env                      # Contains MONGO_URI and JWT_SECRET
│   ├── insertUser.js            # (optional) test seeding script
│   ├── server.js                # Main Express app entry point
│   ├── package.json             # Backend dependencies
│   └── Dockerfile               # Backend Docker config
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTaskModal.jsx
│   │   │   ├── EditTaskModal.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   └── SettingsModal.jsx
│   │   └── App.js
│   ├── package.json             # Frontend dependencies
│   └── Dockerfile               # Frontend Docker config
│
├── docker-compose.yml          # Combined frontend/backend setup
└── .gitignore                  # Ensures node_modules aren't committed
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnishKajan/TaskManager.git
cd TaskManager
```

### 2. Set up your `.env` (backend)

Create a `backend/.env` file with:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

> ✅ Recommended: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with a `taskmanager` database

---

### 3. Run using Docker Compose

```bash
docker compose up --build
```

This will:
- Build and run the backend on port `5000`
- Serve the frontend on port `3001`
- Connect to MongoDB at `localhost:27017`

---

## ⚠️ Known Issue

### 🔐 **Login/Signup not working**

- The **MongoDB collection has hashed passwords**, but some login attempts fail.
- Even with correct email + password, the error `Login failed` or `Signup failed` appears.

#### 🕵️‍♀️ Possible Causes:
- Mongo URI or JWT_SECRET may not be correctly read from `.env`
- `bcrypt.compare()` may not match due to encoding or seeding inconsistency
- The inserted user (via insertUser.js or manually in Atlas) might not match the form submission normalization
- `node_modules` was mistakenly pushed to GitHub — fixed now

---

## ✅ Fixed

- [x] Removed `node_modules` from Git history
- [x] Updated `.gitignore` to exclude future additions

---

## 🛠️ To Do

- [ ] Add password reset via email
- [ ] Add profile avatars and full user settings
- [ ] Implement due dates/reminders for tasks
- [ ] Improve error message UI feedback

---

## 📸 Screenshots

Coming soon.

---

## 📄 License

MIT © 2025 Anish Kajan
