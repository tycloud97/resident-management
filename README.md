# Resident Management System (MVP)

## 📌 Overview

The Resident Management System (RMS) is an MVP fullstack application
designed to help an apartment management board streamline resident
information and complaint handling.
The current workflow uses **Zalo** and **Excel**, causing inconsistent
data, slow processing, and no centralized system.
This MVP introduces a structured, scalable, and maintainable solution
using a modern tech stack.

------------------------------------------------------------------------

# 1. Painpoints & Solutions

## 1.1 Data scattered across Zalo & Excel

**Painpoint:**
- Resident information stored in multiple Excel files and chat logs →
inconsistent data.
- Hard to search, filter, or maintain accuracy.

**Solution:**
- Centralized resident database.
- UI for listing, filtering, adding, and editing residents.
- API validation & unique constraints (building + apartment).

------------------------------------------------------------------------

## 1.2 Slow, untracked complaint handling

**Painpoint:**
- No ticket tracking.
- No complaint status workflow.
- No audit logs.

**Solution:**
- Complaint creation & tracking module.
- Clear workflow: **NEW → IN_PROGRESS → RESOLVED/REJECTED**.
- Automatic logging (ComplaintLog).
- Dashboard with statistics.

------------------------------------------------------------------------

## 1.3 No access control or user roles

**Painpoint:**
- Too much information shared in Zalo groups.
- No user authentication or role-based access.

**Solution:**
- Authentication (JWT).
- RBAC: **Resident**, **Staff**, **Admin**.
- Access restrictions per role.

------------------------------------------------------------------------

## 1.4 Poor user experience & accessibility

**Painpoint:**
- Non-responsive layouts.
- No accessibility standards (WCAG).

**Solution:**
- Responsive design using grid/flex.
- WCAG basics: labels, semantic HTML, keyboard navigation, contrast.

------------------------------------------------------------------------

# 2. Module Analysis & Product Development Plan

## 2.1 User Roles

-   **Resident:** submit & view complaints.
-   **Staff:** manage residents & complaints.
-   **Admin:** manage users, permissions, system settings.

------------------------------------------------------------------------

## 2.2 Key Modules

1.  Authentication & Authorization
2.  Resident Management
3.  Complaint Management
4.  Announcement (optional)
5.  Dashboard & Reporting
6.  System Settings (future)

------------------------------------------------------------------------

## 2.3 Entities

-   `User`
-   `Resident`
-   `Complaint`
-   `ComplaintLog`
-   `Announcement` (optional)
-   `Attachment` (optional)

------------------------------------------------------------------------

## 2.4 Development Plan

### Phase 0 -- Setup

-   Initialize repo, configure project structure, tools, linters.

### Phase 1 -- Authentication

-   Login API + JWT
-   Frontend login page
-   Layout & routing

### Phase 2 -- Resident Management

-   CRUD operations
-   List + filter UI

### Phase 3 -- Complaint Management (Core workflow)

-   Resident submission flow
-   Staff management flow
-   Auto logging

### Phase 4 -- Dashboard

-   Statistics API + UI

### Phase 5 -- Finalization

-   README
-   Cleanup
-   Accessibility fixes

------------------------------------------------------------------------

# 3. Technical Requirements

## 3.1 Proposed Tech Stack

### Frontend

-   **React + TypeScript**
-   **TailwindCSS** for responsive UI
-   **React Query** for API state management
-   **Vite** for fast build

### Backend

-   **Node.js + NestJS** (or Express)
-   RESTful API
-   Authentication via **JWT**

### Database

-   **PostgreSQL**
-   ORM: **Prisma** or **TypeORM**

### Others

-   ESLint + Prettier
-   Docker for local development
-   Postman collection for API testing (optional)

------------------------------------------------------------------------

## 3.2 High-Level UI Architecture

-   Component-based structure
-   Feature-based folders
-   Shared components: `Modal`, `DataTable`, `FormInput`, `StatusBadge`
-   Responsive & accessible (WCAG)

------------------------------------------------------------------------

## 3.3 Entities & Relationships (ERD)

    User (1) ---- (0..1) Resident
    Resident (1) ---- (N) Complaint
    Complaint (1) ---- (N) ComplaintLog
    User (staff/admin) (1) ---- (N) ComplaintLog (performed_by)

------------------------------------------------------------------------

## 3.4 Security & Roles

-   Password hashing (bcrypt)
-   JWT Access Tokens
-   Role-based authorization middleware
-   Input validation & sanitization
-   HTTPS in production

------------------------------------------------------------------------

## 3.5 Code Structure (for maintainability)

### Backend

    src/
      auth/
      users/
      residents/
      complaints/
      complaint-logs/
      announcements/
      common/

### Frontend

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

------------------------------------------------------------------------

## 3.6 Deployment Strategy

### MVP Deployment

-   Backend: Docker + Render/Railway/Fly.io
-   Frontend: Vercel/Netlify
-   Database: Managed PostgreSQL (Supabase/Railway)

### Scalability

-   Backend stateless → horizontal scaling
-   DB with proper indexing
-   CDN for frontend assets

------------------------------------------------------------------------

## 3.7 Future Extension Ideas

-   Online payment (service fees)
-   Facility booking (gym, BBQ, meeting room)
-   Push notifications (email/SMS/app)
-   Multi-building management
-   Advanced reporting + audit logs

------------------------------------------------------------------------

# 4. Feature Scope (Chosen Feature)

## Chosen Feature: **Complaint Management** (End-to-End)

### Backend Includes:

-   Create complaint
-   Get resident complaints
-   Staff: get all complaints (with filters)
-   Update status / assign staff
-   Complaint logs

### Frontend Includes:

-   Resident:
    -   Submit form
    -   My complaints page
    -   Complaint detail view
-   Staff/Admin:
    -   Complaint management table
    -   Filter by type/status/time
    -   Detail page with timeline & update form

------------------------------------------------------------------------

# 5. Setup Instructions

## Backend

    npm install
    npm run dev

Create `.env`:

    DATABASE_URL=postgres://...
    JWT_SECRET=your-secret

## Frontend

    npm install
    npm run dev

------------------------------------------------------------------------

# 6. Conclusion

This MVP demonstrates:
- Clean architecture
- Scalable design
- Good UI/UX principles
- Realistic workflow solving actual painpoints
- Fullstack understanding (DB → API → frontend)

------------------------------------------------------------------------

# 7. License

MIT
