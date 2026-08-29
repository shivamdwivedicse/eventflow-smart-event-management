# 🚀 EventFlow — Smart Event Management Platform

> A unified, real-time platform designed to manage the complete event lifecycle from registration and team formation to judging, scoring, leaderboards, and analytics.

## 🌐 Live Demo

**[Launch EventFlow](https://eventflow-smart-event-management.vercel.app/)**

## 📌 About

EventFlow was built for the **PromptWar Hackathon** to address the challenge of creating a unified Smart Event Management Platform.

Instead of using separate tools for registration, team formation, announcements, judging, and analytics, EventFlow brings these workflows together into a single interactive dashboard.

## ✨ Key Features

### 🎟️ Registration & Check-in

* Participant registration
* Unique QR-based event pass
* Fast attendee verification
* Check-in tracking

### 🤝 Smart Team Formation

* Participant skill profiles
* Preferred roles
* Team discovery
* Skill/interest-based matchmaking
* Team request workflow

### 📢 Broadcast & Announcements

* Centralized announcements
* Priority-based updates
* Real-time event information
* Schedule and critical-event notifications

### ⚖️ Interactive Judging

* Dedicated judge dashboard
* Assigned project management
* Rubric-based evaluation
* Structured feedback
* Secure score submission

### 🏆 Live Leaderboard

* Aggregate project scores
* Dynamic rankings
* Real-time competition visibility

### 📊 Organizer Analytics

* Attendance overview
* Participant/team tracking
* Judging progress
* Event engagement insights

### 👥 Multi-role Experience

EventFlow provides dedicated workflows for:

* **Participant**
* **Judge**
* **Organizer**

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      EventFlow       │
                    │    React + Vite      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Participant          Judge          Organizer
          Dashboard         Dashboard        Dashboard
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Supabase       │
                    │                      │
                    │ Auth + PostgreSQL    │
                    │ RLS + Realtime Data  │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Vercel         │
                    │      Deployment      │
                    └──────────────────────┘
```

## 🛠️ Tech Stack

| Technology | Purpose                                     |
| ---------- | ------------------------------------------- |
| React      | Frontend UI                                 |
| Vite       | Development & build tooling                 |
| JavaScript | Application logic                           |
| Supabase   | Database, authentication & backend services |
| PostgreSQL | Relational data storage                     |
| Vercel     | Deployment                                  |
| QR Code    | Attendee identification/check-in            |

## 🔐 Security

EventFlow uses Supabase Row Level Security (RLS) to control access to application data.

Role-based access is implemented for:

* Participants
* Judges
* Organizers

Sensitive credentials are stored using environment variables and are not committed to the repository.

**Never expose Supabase secret/service-role credentials in the frontend.**

## 📁 Project Structure

```text
eventflow/
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── participant/
│   │   ├── judge/
│   │   └── organizer/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── supabase/
│   └── schema.sql
│
├── public/
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/shivamdwivedicse/eventflow-smart-event-management.git
cd eventflow-smart-event-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Do not commit `.env.local`.

### 4. Start development server

```bash
npm run dev
```

Open the local URL shown by Vite.

## 🗄️ Database

The complete Supabase database schema is available at:

```text
supabase/schema.sql
```

The schema includes:

* Profiles
* Events
* Participants
* Teams
* Team Members
* Team Requests
* Projects
* Announcements
* Judges
* Judge Assignments
* Evaluations
* Rubrics
* Evaluation Scores
* Check-ins

## 🧪 Testing

The application was tested locally and verified after production deployment.

Key workflows tested:

* Authentication/login
* Role-based dashboards
* Team formation
* QR pass
* Announcements
* Judge evaluation
* Score submission
* Leaderboard
* Organizer analytics
* Supabase connectivity
* Production deployment

## 🚀 Deployment

The production application is deployed using **Vercel**.

```text
https://eventflow-smart-event-management.vercel.app/
```

## 🎯 Problem Statement Alignment

| Requirement             | EventFlow Implementation                  |
| ----------------------- | ----------------------------------------- |
| Registration & Check-in | QR-based participant pass & check-in      |
| Smart Team Formation    | Skill/role-based team discovery           |
| Broadcast Center        | Event announcements                       |
| Interactive Judging     | Rubrics, scores & feedback                |
| Live Leaderboard        | Aggregate project rankings                |
| Analytics               | Organizer event analytics                 |
| Multi-role UX           | Participant, Judge & Organizer dashboards |

## 🔮 Future Improvements

* Push notifications
* Advanced AI-powered team recommendations
* Automated judge assignment
* Attendance heatmaps
* Advanced engagement analytics
* Email/SMS notifications
* Event scheduling and calendar integration

## 👨‍💻 Built For

**PromptWar Hackathon**

Built with a focus on usability, real-time event operations, role-based workflows, security, accessibility, and problem-statement alignment.

---

⭐ If you find EventFlow useful, consider starring the repository!
