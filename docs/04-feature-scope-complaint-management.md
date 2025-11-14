# 4. Feature Scope – Complaint Management

## 4.1 Why this module is chosen

- Complaint handling is the most critical interaction between residents and the management board.
- It covers a full end-to-end workflow: from UI → API → database → reporting.

---

## 4.2 Backend scope

The backend covers a complete complaint lifecycle:

- Create a new complaint.
- Retrieve a resident’s complaints.
- Staff/Admin:
  - Retrieve all complaints with filters (type, status, time).
  - Update status, assign handler.
- Record an entry in `ComplaintLog` on every important update.

---

## 4.3 Frontend scope

### For Residents
- Complaint submission form (with optional anonymity).
- “My complaints” page to track submitted complaints.
- Complaint detail screen with a visual processing timeline.

### For Staff/Admin
- Complaint management table:
  - Complaint list with pagination.
  - Filters by type, status, time range, severity.
- Detail screen:
  - Full complaint information and `ComplaintLog` history.
  - Update status, assign handler, add notes.

---

## 4.4 Implementation notes

- Use React Query to keep list and detail views in sync.
- Use `StatusBadge` and `StatusTimeline`/`ComplaintTimeline` components for clear visual status.
- Separate UI components from API-calling logic to keep the codebase maintainable.

