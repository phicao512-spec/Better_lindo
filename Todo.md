# Todo List - LingoLearn

## Công việc hiện tại (Current Tasks)
- [x] Clone mã nguồn dự án.
- [x] Thiết lập biến môi trường cơ bản (`.env.local`).
- [x] Phân tích cấu trúc thư mục và kiến trúc (React, Vite, Zustand, Tailwind).

## Công việc sắp tới (Upcoming Tasks)
- [x] Thêm các tính năng thi cử (Final Exam, Fill Blank, Strict, Paragraph).
- [x] Tính năng "Phòng thi Speaking AI" (AI Speaking Examiner)
  - [x] Thêm chỗ lưu trữ `geminiApiKey` trong `useStore.ts` hoặc cài đặt.
  - [x] Xây dựng giao diện `SpeakingExam.tsx` có nút micro.
  - [x] Tích hợp Web Speech API (Speech-to-Text & Text-to-Speech).
  - [x] Gửi Text lên Google Gemini bằng fetch API.
  - [x] Ép Gemini phản hồi theo chuẩn JSON (gồm sửa lỗi ngữ pháp tiếng Việt + lời đối thoại tiếng Anh).
  - [x] Tích hợp nút chức năng vào `Practice.tsx` hoặc `Home.tsx`.
- [x] Tính năng Tạo đề thi IELTS bằng AI (Gemini 2.5 Flash)
  - [x] Giao diện `GenerateExam.tsx` cho phép nhập API Key cá nhân.
  - [x] Prompt chặt chẽ tạo cấu trúc đề Mini Mock Test IELTS (Reading Passage, Writing, Speaking).
  - [x] Giao diện làm bài chuyên nghiệp với Left-Sidebar Timer, tự động chuyển phần.
  - [x] Cải thiện UI/UX chuẩn Academic (bỏ thiết kế neo-brutalism cũ).
  - [x] AI tự động chấm điểm và đánh giá Band Score cho Writing/Speaking.

## Kế hoạch Fullstack (Backend & Authentication)
- [ ] Tích hợp BaaS (Firebase hoặc Supabase).
  - [ ] Xây dựng luồng Đăng nhập/Đăng ký (Authentication).
  - [ ] Xây dựng trang Profile cá nhân (Dashboard, Lịch sử thi, Biểu đồ tiến độ).
  - [ ] Nâng cấp State Management (`useStore.ts`) để quản lý phiên đăng nhập (User Session).
  - [ ] Thiết kế Database schema để lưu trữ kết quả thi (Exam Results, AI Feedbacks).
  - [ ] (Tuỳ chọn) Tích hợp Cloud Functions/Edge Functions để giấu API Key, bảo mật hoàn toàn việc gọi Gemini API.

## Bugs / Vấn đề cần xử lý
- [ ] (Ghi nhận các lỗi phát sinh)
