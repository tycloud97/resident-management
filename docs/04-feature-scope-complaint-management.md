# 4. Feature Scope – Complaint Management (MVP)

This document describes what will be delivered in the Complaint Management module for the MVP, based on the current source code.

---

## 4.1 User journeys in this module

### Resident (public flow)
- Submit a new complaint with title, description, building, apartment, type, severity and optional photos.
- Choose to submit anonymously or leave contact information (name, phone, email).
- View the public complaints list and open a complaint detail page.
- Follow the processing history (timeline) and read comments.
- Add additional comments and photos to an existing complaint.

### Staff / Admin (management flow)
- View all complaints in a management table with filters by status, type, severity, building, apartment, and free-text search.
- Open a complaint detail page to see full information, attachments, SLA indicators and processing timeline.
- Update complaint status (NEW → IN_PROGRESS → RESOLVED/REJECTED) with a note.
- Assign a primary handler and assign handlers per stage (NEW / IN_PROGRESS / RESOLVED / REJECTED).
- Change complaint severity (LOW / MEDIUM / HIGH / CRITICAL) to reflect urgency.
- Add comments (internal notes or public-facing updates) with optional photos.

---

## 4.2 Backend components (API & data model)

The backend API for this module is defined in `backend/openapi.yaml` under the **Complaints** tag.

### Core entities
- `Complaint` – main record for each complaint (title, description, building, apartment, type, severity, status, isAnonymous, contact info, timestamps, assigned handlers).
- `ComplaintLog` – timeline entries for a complaint (action type such as CREATE, STATUS_UPDATE, ASSIGN, ASSIGN_STAGE, COMMENT, message, attachments).
- `Attachment` – uploaded files (images) linked to complaints or logs.

### Main endpoints used by the MVP
- `GET /complaints` – list complaints with query filters (q, status, type, severity, building, apartment, page, pageSize).
- `POST /complaints` – create a new complaint (supports anonymous submissions and image uploads via `multipart/form-data`).
- `GET /complaints/{id}` – get complaint detail plus full `ComplaintLog` timeline.
- `PATCH /complaints/{id}/status` – update complaint status with an optional message (staff/admin only).
- `PATCH /complaints/{id}/assign` – assign a main staff handler (staff/admin only).
- `PATCH /complaints/{id}/assign-stage` – assign handler per status stage (staff/admin only).
- `PATCH /complaints/{id}/severity` – update complaint severity (staff/admin only).
- `POST /complaints/{id}/comments` – add a new comment with optional attachments (supports anonymous comments).

These endpoints are wrapped on the frontend in `frontend/src/api/complaints.ts` as:
- `listComplaints`
- `createComplaint`
- `getComplaint`
- `updateComplaintStatus`
- `addComplaintComment`
- `assignComplaint`
- `assignStageHandler`
- `updateComplaintSeverity`

---

## 4.3 Frontend components delivered in the MVP

All complaint-related UI lives in `frontend/src/features/complaints`.

### List & filter view
- `ComplaintList.tsx`
  - Uses `listComplaints` and `DataTable` to show the complaints list.
  - Provides filters by status, type and free-text search across title/description/building/apartment.
  - Shows key columns: title (link to detail), type, severity, apartment, status (`StatusBadge`), assigned staff, created time.

### Submission form (create complaint)
- `ComplaintForm.tsx`
  - Uses `createComplaint` to submit a new complaint.
  - Fields: title, description, building, apartment, type, severity, anonymous toggle, contact name/phone/email, and evidence upload (`EvidenceUploader`).
  - Uses `getBuildingOptions` / `getApartmentOptions` from `config/units.ts` to help users select their unit.
  - Validates required fields and displays client-side and server-side errors.

### Detail view & timeline
- `ComplaintDetail.tsx`
  - Uses `getComplaint` to load `complaint` + `logs`.
  - Shows core info (ID, apartment, type, severity with `SeverityBadge` + `SeveritySelector`, status with `StatusBadge`).
  - Displays SLA helpers: countdown to SLA target (`Countdown`) and total handling time (`formatDuration` + `StatusProgress`).
  - For staff/admin: provides controls to change status (`updateComplaintStatus`), assign handlers (`assignComplaint`, `assignStageHandler`) and change severity (`updateComplaintSeverity`).
  - Embeds the timeline and comment section below the main header card.

- `ComplaintTimeline.tsx`
  - Visual vertical timeline based on `ComplaintLog` items.
  - Highlights creation and status update events and displays messages for each log entry.

### Comments & attachments
- `CommentSection.tsx`
  - Allows residents and staff to add comments and upload images (`EvidenceUploader`).
  - Supports anonymous comments.
  - Lists all COMMENT-type `ComplaintLog` entries with timestamp, author display name, message and thumbnail gallery of attachments.

---

## 4.4 Out of scope for this MVP

The following ideas are intentionally out of scope for the first MVP release:

- Complex SLAs with escalation rules or multi-level approvals.
- Integration with external channels (email/SMS/Zalo bot).
- Advanced analytics beyond the basic dashboard stats (`/dashboard/stats`).
- Role-specific dashboards for each staff member (e.g. “my assigned complaints” view).
