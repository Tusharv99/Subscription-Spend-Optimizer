````markdown
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:2563EB,100:06B6D4&text=Subscription%20Spend%20Optimizer&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35"/>
</p>

<h3 align="center">
Track • Analyze • Optimize • Save Money 💰
</h3>

<p align="center">
A modern MERN Stack application to efficiently manage recurring subscriptions and SaaS expenses with analytics, dashboards, and spending insights.
</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</p>

---

# 📖 Overview

**Subscription Spend Optimizer** is a lightweight full-stack web application that helps users track, analyze, and optimize recurring subscription expenses.

The project consists of:

- 🚀 **Backend** – Node.js + Express REST API with MongoDB
- 🎨 **Primary Frontend** – React + Vite Dashboard
- 📊 **Secondary Frontend** – Alternative React Dashboard with Charts

---

# ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 💳 Subscription Management
- 📊 Analytics Dashboard
- 📈 Spending Insights
- ☁ MongoDB Atlas Support
- 📱 Responsive UI
- ⚡ Fast React + Vite Application

---

# 🛠 Tech Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,javascript,vite,tailwind,git,github,npm,vscode&theme=dark"/>

</p>

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, Axios, Recharts, Radix UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **Development Tools** | Nodemon, ESLint, Git |

---

# 📂 Repository Structure

```text
Subscription-Spend-Optimizer
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── front
│   ├── public
│   ├── src
│   └── package.json
│
├── frontend
│   └── subscription-optimizer
│
└── README.md
```

---

# 📋 Prerequisites

Before running the project, install:

- Node.js (v16 or later)
- npm / yarn
- MongoDB Atlas or Local MongoDB

---

# ⚙ Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

# 🚀 Backend Setup

```bash
cd backend

npm install

npm run dev
```

For production:

```bash
npm start
```

Backend runs on:

```
http://localhost:4000
```

---

# 🌐 API Endpoints

| Method | Endpoint | Description |
|----------|------------|----------------|
| GET | `/api/health` | Health Check |
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/dashboard` | Dashboard Data |
| GET | `/api/analytics` | Analytics |
| GET | `/api/subscriptions` | Get Subscriptions |
| POST | `/api/subscriptions` | Create Subscription |
| PUT | `/api/subscriptions/:id` | Update Subscription |
| DELETE | `/api/subscriptions/:id` | Delete Subscription |

---

# 💻 Primary Frontend

```bash
cd front

npm install

npm run dev
```

Runs at:

```
http://localhost:5173
```

If backend runs on another port, create `.env` inside **front**

```env
VITE_API_URL=http://localhost:4000/api
```

---

# 💻 Secondary Frontend

```bash
cd frontend/subscription-optimizer

npm install

npm run dev
```

---

# 🏗 Build Production

Frontend

```bash
npm run build
```

Backend

```bash
npm start
```

You can deploy using:

- Render
- Railway
- Vercel (Frontend)
- Netlify
- AWS
- Digital Ocean

---

# 🔐 Security

- Never commit `.env`
- Keep JWT Secret private
- Store secrets securely in production
- Use HTTPS in production
- Validate API inputs

---

# 🏛 Project Architecture

```text
                    React + Vite
                          │
                          │ Axios
                          ▼
                  Express REST API
                          │
               JWT Authentication
                          │
                     Mongoose ODM
                          │
                      MongoDB Atlas
```

---

# 📷 Project Screenshots

Replace these placeholders with your screenshots.

| Dashboard | Analytics |
|------------|------------|
| ![](screenshots/dashboard.png) | ![](screenshots/analytics.png) |

---

# 📈 Future Improvements

- 🤖 AI Subscription Recommendations
- 🔔 Smart Renewal Notifications
- 💰 Monthly Budget Goals
- 📧 Email Alerts
- 📊 Advanced Analytics
- 📱 Progressive Web App (PWA)

---

# 🤝 Contributing

Contributions are welcome!

```bash
Fork the Repository

Create a New Branch

Commit Changes

Push to GitHub

Open a Pull Request
```

---

# 📜 License

Currently this repository does not include a license.

Recommended:

**MIT License**

---

# ❤️ Built With

<p align="center">

<img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,tailwind,vite"/>

</p>

<p align="center">

**Made with ❤️ using the MERN Stack**

⭐ If you found this project useful, don't forget to **Star** the repository!

</p>
````
