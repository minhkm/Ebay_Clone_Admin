# Hướng Dẫn Cấu Hình Load Balancing & Rate Limiting (Nginx + Node.js)

Dự án đã được tích hợp đầy đủ 2 tầng bảo vệ và mở rộng hiệu năng khi lượng người dùng tăng cao:
1. **Rate Limiting (Tầng Ứng Dụng Node.js + Tầng Nginx)**: Chống DDoS, Spam, Brute-force mà không cần đăng nhập.
2. **Load Balancing (Nginx Reverse Proxy)**: Phân phối tải đều qua cụm Backend Node.js instances (Ports 5000, 5001, 5002).

---

## 1. Rate Limiting (Đã kích hoạt trực tiếp trong Node.js)

- **Cơ chế**: Định danh người dùng bằng địa chỉ IP (`client IP address`).
- **Cấu hình**: Tối đa 300 request / 15 phút cho mỗi địa chỉ IP (có thể tùy chỉnh trong [`backend/src/middlewares/rateLimiter.js`](file:///d:/KI7/SDN302/BL5/project/backend/src/middlewares/rateLimiter.js)).
- **HTTP Headers tự động trả về**:
  - `RateLimit-Limit`: Tổng số request cho phép trong chu kỳ (300).
  - `RateLimit-Remaining`: Số lượt còn lại của IP.
  - `RateLimit-Reset`: Thời gian (giây) đặt lại giới hạn.
- **Khi vượt quá giới hạn**: Trả về `HTTP 429 Too Many Requests` với thông báo thân thiện.

---

## 2. Load Balancing với Nginx

Tệp cấu hình Nginx chuẩn sản xuất đã được tạo tại: [`nginx/nginx.conf`](file:///d:/KI7/SDN302/BL5/project/nginx/nginx.conf).

### Các bước chạy Cân bằng tải:

#### Bước 1: Khởi chạy các Backend Instances
- **Instance 1 (Port 5000)**: Đang chạy sẵn qua `npm run dev` ở thư mục `backend`.
- **Instance 2 (Port 5001)**: Mở thêm 1 terminal tại `backend` và chạy:
  ```bash
  npm run dev:5001
  ```

#### Bước 2: Chạy Nginx với file cấu hình
```bash
# Nạp cấu hình vào Nginx
nginx -c d:\KI7\SDN302\BL5\project\nginx\nginx.conf
```

Khi có người dùng truy cập `http://localhost/api/`, Nginx sẽ tự động:
1. Áp dụng Rate Limiting ở tầng mạng (20 req/s per IP).
2. Chia đều lượt truy cập (Round Robin) sang Port 5000 và Port 5001.
3. Nếu một server gặp sự cố (`fail_timeout=10s`), Nginx tự động chuyển toàn bộ tải sang server còn lại mà người dùng không bị gián đoạn.
