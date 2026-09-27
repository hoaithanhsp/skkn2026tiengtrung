/**
 * GÓI TÀI LIỆU THAM KHẢO CHÍNH THỨC CHO SKKN TIẾNG TRUNG GIẢN THỂ CẤP THPT
 * Nguồn: Thư mục tai_lieu_tham_khao_SKKN_tieng_Trung_gian_the_THPT_2026-09-27
 * Bao gồm:
 * 1. Thông tư số 19/2021/TT-BGDĐT ban hành CT GDPT môn Tiếng Trung Quốc (Ngoại ngữ 1)
 * 2. Chương trình GDPT môn Tiếng Trung Quốc phần 1 & phần 2 (Mục tiêu, Chuẩn đầu ra Bậc 3 THPT, Chủ điểm, Ngữ pháp, Từ vựng)
 * 3. Nghiên cứu truy cập mở MALL (Mobile Assisted Language Learning) - Kukulska-Hulme & Shield, 2008
 * 4. Trích yếu nội dung CTGDPT và 4 nhóm giải pháp chuyển đổi số phù hợp THPT
 */

export interface ReferenceDocumentMeta {
  fileName: string;
  title: string;
  group: 'Cơ sở pháp lý Việt Nam' | 'Cơ sở chương trình Việt Nam' | 'Nghiên cứu khoa học quốc tế';
  issuingBody?: string;
  sourceUrl: string;
  fileSizeBytes: number;
  significanceForSKKN: string;
}

export const OFFICIAL_TIENG_TRUNG_DOCUMENTS_META: ReferenceDocumentMeta[] = [
  {
    fileName: "01_Thong_tu_19_2021_TT_BGDĐT_phan_van_ban.pdf",
    title: "Thông tư số 19/2021/TT-BGDĐT - Ban hành Chương trình GDPT môn Ngoại ngữ 1 (Tiếng Trung Quốc)",
    group: "Cơ sở pháp lý Việt Nam",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    sourceUrl: "https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2021/7/34061/36367-1-2021689-69019-2021-tt-bgddt.pdf",
    fileSizeBytes: 1179809,
    significanceForSKKN: "Căn cứ pháp lý cao nhất xác lập vị thế môn Tiếng Trung Quốc trong hệ thống giáo dục quốc dân; định hướng mục tiêu đổi mới phương pháp giảng dạy và kiểm tra đánh giá theo CT GDPT 2018."
  },
  {
    fileName: "02_CTGDPT_Tieng_Trung_Quoc_phan_1.pdf",
    title: "Chương trình GDPT môn Ngoại ngữ 1 - Môn Tiếng Trung Quốc (Phần 1: Mục tiêu, quan điểm, yêu cầu cần đạt)",
    group: "Cơ sở chương trình Việt Nam",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    sourceUrl: "https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2021/7/34061/36373-1-2021693-69419-2021-tt-bgddt.pdf",
    fileSizeBytes: 1032959,
    significanceForSKKN: "Quy định chuẩn đầu ra Bậc 3 cấp THPT theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam; các năng lực chung, năng lực đặc thù giao tiếp (Nghe, Nói, Đọc, Viết) và phẩm chất cần hình thành."
  },
  {
    fileName: "03_CTGDPT_Tieng_Trung_Quoc_phan_2.pdf",
    title: "Chương trình GDPT môn Tiếng Trung Quốc (Phần 2: Nội dung giáo dục cấp THPT Lớp 10, 11, 12 và phương pháp giáo dục)",
    group: "Cơ sở chương trình Việt Nam",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    sourceUrl: "https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2021/7/34061/36376-1-2021695-69619-2021-tt-bgddt.pdf",
    fileSizeBytes: 652183,
    significanceForSKKN: "Quy định khối lượng từ vựng cấp THPT (1.000 từ mới, tổng 2.200 từ), hệ thống chữ Hán giản thể, cấu trúc ngữ pháp phức tạp (trạng ngữ, định ngữ, bổ ngữ, câu ghép), phương pháp dạy học phân hóa và rubric kiểm tra đánh giá."
  },
  {
    fileName: "04_Mobile_Assisted_Language_Learning_Kukulska_Hulme_Shield_2008.pdf",
    title: "An overview of mobile assisted language learning: From content delivery to supported collaboration and interaction",
    group: "Nghiên cứu khoa học quốc tế",
    issuingBody: "Agnes Kukulska-Hulme & Lesley Shield (Journal of Computer Assisted Learning / Language Learning & Technology)",
    sourceUrl: "https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/a5ff6d56-3f22-4d99-812b-fa964430fd4f/content",
    fileSizeBytes: 239063,
    significanceForSKKN: "Cơ sở lý luận khoa học quốc tế về phương pháp học ngoại ngữ qua thiết bị di động (MALL), chuyển dịch từ truyền tải nội dung thụ động sang hỗ trợ tương tác, học tập cộng tác và phản hồi tức thời."
  }
];

/**
 * 4 CHỦ ĐỀ SÁNG KIẾN KINH NGHIỆM GỢI Ý TRIỂN KHAI PHÙ HỢP CẤP THPT
 */
