# Resident Management API (Swagger)

## Key files

- `backend/openapi.yaml` — OpenAPI 3.0 definition of the API.
- `backend/swagger/index.html` — Swagger UI page (uses CDN) for previewing the API.

## Quick preview options

**Option 1 – Open Swagger UI locally**

- Open `backend/swagger/index.html` directly in your browser (allow CDN access).
- Swagger UI will automatically load `../openapi.yaml`.

**Option 2 – Use Swagger Editor online**

- Go to https://editor.swagger.io.
- Paste the contents of `backend/openapi.yaml` into the editor.

**Option 3 – Run a simple static server (optional)**

- Run `npx http-server backend/swagger` (or any static file server).
- Open `http://localhost:8080` in your browser.

## API overview

- Authentication: Bearer JWT for staff/admin endpoints.
- Main modules:
  - Auth: `/auth/login`
  - Residents: `/residents`, `/residents/{id}` (multipart when creating)
  - Complaints (public + management):
    - List/create: `/complaints`
    - Detail + logs: `/complaints/{id}`
    - Update status: `/complaints/{id}/status`
    - Main assignment: `/complaints/{id}/assign`
    - Stage assignment: `/complaints/{id}/assign-stage`
    - Change severity: `/complaints/{id}/severity`
    - Comments + images: `/complaints/{id}/comments` (JSON or multipart)
  - Dashboard: `/dashboard/stats`
  - Users: `/users?role=staff`

The schemas closely follow the frontend UI: `Complaint`, `ComplaintLog`, `Resident`, `User`, `Attachment`, `Severity`, `ComplaintStatus`, `HouseholdMember`.

## Backend implementation notes

- Framework: NestJS or Express with Zod/Joi for validation.
- File upload: use multipart (multer/fastify-multipart); return image URLs (CDN/presigned S3/local storage).
- Security: hash passwords (bcrypt), use JWT and RBAC by `role`.
- Severity and SLA: update `severity` and log `SEVERITY_UPDATE` events.
- Timeline (logs): record `CREATE`, `STATUS_UPDATE`, `ASSIGN`, `ASSIGN_STAGE`, `COMMENT` actions.

### Running the NestJS dev server

- `cd backend`
- `npm install`
- `npm run dev`

Swagger UI will be available at: `http://localhost:3000/docs`.

### Dev token conventions for guards

- `Authorization: Bearer dev-admin-token` → role: admin  
- `Authorization: Bearer dev-staff-token` → role: staff  
- `Authorization: Bearer anything-else` → role: resident

