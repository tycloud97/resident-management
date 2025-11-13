# Resident Management API (Swagger)

Các file chính:

- `backend/openapi.yaml` — Định nghĩa OpenAPI 3.0 của API
- `backend/swagger/index.html` — Trang Swagger UI (sử dụng CDN) để xem trước

## Xem trước nhanh

Cách 1 — Mở trực tiếp Swagger UI:

- Mở file `backend/swagger/index.html` trong trình duyệt (cho phép tải CDN).
- Swagger UI sẽ tự nạp `../openapi.yaml`.

Cách 2 — Dùng Swagger Editor online:

- Truy cập https://editor.swagger.io và dán nội dung `backend/openapi.yaml`.

Cách 3 — Chạy server tĩnh (tùy chọn):

- `npx http-server backend/swagger` (hoặc bất kỳ static server nào), sau đó mở `http://localhost:8080`.

## Tổng quan API

- Xác thực: Bearer JWT cho các endpoint quản trị (staff/admin)
- Modules:
  - Auth: `/auth/login`
  - Residents: `/residents`, `/residents/{id}` (multipart khi tạo)
  - Complaints (công khai + quản trị):
    - Danh sách/ tạo: `/complaints`
    - Chi tiết + logs: `/complaints/{id}`
    - Cập nhật trạng thái: `/complaints/{id}/status`
    - Phân công chính: `/complaints/{id}/assign`
    - Phân công theo giai đoạn: `/complaints/{id}/assign-stage`
    - Đổi mức độ: `/complaints/{id}/severity`
    - Bình luận + ảnh: `/complaints/{id}/comments` (JSON hoặc multipart)
  - Dashboard: `/dashboard/stats`
  - Users: `/users?role=staff`

Các schema bám sát UI frontend: `Complaint`, `ComplaintLog`, `Resident`, `User`, `Attachment`, `Severity`, `ComplaintStatus`, `HouseholdMember`.

## Gợi ý triển khai Backend

- NestJS hoặc Express + Zod/Joi để validate.
- Upload file: dùng multipart (multer/fastify-multipart); ảnh trả về `url` (CDN/presigned S3/local storage).
- Bảo mật: hash mật khẩu (bcrypt), JWT, RBAC theo `role`.
- SLA/mức độ nghiêm trọng: cập nhật `severity`, log `SEVERITY_UPDATE`.
- Dòng thời gian (logs): ghi `CREATE`, `STATUS_UPDATE`, `ASSIGN`, `ASSIGN_STAGE`, `COMMENT`.
- Chạy dev server NestJS:

  - cd backend
  - npm install
  - npm run dev

- Swagger UI: http://localhost:3000/docs

- Quy ước token dev cho guard:
  - Authorization: `Bearer dev-admin-token` → role admin
  - Authorization: `Bearer dev-staff-token` → role staff
  - Authorization: `Bearer anything-else` → role resident

