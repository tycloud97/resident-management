# 2. Module Analysis & Product Development Plan  
# Phân tích chức năng và kế hoạch phát triển

## 2.1 Vai trò người dùng (User Roles)

- **Resident (Cư dân)**  
  - Gửi phản ánh, xem danh sách phản ánh của mình, xem chi tiết.

- **Staff (Nhân viên ban quản lý)**  
  - Quản lý cư dân, tiếp nhận và xử lý phản ánh.

- **Admin**  
  - Quản lý tài khoản người dùng, phân quyền, cấu hình hệ thống.

---

## 2.2 Các module chính

1. **Authentication & Authorization**  
   - Đăng nhập, xác thực JWT, phân quyền.

2. **Resident Management**  
   - CRUD cư dân, tìm kiếm, lọc theo tòa/ tầng/ căn hộ.

3. **Complaint Management** (core)  
   - Gửi, theo dõi, xử lý phản ánh; timeline log.

4. **Announcement** (tuỳ chọn)  
   - Đăng thông báo chung cho cư dân.

5. **Dashboard & Reporting**  
   - Thống kê số lượng cư dân, phản ánh, thời gian xử lý.

6. **System Settings** (tương lai)  
   - Cấu hình chung, tham số hệ thống.

---

## 2.3 Thực thể chính (Entities)

- `User` – tài khoản đăng nhập, vai trò.
- `Resident` – thông tin cư dân, căn hộ.
- `Complaint` – phản ánh của cư dân.
- `ComplaintLog` – lịch sử thao tác trên phản ánh.
- `Announcement` (optional) – thông báo.
- `Attachment` (optional) – file đính kèm (ảnh, tài liệu).

---

## 2.4 Kế hoạch phát triển (Roadmap)

### Phase 0 – Thiết lập dự án
- Khởi tạo repo, cấu hình cấu trúc backend/frontend.
- Thiết lập TypeScript, ESLint, Prettier, Docker (dev).

### Phase 1 – Authentication
- API login + phát hành JWT.
- Màn hình login trên frontend, bảo vệ route.
- Layout, điều hướng, khung giao diện cơ bản.

### Phase 2 – Resident Management
- API CRUD cư dân.
- Màn hình danh sách + form thêm/sửa, lọc theo tiêu chí.

### Phase 3 – Complaint Management (core)
- Luồng gửi phản ánh cho cư dân.
- Luồng xử lý cho staff/admin (nhận, cập nhật trạng thái, ghi log).
- Tự động ghi `ComplaintLog` khi trạng thái thay đổi.

### Phase 4 – Dashboard
- API thống kê.
- Màn hình dashboard hiển thị số liệu và biểu đồ đơn giản.

### Phase 5 – Hoàn thiện
- Rà soát lại UI/UX, accessibility.
- Cập nhật README, dọn dẹp code.

