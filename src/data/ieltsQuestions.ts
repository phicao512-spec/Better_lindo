export type IeltsCategory = 'Speaking Part 1' | 'Speaking Part 2' | 'Speaking Part 3' | 'Writing Task 1' | 'Writing Task 2';

export interface IeltsQuestion {
  id: string;
  category: IeltsCategory;
  topic: string;
  question: string;
  tips: string[];
}

export const ieltsQuestions: IeltsQuestion[] = [
  // Speaking Part 1
  {
    id: "sp1_1",
    category: "Speaking Part 1",
    topic: "Work or Studies",
    question: "Do you work or are you a student?",
    tips: [
      "Trả lời trực tiếp vào câu hỏi (Ví dụ: I'm currently a student...).",
      "Thêm 1-2 chi tiết mở rộng (Học ngành gì, trường nào, hoặc làm công việc gì, ở đâu).",
      "Sử dụng thì hiện tại đơn."
    ]
  },
  {
    id: "sp1_2",
    category: "Speaking Part 1",
    topic: "Hometown",
    question: "Please describe your hometown a little.",
    tips: [
      "Nêu tên và vị trí (nằm ở miền nào, cách thủ đô bao xa).",
      "Điểm đặc trưng (yên tĩnh, náo nhiệt, nổi tiếng về cái gì).",
      "Cảm nhận cá nhân (Tôi rất thích sống ở đây vì...)"
    ]
  },
  {
    id: "sp1_3",
    category: "Speaking Part 1",
    topic: "Hobbies",
    question: "What do you do in your free time?",
    tips: [
      "Sử dụng các cụm từ chỉ sở thích: 'I'm keen on...', 'I'm a big fan of...'.",
      "Giải thích lý do tại sao thích (giúp thư giãn, học hỏi thêm).",
      "Nêu tần suất thực hiện hoạt động đó."
    ]
  },

  // Speaking Part 2
  {
    id: "sp2_1",
    category: "Speaking Part 2",
    topic: "Describe a person",
    question: "Describe a person who inspired you.\n\nYou should say:\n- Who this person is\n- How you know them\n- What they did\n- And explain why they inspired you.",
    tips: [
      "Dành 1 phút để take note các ý chính (không viết thành câu dài).",
      "Sử dụng quá khứ đơn kể về kỷ niệm và hiện tại đơn cho thói quen/tính cách.",
      "Thay vì dùng 'good', 'nice', hãy dùng từ vựng nâng cao: 'dedicated', 'charismatic', 'resilient'."
    ]
  },
  {
    id: "sp2_2",
    category: "Speaking Part 2",
    topic: "Describe a place",
    question: "Describe a place you have visited that you would recommend to others.\n\nYou should say:\n- Where it is\n- When you went there\n- What you did there\n- And explain why you recommend it.",
    tips: [
      "Miêu tả cảnh quan bằng tính từ mạnh (breathtaking, picturesque, vibrant).",
      "Kể về một trải nghiệm đáng nhớ nhất tại đó.",
      "Lý do khuyên người khác đến: giá cả, văn hóa, ẩm thực..."
    ]
  },

  // Speaking Part 3
  {
    id: "sp3_1",
    category: "Speaking Part 3",
    topic: "Role Models",
    question: "Do you think celebrities make good role models for children?",
    tips: [
      "Đưa ra quan điểm rõ ràng (Đồng ý, không đồng ý, hoặc cả hai).",
      "Giải thích lý do (tầm ảnh hưởng, hành vi tốt/xấu truyền thông...).",
      "Nêu ví dụ thực tế."
    ]
  },
  {
    id: "sp3_2",
    category: "Speaking Part 3",
    topic: "Tourism",
    question: "How does tourism affect the environment in your country?",
    tips: [
      "Nêu tác động tích cực (doanh thu để bảo tồn) và tiêu cực (ô nhiễm, phá hủy cảnh quan).",
      "Sử dụng từ vựng chủ đề môi trường: carbon footprint, waste disposal, sustainable tourism.",
      "Đề xuất giải pháp ngắn gọn."
    ]
  },

  // Writing Task 1
  {
    id: "wt1_1",
    category: "Writing Task 1",
    topic: "Bar Chart",
    question: "The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time.",
    tips: [
      "Mở bài: Paraphrase lại đề bài (1 câu).",
      "Overview: Nêu 2 xu hướng nổi bật nhất (Ví dụ: Part-time phổ biến hơn, nam giới học part-time nhiều hơn...).",
      "Chia Body paragraph theo tiêu chí hợp lý (theo năm, hoặc theo giới tính).",
      "Sử dụng ngôn ngữ so sánh và xu hướng."
    ]
  },
  
  // Writing Task 2
  {
    id: "wt2_1",
    category: "Writing Task 2",
    topic: "Education / Technology",
    question: "Some people believe that technology has made children less creative. To what extent do you agree or disagree?",
    tips: [
      "Xác định rõ quan điểm (Completely agree, completely disagree, hoặc balanced).",
      "Đoạn 1: Giải thích tại sao công nghệ có thể làm giảm sáng tạo (tiêu thụ thụ động nội dung, nghiện thiết bị).",
      "Đoạn 2: Giải thích tại sao công nghệ có thể tăng sáng tạo (công cụ thiết kế, lập trình, tiếp cận kiến thức mở).",
      "Kết luận: Tóm tắt lại quan điểm. Khẳng định công nghệ là con dao hai lưỡi."
    ]
  },
  {
    id: "wt2_2",
    category: "Writing Task 2",
    topic: "Environment",
    question: "Global warming is one of the most serious issues that the world is facing today. What are the causes of global warming and what measures can governments and individuals take to tackle the issue?",
    tips: [
      "Dạng bài: Causes & Solutions.",
      "Body 1 (Causes): Khí thải công nghiệp, phá rừng, phương tiện giao thông.",
      "Body 2 (Solutions): Năng lượng tái tạo, chính sách thuế carbon (Chính phủ); giảm sử dụng đồ nhựa, đi phương tiện công cộng (Cá nhân)."
    ]
  }
];
