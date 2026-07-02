# TiffinExpress

TiffinExpress is a production-quality full-stack MERN application for a home tiffin service business based in Ahmedabad, India.

## Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT-based, phone number + OTP login (mock OTP service)
- **Payments**: Razorpay integration + Cash on Delivery (COD)

## Folder Structure
```
tiffin-service-app/
├── backend/
│   ├── config/          # DB connection and configurations
│   ├── controllers/     # Route controller logic
│   ├── middleware/      # Error handler, JWT auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── server.js        # Server entry point
│   └── .env.example     # Backend env templates
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API clients
│   │   ├── components/  # Shared/reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── store/       # Redux Toolkit store & slices
│   │   ├── App.jsx      # Router and main component
│   │   ├── index.css    # Tailwind CSS imports
│   │   └── main.jsx     # Frontend entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example     # Frontend env templates
├── package.json         # Root package.json with npm workspaces
└── README.md            # Project guide (this file)
```

## Quick Start (Development)

1. **Install dependencies for all workspaces:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   - Copy `backend/.env.example` to `backend/.env` and update values.
   - Copy `frontend/.env.example` to `frontend/.env` and update values.

3. **Start both Backend and Frontend concurrently:**
   ```bash
   npm run dev
   ```
   Or run them individually:
   - Backend only: `npm run dev:backend`
   - Frontend only: `npm run dev:frontend`
