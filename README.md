# 🏋️ Gym Member Progress & Retention App

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Overview

Gym owners often struggle to track member progress, workout consistency, and retention. Without clear data, it's difficult to measure success or improve engagement.

This app provides a centralized platform where:

* Members log workouts and track progress
* Admins monitor engagement and retention
* Data is transformed into actionable insights

---

## 🚀 Features

### 👤 Member Experience

* 🔐 Authentication (Sign up / Login)
* 📊 Personal Dashboard

  * Today's workout
  * Weekly workout time
  * Progress overview
* 📝 Workout Logging

  * Exercises, duration, sets, reps
* 📅 Workout History

  * Track past sessions
  * Monitor consistency over time

---

### 🛠️ Admin Dashboard

* 📈 Overview Metrics

  * Total members
  * Active users
  * Retention rate
* 👥 Member Management

  * View all members
  * Track last active status
* 🔍 Member Profiles

  * Individual workout history
  * Total workout time
  * Progress visualization
* 📊 Analytics

  * Retention trends
  * Peak usage times
  * Engagement patterns

---

### ⚙️ Backend & System

* 🗄️ User & workout data storage
* ⏱️ Time aggregation per member
* 📉 Retention tracking logic
* 🔗 REST/GraphQL API layer

---

## 🧠 How It Works

```mermaid
flowchart LR
A[Member Logs Workout] --> B[Backend Stores Data]
B --> C[Analytics Engine]
C --> D[Admin Dashboard Insights]
D --> E[Gym Owner Decisions]
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend

* Node.js
* Express (or Next API routes)

### Database

* PostgreSQL
* Prisma ORM

### DevOps

* Docker
* AWS (EC2 / RDS)
* GitHub Actions (CI/CD)

---

## 📦 Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/gym-tracker.git
cd gym-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/gymdb
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

---

### 4. Setup database (Prisma)

```bash
npx prisma migrate dev
npx prisma generate
```

---

### 5. Run the app

```bash
npm run dev
```

App will run at:

```
http://localhost:3000
```

---

## 🐳 Docker Setup (Optional)

```bash
docker-compose up --build
```

---

## 📊 Key Metrics Tracked

* Member activity frequency
* Total workout time
* Retention rate
* Last active date
* Workout trends

---

## 🔮 Future Improvements

* 🤖 AI workout recommendations
* 🔔 Notifications for inactive members
* 🏆 Gamification (badges, streaks)
* 💬 Trainer ↔ Member messaging
* 📱 Mobile app version

---

## 📁 Project Structure

```
/app
/components
/pages
/prisma
  schema.prisma
/lib
  db.ts
/docker
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

Built by Zakai
Focused on building real-world, data-driven applications.
