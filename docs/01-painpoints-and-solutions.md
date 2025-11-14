# 1. Pain Points & Solutions

## 1.1 Scattered data (Zalo + Excel)

**Pain point**
- Resident information is spread across many Excel files and Zalo chats.
- It is hard to search, filter, reconcile, and keep data consistent.

**Solution**
- Build a centralized resident database.
- Provide a resident management UI (list, filter, create, edit).
- Enforce data constraints (e.g. unique building + apartment) and validate inputs at the API layer.

---

## 1.2 Slow, untracked complaint handling

**Pain point**
- No proper ticket system for complaints.
- No way to track complaint status or see who did what.

**Solution**
- Implement a Complaint Management module.
- Define a clear workflow: `NEW → IN_PROGRESS → RESOLVED/REJECTED`.
- Store every important action in a `ComplaintLog` table.
- Provide a dashboard that shows volume, status breakdown, and handling time.

---

## 1.3 Weak security and access control

**Pain point**
- Sensitive information is shared widely in Zalo groups.
- There is no authentication or role-based access control.

**Solution**
- Use login with JWT-based authentication.
- Apply RBAC with three roles: **Resident**, **Staff**, **Admin**.
- Restrict both API endpoints and UI screens based on role.

---

## 1.4 Poor user experience

**Pain point**
- The UI is not responsive and is hard to use on mobile.
- Basic accessibility (WCAG) principles are not followed.

**Solution**
- Design a responsive layout using grid/flex.
- Use semantic HTML and proper labels; support keyboard navigation.
- Ensure good color contrast and clear focus states.

