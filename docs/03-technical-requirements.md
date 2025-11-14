# 3. Technical Requirements

## 3.1 Proposed tech stack & reasoning

### Frontend
- **React + TypeScript** – popular, type-safe, easy to scale.
- **TailwindCSS** – fast to build UI, easy to make responsive layouts.
- **React Query** – manages API state, caching, loading, and errors.
- **Vite** – fast development and lightweight build tooling.

### Backend
- **Node.js + NestJS** – clear structure (modules/services/controllers), easy to maintain.
- RESTful API – standard approach, easy to integrate with other systems.
- Authentication with **JWT** – suitable for web and mobile clients.

### Database
- **MySQL** – familiar relational database, easy to deploy and operate.

### Tooling
- ESLint + Prettier – consistent code style and fewer bugs.
- Docker – consistent development environment.
- Postman collection – quick API testing (optional).

---

## 3.2 High-level UI architecture

- Organize by feature: `auth`, `residents`, `complaints`, `dashboard`.
- Extract shared UI components: `Modal`, `DataTable`, `FormInput`, `StatusBadge`, `Button`, etc.
- Keep heavy logic out of components; use hooks/services for API calls.
- Design mobile-first and ensure core screens work well on phones.

---

## 3.3 Key entities & relationships

```text
User (1)        ── (0..1) Resident
Resident (1)    ── (N)    Complaint
Complaint (1)   ── (N)    ComplaintLog
User (staff/admin) (1) ─ (N) ComplaintLog (performed_by)
```

- Each `User` can be linked to at most one `Resident`.
- Each `Resident` can create many `Complaint` records.
- Each action on a complaint is stored as a `ComplaintLog` entry.

---

## 3.4 Security & roles

- Hash passwords with `bcrypt`.
- Use JWT access tokens with appropriate expiry.
- Use middleware/guards to enforce RBAC on each route.
- Validate and sanitize all input (e.g. with class-validator DTOs).
- Use HTTPS in production environments.

---

## 3.5 Code structure for maintainability

### Backend (NestJS)

```text
src/
  auth/
  users/
  residents/
  complaints/
  complaint-logs/
  announcements/
  common/
```

- Each module has its own controller, service, DTOs, and entities.
- The `common/` folder holds shared middleware, guards, filters, and utilities.

### Frontend (React)

```text
src/
  features/
    auth/
    residents/
    complaints/
    dashboard/
  components/
  api/
  utils/
  routes/
```

- `features/` contains screens and logic grouped by business domain.
- `components/` contains reusable UI components.
- `api/` contains the HTTP client, REST modules, and mock adapters.
- `routes/` defines protected routes and role-based guards.

---

## 3.6 Server infrastructure & deployment strategy

### MVP deployment
- Backend: deploy a stateless service (e.g. on ECS or equivalent).
- Frontend: build static assets and host on S3 + CloudFront (or equivalent).
- Database: RDS MySQL with regular snapshot backups.

### Scalability
- Stateless backend → easy horizontal scaling.
- Proper database indexes on frequently queried fields.
- Use a CDN for frontend assets.

---

## 3.7 Future extension ideas

- Integrate online payment for service fees.
- Facility booking (gym, BBQ, meeting room).
- Notifications via email/SMS/mobile app.
- Manage multiple buildings or complexes.
- Advanced reporting and detailed audit logs.