export const SUGGESTED_SKKN_TOPICS_FROM_DOCS = [
  {
    id: "TOPIC_1",
    title: "Ứng dụng học liệu số có phản hồi tức thời để củng cố từ vựng và chữ Hán giản thể theo chủ điểm cho học sinh THPT",
    focus: "MALL, Phản hồi tức thời (Instant Feedback), Chữ Hán Giản Thể, Ôn tập phân hóa",
    targetGrade: "Lớp 10, 11, 12"
  },
  {
    id: "TOPIC_2",
    title: "Thiết kế nhiệm vụ giao tiếp theo tình huống (nghe - nói - đọc - viết) kết hợp hồ sơ học tập số cho học sinh THPT",
    focus: "Dạy học theo định hướng giao tiếp (CLT), Task-Based Learning, E-Portfolio, Đánh giá quá trình",
    targetGrade: "Lớp 10, 11, 12"
  },
  {
    id: "TOPIC_3",
    title: "Phân hóa bài luyện chữ Hán, từ vựng và phát âm bằng dữ liệu chẩn đoán đầu vào cho học sinh THPT",
    focus: "Chẩn đoán lỗi sai (Diagnostic Assessment), Dạy học phân hóa, Tránh chuyển di tiêu cực",
    targetGrade: "Lớp 10, 11"
  },
  {
    id: "TOPIC_4",
    title: "Tổ chức học tập hợp tác trên thiết bị số và đánh giá bằng rubric sản phẩm giao tiếp tiếng Trung THPT",
    focus: "Học tập hợp tác (Collaborative Learning), Rubric đánh giá năng lực, Công nghệ số / Di động (MALL)",
    targetGrade: "Lớp 11, 12"
  }
];

/**
 * NỘI DUNG TỔNG HỢP TOÀN VĂN CỦA GÓI TÀI LIỆU ĐƯỢC INJECT VÀO HỆ THỐNG AI / USER_INFO
 * Dùng làm nguồn trích dẫn pháp lý, chương trình và lý luận khoa học chính xác cho SKKN
 */
