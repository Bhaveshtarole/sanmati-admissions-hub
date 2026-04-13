# 🎓 Sanmati Admissions Hub — Counselor Dashboard

A modern **React-based CRM dashboard** for college counselors at Sanmati Engineering College, Washim. Built to work alongside the WhatsApp admission bot — all data is live from the backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)

---

## ✨ Features

| Page | What It Does |
|---|---|
| **Dashboard** | Live stats — total leads, hot leads, admitted count, avg score; status pie chart; branch bar chart |
| **Leads** | Server-side filtered & paginated student list; search by name/phone; filter by status/course/hot-only |
| **Lead Detail** | Full student profile; WhatsApp chat transcript; status change; counselor notes |
| **Students** | CRUD management — add manually, bulk CSV/Excel upload, edit inline, delete |
| **Campaign Manager** | Compose & send WhatsApp broadcast messages; view campaign history |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│            React SPA (Vite)                  │
│                                             │
│  src/                                       │
│  ├── api/client.ts       ◄── Axios API      │
│  ├── pages/              ◄── Route pages    │
│  │   ├── Dashboard.tsx                      │
│  │   ├── Leads.tsx                          │
│  │   ├── LeadDetail.tsx                     │
│  │   ├── Students.tsx                       │
│  │   └── CampaignManager.tsx                │
│  ├── components/         ◄── UI components  │
│  └── hooks/useDebounce.ts                   │
└─────────────────────────────────────────────┘
                    │
                    │ HTTP (VITE_API_URL)
                    ▼
┌─────────────────────────────────────────────┐
│     FastAPI Backend (Railway)                │
│     /api/stats, /api/students, /api/campaigns│
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18, TypeScript 5 |
| **Build Tool** | Vite 5 |
| **Styling** | TailwindCSS 3, shadcn/ui |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Routing** | React Router v6 |
| **Notifications** | Sonner (toast) |
| **File Parsing** | PapaParse (CSV), SheetJS (Excel) |
| **Deployment** | Vercel (`vercel.json`) |

---

## 📁 Project Structure

```
sanmati-admissions-hub/
├── src/
│   ├── api/
│   │   └── client.ts             # Axios API client + all TypeScript types
│   ├── pages/
│   │   ├── Dashboard.tsx         # Live stats + charts
│   │   ├── Leads.tsx             # Filtered student list
│   │   ├── LeadDetail.tsx        # Student profile + chat + notes
│   │   ├── Students.tsx          # CRUD student management
│   │   └── CampaignManager.tsx   # WhatsApp broadcast campaigns
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── LeadTable.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── HotLeadBadge.tsx
│   │   ├── students/
│   │   │   ├── FileUpload.tsx    # CSV/Excel drag-drop upload
│   │   │   ├── ManualEntryForm.tsx
│   │   │   └── StudentTable.tsx
│   │   └── ui/                   # shadcn/ui primitives
│   ├── hooks/
│   │   ├── useDebounce.ts        # Debounce hook for search
│   │   └── use-toast.ts
│   ├── data/
│   │   └── mockData.ts           # Fallback demo data (shown if backend unreachable)
│   └── index.css                 # Tailwind + custom design tokens
├── public/
├── vercel.json                   # Vercel SPA routing config
├── .env                          # Local dev env (gitignored)
├── .env.example                  # Environment variable template
├── vite.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+ installed
- Backend (`Sanmati_bot`) running on port 8000

### 1. Clone & Install

```bash
git clone https://github.com/yogeshbhange8/sanmati-admissions-hub.git
cd sanmati-admissions-hub
npm install
```

### 2. Configure Environment

```bash
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Start the Backend First

```bash
# In the Sanmati_bot directory:
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

### 4. Start the Frontend

```bash
npm run dev -- --port 5173
```

Open: **http://localhost:5173**

> If the backend is not running, the dashboard shows a yellow "Backend unreachable — showing demo data" banner and loads mock numbers.

---

## 🔌 API Integration

All API calls go through `src/api/client.ts`. The base URL is controlled by `VITE_API_URL`.

```typescript
// Key API methods
api.getStats()                          // GET /api/stats
api.getStudents({ status, search })     // GET /api/students
api.getStudent(id)                      // GET /api/students/:id
api.createStudent(data)                 // POST /api/students
api.bulkImportStudents(students)        // POST /api/students/bulk
api.updateStudent(id, data)             // PUT /api/students/:id
api.deleteStudent(id)                   // DELETE /api/students/:id
api.updateStatus(id, status)            // PUT /api/students/:id/status
api.addNote(id, content, counselor)     // POST /api/students/:id/notes
api.getCampaigns()                      // GET /api/campaigns
api.createCampaign(message, group)      // POST /api/campaigns
api.exportCsv()                         // GET /api/students/export (download)
```

---

## 🚢 Deploy to Vercel

1. Push this repo to GitHub
2. Connect repo to [Vercel](https://vercel.com) — it auto-detects `vercel.json`
3. Set environment variable in Vercel Dashboard → Project → Settings → Environment Variables:
   ```
   VITE_API_URL = https://your-backend.railway.app
   ```
4. Deploy — Vercel handles build, SPA routing, and CDN automatically

> The `vercel.json` already configures SPA fallback routing so React Router works on all paths.

---

## 🌊 Lead Status Flow

```
new → in_progress → visit_scheduled → admitted
                 └──────────────────→ not_interested
```

---

## 📊 Environment Variables

| Variable | Local | Production (Vercel) |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | `https://your-backend.railway.app` |

> Set production values in the **Vercel Dashboard** — never commit production URLs to `.env`.

---

## 🤝 Partner Repos

| Repo | Description |
|---|---|
| [Sanmati_bot](https://github.com/Bhaveshtarole/Sanmati_bot) | FastAPI backend + WhatsApp bot |
| **This repo** | React counselor dashboard (frontend) |

---

## 👨‍💻 Authors

**Yogesh Bhange** — [GitHub](https://github.com/yogeshbhange8)  
**Bhavesh Tarole** — [GitHub](https://github.com/Bhaveshtarole)

---

*Private — Sanmati Engineering College, Washim.*
