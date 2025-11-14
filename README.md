# Resident Management System (MVP)

## 📌 Overview

Resident Management System (RMS) là ứng dụng fullstack MVP hỗ trợ ban quản lý chung cư
quản lý thông tin cư dân và xử lý phản ánh tập trung, thay thế quy trình rời rạc hiện tại
(Zalo + Excel). Hệ thống được thiết kế có kiến trúc rõ ràng, dễ mở rộng và dễ bảo trì.

---

## 📚 Documentation

- **1. Painpoints & Problem Solving / Các vấn đề & cách giải quyết**  
  `docs/01-painpoints-and-solutions.md`

- **2. Module Analysis & Product Development Plan / Phân tích module & kế hoạch phát triển**  
  `docs/02-module-analysis-and-plan.md`

- **3. Technical Requirements / Yêu cầu kỹ thuật**  
  `docs/03-technical-requirements.md`

- **4. Feature Scope – Complaint Management / Phạm vi chức năng – Module phản ánh**  
  `docs/04-feature-scope-complaint-management.md`

---

## 5. Setup Instructions

## Backend

    npm install
    npm run dev

Create `.env`:

    DATABASE_URL=postgres://...
    JWT_SECRET=your-secret

## Frontend

Implemented with React + TypeScript + Vite + Tailwind and React Query. The frontend supports RESTful API integration and a built‑in mock mode to run without backend.

Public pages (no login required):

- `/dashboard` – Bảng điều khiển (thống kê tổng quan)
- `/complaints` – Danh sách phản ánh
- `/complaints/new` – Gửi phản ánh (hỗ trợ ẩn danh)
- `/complaints/:id` – Chi tiết phản ánh + bình luận

Management pages (login required):

- `/manage/dashboard`, `/manage/residents`, `/manage/complaints`, `/manage/residents/:id`

Quick start:

    cd frontend
    cp .env.example .env.local    # adjust if needed
    npm install
    npm run dev

Environment variables (frontend/.env.local):

- `VITE_APP_NAME`: App name shown in header
- `VITE_API_BASE_URL`: Backend base URL (e.g., http://localhost:3000)
- `VITE_USE_MOCKS`: `true` to run fully with mock data, no backend required

Mock accounts (when VITE_USE_MOCKS=true):

- Admin: `admin@example.com` / `password`
- Staff: `staff@example.com` / `password`
- Resident: `res@example.com` / `password`

Frontend structure:

    frontend/
      src/
        features/
          auth/           # Auth context + login page
          residents/      # Residents list, form, detail
          complaints/     # Complaints list, form, detail, timeline
          dashboard/      # Stats overview
        components/       # Reusable UI (Button, Input, DataTable...)
        api/              # HTTP client, REST modules, mock adapters
        routes/           # ProtectedRoute, RoleGuard
        main.tsx, App.tsx, index.css

Key design notes:

- Clean code and modular structure (feature‑based folders, shared UI)
- RESTful API design (separate modules per resource, query/mutation via React Query)
- Input validation and graceful error handling on forms and API layer
- Security: JWT bearer injection, minimal token surface (demo uses localStorage; prefer httpOnly cookies in production)
- Performance: React Query caching, minimal re‑renders, Vite for fast HMR
- Accessibility: semantic HTML, labels, focus styles, skip‑to‑content, color contrast friendly Tailwind defaults
- Responsive UI via Tailwind utility classes (flex/grid, responsive modifiers)

Common scripts:

    npm run dev       # start dev server
    npm run build     # production build
    npm run preview   # preview production build
    npm run lint      # ESLint (WCAG via jsx-a11y included)
    npm run typecheck # TypeScript checks

------------------------------------------------------------------------

# 5.1 Local Docker Setup

This repo includes a ready-to-use Docker Compose stack for local testing with real API and MySQL.

Services:
- `mysql` (MySQL 8.0) with database `resident_db`
- `backend` (NestJS, dev mode on port 3000)
- `frontend` (Vite dev server on port 5173)

Quick start:

    docker compose up --build

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs (OpenAPI): http://localhost:3000/docs

Notes:
- Frontend is configured to call the backend via `VITE_API_BASE_URL=http://localhost:3000` inside the Docker network and will run with `VITE_USE_MOCKS=false`.
- Backend persists residents and complaints to MySQL. Uploaded files are stored in a named volume `uploads` and served via `/uploads`.
- MySQL port is published as `3307` on the host to avoid conflicts with a local MySQL (`localhost:3307`). Credentials are defined in `docker-compose.yml`.

Useful commands:
- Rebuild after changes: `docker compose up --build`
- Tear down (keep DB data): `docker compose down`
- Tear down and remove DB volume: `docker compose down -v`