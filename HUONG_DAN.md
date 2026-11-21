# Hướng dẫn: đưa website Hải Sản Mỹ Chi lên mạng

Website gồm trang cho khách (`index.html`) và trang quản trị (`admin/index.html`). Dữ liệu sản phẩm lưu ở Supabase (miễn phí). Không cần thuê máy chủ.

Chưa làm các bước dưới đây thì website vẫn chạy bằng 3 sản phẩm mẫu, nhưng trang quản trị chưa dùng được.

## Bước 1. Tạo dự án Supabase
1. Vào https://supabase.com, đăng ký tài khoản, chọn **New project**.
2. Đặt tên (ví dụ `my-chi`), đặt mật khẩu cơ sở dữ liệu (tự lưu lại), chọn vùng **Southeast Asia (Singapore)**.
3. Chờ khoảng 2 phút cho dự án tạo xong.

## Bước 2. Tạo bảng dữ liệu
1. Trong Supabase, vào **SQL Editor** → **New query**.
2. Mở file `supabase/setup.sql`, chép toàn bộ nội dung dán vào, bấm **Run**.
3. Thấy chữ "Success" là xong. File này tạo bảng sản phẩm, bảng thông tin cửa hàng, kho ảnh và quy tắc: ai cũng xem được, chỉ người đăng nhập mới sửa được.

## Bước 3. Tạo tài khoản quản trị cho bạn
1. Vào **Authentication** → **Users** → **Add user** → **Create new user**.
2. Nhập email và mật khẩu của bạn, tích **Auto Confirm User**.
3. Vào **Authentication** → **Sign In / Providers** (hoặc **Settings**), **tắt "Allow new users to sign up"**. Bước này quan trọng: nếu không tắt, người lạ có thể tự đăng ký và sửa giá của bạn.

## Bước 4. Nối website với Supabase
1. Vào **Project Settings** → **API**.
2. Chép **Project URL** và khoá **anon public**.
3. Mở file `config.js`, dán vào `supabaseUrl` và `supabaseAnonKey`. Khoá anon public được phép nằm trên web, nhưng **không bao giờ dán khoá `service_role`**.

## Bước 5. Đưa lên mạng (miễn phí)
Cách dễ nhất là Netlify:
1. Vào https://app.netlify.com/drop.
2. Kéo cả thư mục website (chứa `index.html`) thả vào trang.
3. Netlify cấp cho bạn một địa chỉ. Trang quản trị nằm ở `địa-chỉ-của-bạn/admin/`.
4. Muốn dùng tên miền riêng (ví dụ `haisanmychi.vn`), mua tên miền rồi gắn trong mục **Domain management** của Netlify.

## Dùng hằng ngày
- Mở `/admin/`, đăng nhập.
- **Sản phẩm**: thêm, sửa giá, đổi ảnh, bấm "Báo hết hàng" khi hết cá.
- **Thông tin cửa hàng**: đổi số Zalo, giờ mở cửa, khu vực giao hàng, thông báo khuyến mãi.
- Lưu xong, trang khách cập nhật ngay, không cần làm gì thêm.

## Lưu ý
- Nút "Hỏi giá qua Zalo" mở Zalo của cửa hàng và tự sao chép câu "Tôi muốn hỏi giá: tên món" để khách dán vào. Zalo không cho điền sẵn tin nhắn qua đường dẫn.
- Phần "Cam kết" và "Món ngon" là nội dung chung, bạn xem lại cho đúng với quy trình thật của cửa hàng. Nếu muốn sửa nội dung này, nhờ người hỗ trợ sửa trong `index.html` và `app.js`.
- Khu vực giao hàng đang để dòng mặc định, hãy cập nhật trong trang quản trị.
