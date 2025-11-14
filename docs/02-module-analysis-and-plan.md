# 2. Module Analysis & Product Development Plan

## 2.1 User roles

- **Resident**  
  - Submit complaints, view their own complaints, see details.

- **Staff**  
  - Manage residents and handle complaints.

- **Admin**  
  - Manage user accounts, roles, and system configuration.

---

## 2.2 Core modules

1. **Authentication & Authorization**  
   - Login, JWT-based authentication, role-based access.

2. **Resident Management**  
   - Resident CRUD, search and filter by building/floor/apartment.

3. **Complaint Management** (core)  
   - Submit, track, and process complaints; show a timeline of actions.

4. **Announcement** (optional)  
   - Publish announcements to residents.

5. **Dashboard & Reporting**  
   - Show statistics about residents, complaints, and handling time.

6. **System Settings** (future)  
   - Global configuration and system parameters.

---

## 2.3 Key entities

- `User` – login account and role.
- `Resident` – resident profile and apartment information.
- `Complaint` – complaint submitted by a resident.
- `ComplaintLog` – history of actions on a complaint.
- `Announcement` (optional) – announcements to residents.
- `Attachment` (optional) – files such as images or documents.

---

## 2.4 Roadmap

### Phase 0 – Project setup
- Initialize repository, define backend/frontend structure.
- Configure TypeScript, ESLint, Prettier, Docker for development.

### Phase 1 – Authentication
- Implement login API and issue JWT.
- Build login page on the frontend and protect routes.
- Set up basic layout and navigation.

### Phase 2 – Resident Management
- Implement resident CRUD APIs.
- Build list and form screens with useful filters.

### Phase 3 – Complaint Management (core)
- Implement the resident complaint submission flow.
- Implement the staff/admin handling flow (receive, update status, log actions).
- Automatically write to `ComplaintLog` whenever status changes.

### Phase 4 – Dashboard
- Provide statistics APIs.
- Build a simple dashboard view with key metrics and charts.

### Phase 5 – Finalization
- Review and refine UI/UX and accessibility.
- Update documentation and clean up the codebase.