export const OFFICIAL_TIENG_TRUNG_DOCS_BUNDLE: string = `
================================================================================
TÀI LIỆU THAM KHẢO CHÍNH THỨC: DẠY HỌC TIẾNG TRUNG QUỐC (CHỮ HÁN GIẢN THỂ) CẤP THPT
Nguồn tài liệu chuẩn hóa: Gói tài liệu tham khảo Bộ GD&ĐT (27/09/2026)
================================================================================

I. CĂN CỨ PHÁP LÝ VIỆT NAM (THÔNG TƯ 19/2021/TT-BGDĐT)
- Cơ quan ban hành: BỘ GIÁO DỤC VÀ ĐÀO TẠO
- Số ký hiệu: Thông tư số 19/2021/TT-BGDĐT ngày 01 tháng 7 năm 2021.
- Hiệu lực thi hành: Đăng Công báo số 689 + 690; ban hành Chương trình giáo dục phổ thông môn Ngoại ngữ 1 (trong đó có môn Tiếng Trung Quốc từ lớp 3 đến lớp 12).
- Vị trí môn học: Môn Tiếng Trung Quốc - Ngoại ngữ 1 là một trong những môn học công cụ bắt buộc hoặc tự chọn theo lộ trình ở trường phổ thông; giúp học sinh hình thành và phát triển năng lực giao tiếp bằng tiếng Trung Quốc, góp phần hình thành ý thức công dân toàn cầu và năng lực giao tiếp liên văn hóa.
- Chuẩn chữ viết: Chương trình quy định sử dụng CHỮ HÁN GIẢN THỂ (简体字) làm chuẩn mực dạy học trong toàn bộ hệ thống giáo dục phổ thông Việt Nam.

II. MỤC TIÊU VÀ YÊU CẦU CẦN ĐẠT CỦA CHƯƠNG TRÌNH GDPT MÔN TIẾNG TRUNG QUỐC (CẤP THPT)
1. Mục tiêu cấp THPT:
   - Học sinh kết thúc cấp THPT đạt BẬC 3 theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam (ban hành theo Thông tư 01/2014/TT-BGDĐT, tương đương trình độ HSK 3 - HSK 4 quốc tế).
   - Sử dụng tiếng Trung Quốc như một công cụ giao tiếp hữu hiệu trong học tập, đời sống và định hướng nghề nghiệp tương lai.
   - Phát triển đồng đều cả 4 kỹ năng: Nghe, Nói, Đọc, Viết; có khả năng diễn đạt lưu loát các chủ điểm học tập, gia đình, xã hội, khoa học kỹ thuật và văn hóa Trung Hoa.

2. Chuẩn kiến thức ngôn ngữ cấp THPT:
   - Ngữ âm: Nắm vững ngữ điệu biểu thị các sắc thái cảm xúc đa dạng (vui mừng, buồn phiền, ngạc nhiên, trách móc, trang trọng, thân mật).
   - Chữ Hán: Dạy và học CHỮ HÁN GIẢN THỂ. Hiểu rõ ý nghĩa văn hóa và quy luật cấu tạo chữ Hán (chữ tượng hình, chỉ sự, hội ý, hình thanh); phân biệt các bộ thủ và chữ Hán dễ nhầm lẫn; quy tắc bút thuận và cấu trúc khối vuông.
   - Từ vựng: Cấp THPT bổ sung khoảng 1.000 từ vựng mới ở Bậc 3. Tổng vốn từ vựng tích lũy sau khi hoàn thành cấp THPT đạt khoảng 2.200 - 2.500 từ. Chú trọng gia tăng thành ngữ (成语), tục ngữ (俗语) và các cụm từ cố định trong giao tiếp.
   - Ngữ pháp: Tiếp tục củng cố và phát triển các cấu trúc ngữ pháp bậc cao:
     + Các dạng câu đặc biệt: Câu chữ 把 (bǎ), câu chữ 被 (bèi), câu tồn hiện, câu kiêm ngữ, câu liên động, câu so sánh (比, 没有, 不如...).
     + Hệ thống bổ ngữ phức tạp: Bổ ngữ kết quả, bổ ngữ xu hướng kép, bổ ngữ trạng thái/trình độ, bổ ngữ khả năng, bổ ngữ số lượng/thời lượng.
     + Thành phần trạng ngữ và định ngữ phức tạp: Phó từ mức độ, phạm vi, thời gian, ngữ khí, tần suất; cấu trúc trợ từ kết cấu 的, 地, 得.
     + Các loại câu ghép và quan hệ từ liên kết: Quan hệ tăng tiến (不仅...而且...), quan hệ chuyển ý (虽然...但是...), quan hệ giả thiết (如果...就...), quan hệ nguyên nhân - kết quả (因为...所以...).

3. Kiến thức văn hóa và giao tiếp liên văn hóa:
   - Ý nghĩa văn hóa truyền thống Trung Quốc thông qua thành ngữ, tục ngữ.
   - Văn hóa giao tiếp lịch sự, cách nói giảm nói tránh (婉言) trong tiếng Hán.
   - Kiến thức văn hóa, xã hội, con người Trung Quốc đương đại gắn liền với sự phát triển kinh tế, công nghệ.
   - Năng lực đối chiếu liên văn hóa: so sánh phong tục tập quán, thói quen ngôn ngữ Hán - Việt nhằm phát huy tính tương đồng và tránh lỗi chuyển di tiêu cực.

III. CƠ SỞ KHOA HỌC QUỐC TẾ: HỌC NGOẠI NGỮ TRỢ GIÚP BỞI THIẾT BỊ DI ĐỘNG (MALL - 2008)
- Tác giả: Agnes Kukulska-Hulme & Lesley Shield (2008), George Chinnery (2006).
- Luận điểm khoa học cốt lõi:
  1. Chuyển dịch mô hình: MALL (Mobile Assisted Language Learning) chuyển hóa phương thức dạy học từ "Truyền tải nội dung một chiều" (Content Delivery) sang "Hỗ trợ tương tác và hợp tác thời gian thực" (Supported Collaboration & Interaction).
  2. Tính di động và tính ngữ cảnh: Học sinh có thể tiếp cận ngữ liệu mọi lúc, mọi nơi (Ubiquitous Learning), gắn việc học từ vựng và chữ Hán với ngữ cảnh sinh hoạt thực tế.
  3. Phản hồi tức thời (Instant Feedback): Sử dụng các ứng dụng số (Flashcard tương tác, Quiz, AI Chatbot, phần mềm nhận diện phát âm/nét viết) giúp học sinh nhận diện lỗi sai ngữ pháp, ngữ âm ngay lập tức, khắc phục tính thụ động trong lớp học truyền thống.
  4. Đánh giá quá trình dựa trên dữ liệu (Data-driven Assessment): Giáo viên theo dõi sự tiến bộ của từng cá nhân qua dữ liệu tương tác số, từ đó phân hóa bài tập phù hợp với trình độ học sinh.

IV. NGUYÊN TẮC ÁP DỤNG TRONG SÁNG KIẾN KINH NGHIỆM TIẾNG TRUNG THPT
1. Luôn sử dụng CHỮ HÁN GIẢN THỂ (简体字) kèm phiên âm Pinyin chuẩn có thanh điệu.
2. Trích dẫn đầy đủ căn cứ pháp lý: Thông tư số 19/2021/TT-BGDĐT và Chương trình GDPT môn Tiếng Trung Quốc.
3. Các giải pháp ứng dụng công nghệ (AI, Quizlet, Padlet, Canva, Pleco, điện thoại thông minh) phải dựa trên khung lý thuyết MALL (Kukulska-Hulme & Shield, 2008) và thuyết Kiến tạo (Constructivism).
4. Phân tích lỗi sai phải bám sát nguyên tắc thụ đắc ngôn ngữ thứ 2 (SLA) và hiện tượng giao thoa ngôn ngữ Hán - Việt.
================================================================================
`;
