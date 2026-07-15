# Thành Viên Nhóm Và Phân Công Công Việc
- **`Hoàng Ngọc Toàn`** - Xây dựng bộ khung HTML cơ sở và thiết kế toàn bộ ngôn ngữ định dạng CSS cho ứng dụng Smart Flashcards.
- **`Nguyễn Đình Gia Huy`** -  Phụ trách phần quản lý mảng dữ liệu gốc và đồng bộ hóa trạng thái ứng dụng xuống bộ nhớ trình duyệt.
- **`Nguyễn Tiến Anh`** - Hoàn thiện các khối nhập liệu chức năng và triển khai cơ chế phòng thủ bảo mật SRI (Subresource Integrity).
- **`Lê Thanh Quân`** - Viết bộ lọc tìm kiếm và lập trình hàm sinh thẻ Flashcard động bằng mã JavaScript 
- **`Vũ Văn Bách`** - Lập trình chức năng thêm mới từ vựng, tích hợp công nghệ chuyển đổi văn bản thành giọng nói (Web Speech API) và cơ chế Sao lưu/Phục hồi dữ liệu dạng file.

---

# Hướng Dẫn Demo Bảo Mật: Tấn Công Chuỗi Cung Ứng CDN & Phòng Thủ Bằng SRI (Subresource Integrity)

Tài liệu này hướng dẫn chi tiết từng bước cách thiết lập, giả lập một cuộc tấn công thay đổi nội dung tệp JavaScript trên CDN bằng tính năng **Local Overrides (F12)**, cách trình duyệt chặn đứng mã độc bằng **SRI**, và cách Lập trình viên (Developer) xử lý, cập nhật mã băm khi có phiên bản mới.

---

# Giới Thiệu Đề Tài
Trong kiến trúc web hiện đại, việc sử dụng mạng phân phối nội dung (CDN) bên thứ ba giúp tối ưu hóa hiệu suất nhưng lại vô tình mở ra lỗ hổng nghiêm trọng về tấn công chuỗi cung ứng phần mềm. Tin tặc có thể hoán đổi hoặc chèn mã độc vào các tệp tin CDN để đánh cắp dữ liệu nhạy cảm của người dùng. Subresource Integrity (SRI) ra đời như một lá chắn bắt buộc, giúp trình duyệt đối chiếu mã băm mật mã học để chặn đứng các tài nguyên bị chỉnh sửa trái phép. Ý thức được tầm quan trọng đó, tôi quyết định chọn nghiên cứu cơ chế SRI và các biện pháp bảo mật web làm đề tài báo cáo nhằm giải quyết triệt để nguy cơ tấn công này.

## Mục tiêu nghiên cứu
- **`Nghiên cứu lý thuyết`**: Làm rõ cơ chế vận hành của SRI và quy trình trình duyệt xác thực tính toàn vẹn dữ liệu thông qua các hàm băm mật mã học (SHA-384).
- **`Triển khai thực nghiệm`**: Xây dựng kịch bản giả lập tấn công thay đổi nội dung trên CDN để kiểm chứng trực quan khả năng phòng thủ của SRI trong môi trường thực tế.
- **`Đề xuất giải pháp`**: Xây dựng quy trình cập nhật mã băm hợp pháp cho nhà phát triển và đề xuất các biện pháp bổ sung để nâng cao tính an toàn tổng thể cho ứng dụng web.

---

## 1. Thành Phần Hệ Thống Demo

- **`testSRI.html`**: Trang web chính (Ứng dụng Flashcards), đóng vai trò client nạp tài nguyên.
- **`App.js`**: Tệp JavaScript giả lập được lưu trữ trên một máy chủ CDN bên thứ ba, chứa toàn bộ logic xử lý dữ liệu của ứng dụng.

---

## 2. Kịch Bản Tấn Công: Hacker Chiếm Quyền & Thay Đổi Nội Dung CDN

Trong thực tế, hacker sẽ tấn công vào máy chủ CDN để chèn mã độc vào các thư viện dùng chung. Trong bài demo này, chúng ta dùng tính năng **Local Overrides** của Trình duyệt để giả lập hành vi đó.

### Các bước thực hiện chi tiết của Hacker:

