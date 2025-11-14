# 3. Technical Requirements  
# Yêu cầu kỹ thuật

## 3.1 Tech Stack đề xuất & lý do

### Frontend
- **React + TypeScript** – phổ biến, dễ mở rộng, type-safe.
- **TailwindCSS** – xây UI nhanh, dễ tạo layout responsive.
- **React Query** – quản lý state API, cache, loading/error.
- **Vite** – dev nhanh, build nhẹ.

### Backend
- **Node.js + NestJS** – cấu trúc rõ ràng (module/service/controller), dễ maintain.
- RESTful API – chuẩn, dễ tích hợp hệ thống khác.
- Auth bằng **JWT** – phù hợp ứng dụng web/mobile.

### Database
- **MySQL** – quen thuộc, dễ triển khai, phù hợp dữ liệu quan hệ.

### Công cụ khác
- ESLint + Prettier – chuẩn hóa style, giảm bug.
- Docker – môi trường dev đồng nhất.
- Postman collection – test API nhanh (tuỳ chọn).

---

## 3.2 Kiến trúc giao diện tổng thể (High-Level UI Architecture)

- Tổ chức theo feature: `auth`, `residents`, `complaints`, `dashboard`.
- Tách `components` dùng chung: `Modal`, `DataTable`, `FormInput`, `StatusBadge`, `Button`, v.v.
- Hạn chế logic nặng trong component, dùng hook/service riêng cho gọi API.
- Thiết kế responsive từ mobile-first, đảm bảo các màn hình chính dùng tốt trên mobile.

---

## 3.3 Thực thể & quan hệ (Key Entities & Relationships)

```text
User (1)        ── (0..1) Resident
Resident (1)    ── (N)    Complaint
Complaint (1)   ── (N)    ComplaintLog
User (staff/admin) (1) ─ (N) ComplaintLog (performed_by)
```

- Mỗi `User` có thể gắn với một `Resident` (cư dân).
- Mỗi `Resident` có nhiều `Complaint`.
- Mỗi thao tác xử lý phản ánh được ghi lại trong `ComplaintLog`.

---

## 3.4 Bảo mật & phân quyền (Security and Roles)

- Hash mật khẩu bằng `bcrypt`.
- Sử dụng JWT Access Token, thời gian sống hợp lý.
- Middleware/guard để kiểm tra role cho từng route (RBAC).
- Validate và sanitize input (class-validator, DTO).
- Sử dụng HTTPS ở môi trường production.

---

## 3.5 Cấu trúc mã để dễ bảo trì (Code Structure for Maintainability)

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

- Mỗi module tách riêng controller, service, DTO, entity.
- Thư mục `common/` chứa middleware, guard, filter, util dùng chung.

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

- `features/` chứa màn hình và logic theo từng nghiệp vụ.
- `components/` chứa UI dùng chung.
- `api/` chứa client, hooks gọi REST, adapter mock.
- `routes/` định nghĩa route bảo vệ, guard theo role.

---

## 3.6 Hạ tầng server & chiến lược triển khai (Server Infrastructure & Deployment)

### MVP Deployment
- Backend: deploy lên ECS (hoặc service tương đương), stateless.
- Frontend: build static và deploy lên S3 + CloudFront (hoặc tương đương).
- Database: RDS MySQL với backup snapshot định kỳ.

### Scalability
- Backend stateless → scale ngang dễ dàng.
- Tối ưu index database cho các field truy vấn nhiều.
- Dùng CDN cho asset frontend.

---

## 3.7 Hướng mở rộng trong tương lai (Future Extension Ideas)

- Tích hợp thanh toán online phí dịch vụ.
- Đặt lịch tiện ích (gym, BBQ, phòng họp).
- Gửi thông báo (email/SMS/app push).
- Quản lý nhiều toà/ nhiều khu chung cư.
- Báo cáo nâng cao, audit log chi tiết.

