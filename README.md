# 🏢 Employee Management System (MERN Stack)

Full-stack Employee Management System with JWT Auth, CRUD, Search, Pagination, Sorting & Filtering.

---
Demo Video link : https://drive.google.com/file/d/11JzaXGTi9uAn09P4tU1SafEvqZrotxDl/view?usp=drive_link

## ✅ Features
- JWT Authentication (Register/Login/Logout)
- Protected Routes
- Add / Edit / Delete Employees
- Search by Name
- Filter by Department
- Sort by columns
- Pagination
- Responsive Design
- Toast Notifications
- Loading & Error States

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router, Axios, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | express-validator |


## ⚡ Quick Setup (Step-by-Step)

### Step 1 — Prerequisites
Make sure you have these installed:
- [Node.js v18+](https://nodejs.org/) — check with `node -v`
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) OR local MongoDB

---

### Step 2 — Extract & Open in VS Code
1. Extract the ZIP anywhere on your laptop
2. Open the `ems-project` folder in VS Code
3. Open two terminals in VS Code (Terminal → New Terminal)

---

### Step 3 — Backend Setup

In **Terminal 1**:
```bash
cd backend
npm install
```

Open `backend/.env` and set your MongoDB URI:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ems?retryWrites=true&w=majority
JWT_SECRET=JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=*
```

> 💡 **MongoDB Atlas Free Tier**: Go to https://cloud.mongodb.com → Create free cluster → Get connection string → Replace `<username>` and `<password>`

Then start the backend:
```bash
npm run dev
```
You should see: `Server running in development mode on port 5000`

---

### Step 4 — Frontend Setup

In **Terminal 2**:
```bash
cd frontend
npm install
npm run dev
```
You should see: `Local: http://localhost:5173`

---

### Step 5 — Open the App
Go to 👉 **http://localhost:5173**

1. Click **Register** → create your account
2. Login with your credentials
3. Start adding employees!

---

## 📁 Project Structure

```
ems-project/
├── backend/
│   ├── config/          → MongoDB connection
│   ├── controllers/     → Auth + Employee logic
│   ├── middleware/      → JWT auth, error handling, validators
│   ├── models/          → User & Employee schemas
│   ├── routes/          → API routes
│   ├── server.js        → Entry point
│   └── .env             ← EDIT THIS with your MongoDB URI
│
├── frontend/
│   ├── src/
│   │   ├── components/  → Navbar, Table, Forms, Pagination, etc.
│   │   ├── context/     → Auth & Toast context
│   │   ├── pages/       → Login, Register, Dashboard, EmployeeList
│   │   ├── services/    → Axios API calls
│   │   └── utils/       → Constants, helpers
│   └── .env             ← API base URL (no change needed for local)
│
└── package.json         → Root scripts
```

---

## 🔌 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Employees (Protected — needs Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all (supports ?search, ?department, ?sort, ?page, ?limit) |
| GET | `/api/employees/:id` | Get one employee |
| POST | `/api/employees` | Add employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

---

## 🌍 Environment Variables

### `backend/.env`
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | localhost |
| JWT_SECRET | Secret key for JWT | — |
| JWT_EXPIRES_IN | Token expiry | 7d |
| CLIENT_ORIGIN | CORS allowed origin | * |

### `frontend/.env`
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:5000/api |

---