1.  Mở trang web bằng trình duyệt (Chrome/Edge), bấm **F12** và chuyển sang tab **Sources**.
2.  Nhìn vào cột bên trái, chọn tab con **Overrides** (Nếu không thấy, bấm vào dấu `>>` để mở rộng).
3.  Bấm vào **+ Select folder for overrides** và chọn một thư mục trống trên máy tính của bạn để làm nơi lưu tệp tin ghi đè. Trình duyệt sẽ hiện một thanh thông báo màu vàng yêu cầu cấp quyền, hãy bấm **Allow (Cho phép)**.
4.  Chuyển sang tab **Network**, tìm tệp **`App.js`**, click chuột phải vào tệp này và chọn **Override content** (Ghi đè nội dung).
5.  Quay lại tab **Sources -> Overrides**, lúc này tệp `App.js` đã nằm trong tầm kiểm soát của bạn.
6.  **Thực hiện tiêm mã độc:** \* Mở file `App.js` trong vùng Overrides ra.
    - Xóa bỏ hoặc chỉnh sửa các đoạn mã hệ thống nếu muốn phá hoại, hoặc giữ nguyên và chèn thêm đoạn mã độc vào **Dòng số 1** (ngay trước mọi đoạn mã khác):
      ```javascript
      alert("💀 HACKED! Mã độc từ Hacker truyền qua CDN đã chạy thành công!");
      ```
7.  Bấm **Ctrl + S** (hoặc _Cmd + S_ trên Mac) để lưu lại. Trình duyệt sẽ xuất hiện một dấu chấm màu tím nhỏ ở góc tên tệp, báo hiệu tệp đã bị ghi đè thành công bằng bản hack.

---

## 3. Thử Nghiệm 1: Trang Web KHÔNG CÓ CƠ CHẾ BẢO VỆ (Tắt SRI)

Kịch bản này xảy ra khi Lập trình viên chủ quan, gọi file từ CDN về dùng mà không sử dụng các biện pháp xác thực cấu trúc file.

### Các bước test:

1.  Mở file `testSRI.html` bằng công cụ chỉnh sửa code (VS Code/Notepad++).
2.  Tìm đến thẻ `<script>` ở gần cuối file (dòng số 192) đang gọi file JS.
3.  **Xóa bỏ hoàn toàn** hai thuộc tính bảo mật là `integrity` và `crossorigin`. Biến thẻ script trở nên trần trụi:

    ```html
    <script
      src="./App.js"
      integrity="sha384-xJwS7m9BvOd+HkWruJ/1ER2XViW/SzIrDQS+3eYucHvuckGVVuPdMJi+L6ZewArH"
      crossorigin="anonymous"
    ></script>

    <script src="./App.js"></script>
    ```

4.  Bấm **Ctrl + S** để lưu lại file HTML.
5.  Quay lại trình duyệt và bấm **F5** để tải lại trang.

### Kết quả thu được:
<img width="915" height="663" alt="image" src="https://github.com/user-attachments/assets/2faa85b7-bd68-4a12-b63f-9a6cef40cb2b" />

- Một hộp thoại thông báo **` HACKED! Mã độc từ Hacker...`** lập tức bật nhảy lên màn hình.
- Sau khi bấm **OK**, trang web vẫn tải bình thường và hiển thị giao diện **MÀU XANH**.
- ** Đánh giá an ninh:** Cuộc tấn công thành công mỹ mẫn. Trình duyệt tin tưởng hoàn toàn vào CDN và cho phép chạy mã độc. Trong thực tế, hacker sẽ tận dụng điều này để chạy ngầm mã lệnh đánh cắp Cookie, mật khẩu hoặc số thẻ tín dụng của người dùng mà giao diện trang web vẫn mượt mà, khiến không ai phát hiện ra.

---

## 4. Thử Nghiệm 2: Trình Duyệt Chặn Đứng Mã Độc (Bật SRI)

Bây giờ, chúng ta kích hoạt người gác cổng SRI để xem cách trình duyệt đối phó với tệp tin đã bị hacker can thiệp nội dung.

### Các bước test:

1.  Mở file `testSRI.html` trong VS Code.
2.  Thêm lại thuộc tính `integrity` với mã băm mặc định của file sạch (mã băm ban đầu khi chưa bị hack) và thuộc tính `crossorigin`:
    ```html
    <script
      src="./App.js"
      integrity="sha384-xJwS7m9BvOd+HkWruJ/1ER2XViW/SzIrDQS+3eYucHvuckGVVuPdMJi+L6ZewArH"
      crossorigin="anonymous"
    ></script>
    ```
3.  Lưu file và quay lại trình duyệt bấm **F5**.

### Kết quả thu được:
<img width="915" height="729" alt="image" src="https://github.com/user-attachments/assets/4e5ffc6b-87c2-4f3a-906f-30264f3c5102" />

