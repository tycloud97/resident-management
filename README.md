# Resident Management System -- Technical Fullstack Assignment (MVP)

## 1. Painpoint & Problem Solving

### 1.1. Painpoint 1 -- Dữ liệu phân tán, thiếu đồng bộ (Zalo + Excel)

**Vấn đề:**
- Thông tin cư dân nằm rải rác ở nhiều nơi (Zalo, Excel).
- Dữ liệu dễ trùng lặp, thiếu hoặc sai.
- Không có hệ thống tập trung để truy xuất hoặc quản lý hiệu quả.

**Giải pháp:**
 Trang quản lý cư dân với bảng dữ liệu, bộ lọc, tìm kiếm, form
nhập liệu rõ ràng.
- **Backend**: API RESTful với validation, kiểm tra trùng dữ liệu và
chuẩn hóa format.
- **Database**: Bảng `residents` có unique index theo (building,
apartment_number).

------------------------------------------------------------------------

### 1.2. Painpoint 2 -- Xử lý phản ánh chậm, thiếu quy trình

**Vấn đề:**
- Không có quy trình tình trạng phản ánh (New → In Progress →
Resolved).
- Không có mã phiếu, tracking, hoặc báo cáo tình trạng.

**Giải pháp:**
- **UI**:
- Cư dân: tạo - xem phản ánh.
- BQL: bảng quản lý phản ánh, đổi trạng thái, gán người xử lý.
- **Backend**: API tạo phản ánh, cập nhật trạng thái, log lịch sử.
- **Database**: Bảng `complaints` + `complaint_logs`.

------------------------------------------------------------------------

### 1.3. Painpoint 3 -- Thiếu log lịch sử

**Giải pháp:**
- Tự động ghi log vào `complaint_logs` khi có cập nhật.
- UI hiển thị timeline xử lý.

------------------------------------------------------------------------

### 1.4. Painpoint 4 -- Thiếu phân quyền & bảo mật

**Giải pháp:**
- Roles: Resident, Staff, Admin.
- Backend: Auth bằng JWT, middleware kiểm tra role.
- UI: Ẩn/hiện menu theo role.
- DB: Bảng `users` với password hash.

------------------------------------------------------------------------

### 1.5. Painpoint 5 -- Không có thống kê

**Giải pháp:**
- Dashboard: số lượng phản ánh theo trạng thái, loại, thời gian.
- Backend: API aggregation.
- DB: Thêm index `created_at`, `status` để tăng tốc.

------------------------------------------------------------------------

### 1.6. Painpoint 6 -- UX kém, thiếu accessibility (WCAG)

**Giải pháp:**
- Responsive bằng grid/flex.
- Tuân thủ WCAG:
- Độ tương phản tốt.
- Có label & aria-label.
- Điều hướng bằng keyboard.

------------------------------------------------------------------------

## 2. Module Analysis & Product Development Plan

### 2.1. User Roles

-   **Resident**
-   **Staff**
-   **Admin**

------------------------------------------------------------------------

### 2.2. Entities

-   `User`
-   `Resident`
-   `Complaint`
-   `ComplaintLog`
-   `Announcement`
-   `Attachment`

------------------------------------------------------------------------

### 2.3. System Modules

1.  **Authentication & Authorization**
2.  **Resident Management**
3.  **Complaint Management**
4.  **Announcement Module (optional)**
5.  **Dashboard & Reporting**
6.  **System Settings (future)**

------------------------------------------------------------------------

### 2.4. Development Plan (MVP)

#### Phase 0 -- Setup

-   Khởi tạo project, GitHub repo, cấu trúc clean code.

#### Phase 1 -- Auth

-   Login, JWT middleware, responsive layout.

#### Phase 2 -- Resident Management

-   CRUD cư dân + UI bảng danh sách.

#### Phase 3 -- Complaint Management

-   Tạo / xem / xử lý phản ánh.
-   Log lịch sử.

#### Phase 4 -- Dashboard

-   API thống kê + UI biểu đồ.

#### Phase 5 -- Finalization

-   README hoàn chỉnh.
-   Validation & error handling nâng cao.
-   Tối ưu performance + accessibility.

------------------------------------------------------------------------

## End of Document
