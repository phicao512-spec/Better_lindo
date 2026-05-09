<div align="center">
  <img width="100%" alt="LingoLearn Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <h1>🌟 LingoLearn - Nền Tảng Luyện Thi IELTS & Tiếng Anh Toàn Diện 🌟</h1>
</div>

**LingoLearn** là một ứng dụng học và thi thử tiếng Anh toàn diện, được tích hợp sức mạnh của **Google Gemini 2.5 Flash** để mang lại trải nghiệm ôn luyện IELTS chân thực, thông minh và được cá nhân hóa hoàn toàn.

---

## 🚀 Các Tính Năng Nổi Bật

### 1. 🤖 IELTS Mini Mock Test Generator (Thi thử IELTS bằng AI)
- **Tự động sinh đề**: Tự động biên soạn một đề thi Mini Mock Test chuẩn IELTS Academic với 3 phần (Reading, Writing, Speaking) trong vòng vài giây.
- **Trải nghiệm thi như thật**: Hệ thống đồng hồ đếm ngược (Timer) dạng Sidebar chuyên nghiệp. Hết thời gian, hệ thống tự động khóa phần cũ và chuyển sang phần tiếp theo giống hệt thi trên máy tính (Computer-delivered IELTS).
- **Chấm điểm tự động (AI Auto-grading)**: Áp dụng AI Examiner để đánh giá kỹ năng Writing và Speaking, cung cấp Band Score ước lượng kèm nhận xét, sửa lỗi chi tiết (Feedback).
- **Giao diện chuẩn Academic**: UI/UX tối giản, thanh lịch, khung đọc văn bản (Reading Passage) to, rõ ràng, thân thiện với cả PC và thiết bị di động.

### 2. 🗣️ AI Speaking Examiner (Phòng thi Speaking AI)
- Thi vấn đáp Speaking trực tiếp với Giám khảo AI bằng **Web Speech API** (Speech-to-Text & Text-to-Speech).
- AI phản hồi bằng giọng nói và phân tích chi tiết lỗi ngữ pháp trong câu trả lời của bạn.

### 3. 📚 Luyện tập đa dạng
- Các bài kiểm tra trắc nghiệm (Multiple Choice).
- Bài tập điền từ vào chỗ trống (Fill in the Blanks) và sửa lỗi câu (Strict Exam).
- Bài kiểm tra kỹ năng đọc hiểu đoạn văn (Paragraph Exam).

### 4. 🔐 Quản lý API Key An Toàn
- Người dùng có thể chủ động nhập/đổi API Key của Google Gemini trực tiếp trên giao diện ứng dụng. Key chỉ được lưu trữ an toàn ngay trên trình duyệt (LocalStorage).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Core**: React 18, Vite, TypeScript
- **Styling**: TailwindCSS, Lucide React (Icons)
- **State Management**: Zustand
- **AI Integration**: Google Gemini API (Gemini 2.5 Flash)
- **Browser APIs**: Web Speech API

---

## ⚙️ Cài Đặt & Chạy Ứng Dụng (Run Locally)

**Yêu cầu hệ thống:** Node.js (phiên bản mới nhất)

**1. Clone dự án về máy**
```bash
git clone https://github.com/phicao512-spec/Better_lindo.git
cd Better_lindo
```

**2. Cài đặt các gói phụ thuộc (Dependencies)**
```bash
npm install
```

**3. Khởi chạy ứng dụng**
```bash
npm run dev
```

**4. Thiết lập Gemini API Key**
- Mở ứng dụng tại `http://localhost:5173`.
- Giao diện sẽ yêu cầu bạn nhập Google Gemini API Key để kích hoạt các tính năng tạo đề và chấm điểm bằng AI. Bạn có thể lấy Key miễn phí tại [Google AI Studio](https://aistudio.google.com/).

---

## 📄 Đóng góp (Contributing)
Mọi đóng góp, báo lỗi (issues) và pull requests đều được hoan nghênh để làm cho LingoLearn ngày càng hoàn thiện hơn. Cảm ơn bạn đã quan tâm!
