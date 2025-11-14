# 1. Painpoints & Problem Solving  
# Các vấn đề và cách giải quyết

## 1.1 Dữ liệu phân tán (Zalo + Excel)

**Vấn đề**
- Thông tin cư dân nằm rải rác trong nhiều file Excel và cuộc trò chuyện Zalo.
- Khó tìm kiếm, lọc, đối soát, dễ sai lệch dữ liệu.

**Giải pháp**
- Xây dựng cơ sở dữ liệu cư dân tập trung.
- Giao diện quản lý cư dân (danh sách, lọc, thêm, sửa).
- Ràng buộc dữ liệu (unique: tòa nhà + căn hộ), kiểm tra đầu vào ở API.

---

## 1.2 Xử lý phản ánh chậm, không có quy trình

**Vấn đề**
- Không có hệ thống ticket cho phản ánh.
- Không theo dõi trạng thái xử lý, không có log hành động.

**Giải pháp**
- Module quản lý phản ánh (Complaint Management).
- Quy trình rõ ràng: `NEW → IN_PROGRESS → RESOLVED/REJECTED`.
- Lưu lịch sử xử lý trong bảng `ComplaintLog`.
- Dashboard hiển thị thống kê số lượng, trạng thái, thời gian xử lý.

---

## 1.3 Thiếu bảo mật và phân quyền

**Vấn đề**
- Thông tin nhạy cảm bị chia sẻ tràn lan trong group Zalo.
- Không có cơ chế xác thực và phân quyền người dùng.

**Giải pháp**
- Áp dụng đăng nhập với JWT.
- Mô hình RBAC với 3 vai trò: **Resident**, **Staff**, **Admin**.
- Hạn chế quyền truy cập API và màn hình UI theo vai trò.

---

## 1.4 Trải nghiệm người dùng kém

**Vấn đề**
- Giao diện không responsive, khó dùng trên điện thoại.
- Không tuân thủ các tiêu chuẩn cơ bản về accessibility (WCAG).

**Giải pháp**
- Thiết kế responsive dùng grid/flex.
- Sử dụng HTML semantic, label đầy đủ, hỗ trợ điều hướng bằng bàn phím.
- Đảm bảo tương phản màu sắc, trạng thái focus rõ ràng.