- Hộp thoại `alert()` độc hại của hacker **hoàn toàn bị vô hiệu hóa** (không thể hiện lên).
- Giao diện ứng dụng lập tức chuyển sang trạng thái **MÀU ĐỎ rực cảnh báo nguy hiểm**: _"❌ Lỗi SRI: File CDN bị chỉnh sửa nội dung hoặc sai mã băm! Trình duyệt đã chặn hoàn toàn file này để bảo vệ bạn."_
- Mở tab **Console** của F12 lên, bạn sẽ thấy một dòng lỗi hệ thống màu đỏ nghiêm trọng:
  > `Failed to find a valid digest in the 'integrity' attribute for resource '...App.js' with computed SHA-384 integrity 'R3fXEfFGMmNmD++Vxi...'. The resource has been blocked.`
- ** Đánh giá an ninh:** Trình duyệt đã quét qua tệp nhiễm độc, tự tính toán ra mã băm thực tế (`R3fXEf...`) và đối chiếu với mã băm sạch trong HTML (`xJwS7m9B...`). Thấy hai chuỗi khác nhau, nó lập tức **Block (Chặn đứng)** toàn bộ tệp tin, bảo vệ người dùng tuyệt đối khỏi mã độc.


---

## 5. Góc Nhìn Nhà Phát Triển (Dev): Vá Lỗi & Chủ Động Cập Nhật Mã Băm

Trong thực tế, khi Lập trình viên chủ động cập nhật các tính năng mới cho tệp `App.js`, cấu trúc tệp thay đổi khiến mã băm thay đổi theo. Trình duyệt sẽ hiểu lầm là bị tấn công và khóa trang web lại (hiện màu đỏ). Dev cần phải cập nhật lại mã băm mới "hợp pháp" vào HTML.

### Các bước thực hiện của Developer:

1.  Giữ nguyên tệp `App.js` phiên bản mới (ở đây là bản có chứa mã độc/tính năng mới).
2.  Vào tab **Console** của trình duyệt, tìm đến dòng lỗi đỏ quét tìm đoạn mã băm thực tế mà trình duyệt đã tính toán sẵn ở mục: `computed SHA-384 integrity '...'`.
3.  Bôi đen và **Copy** chuỗi mã hóa nằm bên trong dấu nháy đơn đó. Ví dụ: `R3fXEfFGMmNmD++VxiI8k/1hPPST1NDwTg/jkwALYr1ncZWFG1IFjKvh6tAvZAm3`.

<img width="916" height="515" alt="image" src="https://github.com/user-attachments/assets/e7cde4ac-0dcd-4e35-8e32-a8f14e975821" />

5.  Mở file `testSRI.html` bằng VS Code.
6.  Tìm đến thuộc tính `integrity="sha384-[MÃ_BĂM_CŨ]"` và thay thế phần mã băm cũ bằng mã băm mới vừa copy.
    _(Lưu ý: Giữ nguyên tiền tố `sha384-` ở phía trước)_.
    ```html
    <script
      src="./App.js"
      integrity="sha384-R3fXEfFGMmNmD++VxiI8k/1hPPST1NDwTg/jkwALYr1ncZWFG1IFjKvh6tAvZAm3"
      crossorigin="anonymous"
    ></script>
    ```
    
<img width="916" height="638" alt="image" src="https://github.com/user-attachments/assets/0afd4812-5004-4c60-99a9-d8c4255d2961" />

7.  Lưu file HTML lại và bấm **F5** trên trình duyệt.



### Kết quả sau khi Fix:

- Mã độc/Tính năng mới trong file JS được phép kích hoạt công khai.
- Sau khi bấm tương tác, giao diện ứng dụng lập tức chuyển sang **MÀU XANH LÁ CÂY** an toàn: _"✅ Khớp mã SRI: Toàn bộ chức năng từ CDN đã tải an toàn!"_.
- Dòng thông báo lỗi màu đỏ trong tab **Console** hoàn toàn biến mất. Trình duyệt xác nhận tệp tin này đã được Lập trình viên kiểm duyệt và cho phép thực thi một cách hợp pháp.

---
1.  **Mã băm SHA-384 có tính chất nhạy cảm tuyệt đối:** Chỉ cần thay đổi một dấu chấm, dấu phẩy, mã băm của tệp tin sẽ biến đổi thành một chuỗi hoàn toàn khác.
2.  **SRI là lá chắn bắt buộc:** Giúp bảo vệ website khỏi các cuộc tấn công thay đổi nội dung bên thứ ba (CDN), chấp nhận hy sinh giao diện (bị lỗi nạp file) chứ không để mã độc chạy trên máy người dùng.
