```markdown
# 🛍️ Retail Management System

This project is a full-stack retail management system consisting of:

- **Backend**: Node.js with Express (located in `retail-management-backend`)
- **Frontend**: React with Vite (located in `retail-management-frontend`)

---

## 📁 Project Structure

```

root/
│
├── retail-management-backend/      # Express backend
│   ├── config/                      # Configuration files (e.g., DB)
│   ├── controllers/                # Route handlers
│   ├── logs/                       # Logging output
│   ├── middlewares/               # Custom Express middleware
│   ├── models/                    # Mongoose or DB models
│   ├── routes/                    # Route definitions
│   ├── utils/                     # Utility functions
│   ├── .env                       # Environment variables
│   ├── server.js                  # Entry point of the backend
│   └── package.json               # Backend dependencies and scripts
│
├── retail-management-frontend/    # React + Vite frontend
│   ├── public/                    # Static assets
│   ├── src/                       # React source code
│   ├── index.html                 # HTML template
│   ├── package.json               # Frontend dependencies and scripts
│   └── vite.config.ts            # Vite configuration
│
└── readme.md                      # This documentation

````

---

## 🚀 Getting Started

```bash
cd retail-management-system
````

---

## ⚙️ Backend Setup (Express)

### Navigate to backend folder:

```bash
cd retail-management-backend
```

### Install dependencies:

```bash
npm install
```

### Configure environment variables:

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB URI, port, etc.

### Start the backend server:

```bash
npm start
```

Server should run on `http://localhost:8000` (or your configured port).

---

## 💻 Frontend Setup (React + Vite)

### Navigate to frontend folder:

```bash
cd ../retail-management-frontend
```

### Install dependencies:

```bash
npm install
```

### Start the development server:

```bash
npm run dev
```

The frontend should open at `http://localhost:5173` by default.

---

## 📦 Build for Production

### Frontend:

```bash
npm run build
```

### Backend:

Host using services like Render, Railway, or a Node.js compatible server.

---

## 📬 API & Routes

All backend API routes are available under `/api/...`. Example:

```
GET http://localhost:8000/api/products
```

---

