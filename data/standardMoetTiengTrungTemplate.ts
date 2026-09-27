import { SKKNTemplate } from '../types';

/**
 * MẪU CHUẨN SÁNG KIẾN KINH NGHIỆM BỘ GIÁO DỤC VÀ ĐÀO TẠO
 * Chuyên ngành: Môn Tiếng Trung (Tiếng Hán Giản Thể) cấp THPT
 * Được chuẩn hóa theo đúng cấu trúc chỉ đạo của Bộ GD&ĐT và phân tích từ mẫu thực tế:
 * Đề tài: "Giải pháp khắc phục lỗi sai của học sinh Việt Nam khi sử dụng phó từ gần nghĩa trong tiếng Hán"
 * Tác giả: ThS. Dương Thị Vinh - Trường THPT Chuyên Chu Văn An
 */

export const STANDARD_MOET_TIENG_TRUNG_TEMPLATE: SKKNTemplate = {
  name: "Mẫu chuẩn Bộ GD&ĐT - SKKN Tiếng Trung Giản Thể THPT",
  pageLimitFromTemplate: 30,
  headerFields: {
    governingBody: "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
    institution: "TRƯỜNG TRUNG HỌC PHỔ THÔNG",
    subject: "Môn Tiếng Trung Quốc (Tiếng Hán Giản Thể) cấp THPT",
    gradeLevel: "Lớp 10, 11, 12 THPT (Chương trình GDPT 2018)",
    authorRole: "Giáo viên môn Tiếng Trung THPT",
    standardFramework: "Chương trình Giáo dục phổ thông 2018 theo Thông tư 32/2018/TT-BGDĐT",
  },
  contentGuidelines: `
HƯỚNG DẪN VIẾT SKKN TIẾNG TRUNG GIẢN THỂ CẤP THPT CHUẨN BỘ GD&ĐT:
1. Đối tượng và phạm vi: Học sinh THPT học môn Tiếng Trung (Tiếng Hán Giản Thể) theo CT GDPT 2018 (sách giáo khoa Tiếng Trung Quốc 10, 11, 12).
2. Chuẩn chữ viết và ngữ liệu: 
   - Chữ Hán phải dùng CHỮ HÁN GIẢN THỂ (简体字) chuẩn mực quốc tế.
   - Luôn kèm phiên âm Pinyin chuẩn thanh điệu (khi phân tích chi tiết) và bản dịch nghĩa tiếng Việt.
   - Trích dẫn ví dụ ngôn ngữ thực tế (có câu sai của học sinh kèm dấu sao * và câu sửa đúng tương ứng).
3. Cấu trúc bài viết gồm đầy đủ các mục chuẩn Bộ GD&ĐT:
   - 📌THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM
   - 📌TÓM TẮT SÁNG KIẾN (中文摘要 & TÓM TẮT TIẾNG VIỆT)
   - 📌CHƯƠNG I: MỞ ĐẦU
     • 1. Lý do chọn đề tài (Tính cấp thiết của đề tài)
     • 2. Mục đích và nhiệm vụ nghiên cứu
     • 3. Đối tượng và phạm vi nghiên cứu
     • 4. Phương pháp nghiên cứu
     • 5. Điểm mới và đóng góp khoa học của sáng kiến
   - 📌CHƯƠNG II: CƠ SỞ LÝ LUẬN
     • 1. Cơ sở lý thuyết về nội dung sáng kiến
     • 2. Cơ sở pháp lý và yêu cầu của Chương trình GDPT 2018 môn Tiếng Trung
   - 📌CHƯƠNG III: THỰC TRẠNG VẤN ĐỀ
   - 📌CHƯƠNG IV: CÁC GIẢI PHÁP
     • 1. Phân tích các vấn đề
     • 2. Giải pháp 1:
     • 3. Giải pháp 2:
     • 4. Giải pháp 3:
     • 5. Giải pháp 4: (nếu có)
     • 6. Giải pháp 5: (nếu có)
   - 📌CHƯƠNG V: HIỆU QUẢ CỦA SÁNG KIẾN VÀ KẾT LUẬN
     • 1. Kết quả thực nghiệm sư phạm định lượng (Bảng số liệu đối chứng trước và sau tác động)
     • 2. Đánh giá định tính
     • 3. Bài học kinh nghiệm và khả năng nhân rộng của sáng kiến
     • 4. Kết luận và Khuyến nghị
   - 📌TÀI LIỆU THAM KHẢO CHUẨN MỰC
   - 📌PHỤ LỤC SÁNG KIẾN KINH NGHIỆM
4. Phong cách học thuật: Chuẩn mực sư phạm, lập luận chặt chẽ, số liệu thực nghiệm khoa học, bảng biểu Markdown chuẩn.
`,
  sections: [
    {
      id: "1",
      level: 1,
      title: "THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM",
      suggestedContent: "Tên sáng kiến, tác giả, chức vụ, đơn vị công tác, lĩnh vực nghiên cứu (Phương pháp dạy học môn Tiếng Trung THPT), đối tượng và thời gian áp dụng sáng kiến kinh nghiệm."
    },
    {
      id: "2",
      level: 1,
      title: "TÓM TẮT SÁNG KIẾN (中文摘要 & TÓM TẮT TIẾNG VIỆT)",
      suggestedContent: "Tóm tắt bối cảnh, mục đích, đối tượng, phương pháp nghiên cứu, hệ thống các giải pháp chính và kết quả thực nghiệm sư phạm bằng cả tiếng Việt và tiếng Trung (中文摘要)."
    },
    {
      id: "3",
      level: 1,
      title: "CHƯƠNG I: MỞ ĐẦU",
      suggestedContent: "Đặt vấn đề, tính cấp thiết, mục tiêu, nhiệm vụ, đối tượng, phương pháp nghiên cứu và điểm mới của sáng kiến kinh nghiệm tiếng Trung THPT."
    },
    {
      id: "3.1",
      level: 2,
      title: "1. Lý do chọn đề tài (Tính cấp thiết của đề tài)",
      suggestedContent: "Phân tích tầm quan trọng của môn Tiếng Trung trong trường THPT, vị trí của hư từ/phó từ trong việc nâng cao năng lực giao tiếp và viết văn của học sinh, những khó khăn thực tế mà học sinh THPT gặp phải khi học từ gần nghĩa."
    },
    {
      id: "3.2",
      level: 2,
      title: "2. Mục đích và nhiệm vụ nghiên cứu",
      suggestedContent: "Xác định rõ mục đích nâng cao chất lượng dạy học tiếng Trung THPT; các nhiệm vụ: nghiên cứu cơ sở lý luận, khảo sát thực trạng lỗi sai, đề xuất hệ thống giải pháp sư phạm và kiểm chứng hiệu quả thực nghiệm."
    },
    {
      id: "3.3",
      level: 2,
      title: "3. Đối tượng và phạm vi nghiên cứu",
      suggestedContent: "Đối tượng: Quá trình thụ đắc và sử dụng phó từ gần nghĩa trong tiếng Hán giản thể của học sinh THPT. Phạm vi: Học sinh các khối 10, 11, 12; hệ thống các cặp phó từ gần nghĩa thường dùng trong chương trình THPT."
    },
    {
      id: "3.4",
      level: 2,
      title: "4. Phương pháp nghiên cứu",
      suggestedContent: "Kết hợp các phương pháp: Điều tra bằng bảng hỏi (调查问卷), Thống kê số liệu bài thi/bài viết (数据统计), So sánh đối chiếu Hán - Việt (对比分析), Phân tích lỗi sai (偏误分析), Thực nghiệm sư phạm đối chứng (教学实验)."
    },
    {
      id: "3.5",
      level: 2,
      title: "5. Điểm mới và đóng góp khoa học của sáng kiến",
      suggestedContent: "Chỉ rõ tính đột phá: xây dựng ma trận phân loại lỗi sai 4 chiều (ngữ tố, ngữ nghĩa, ngữ dụng, sắc thái), quy trình sư phạm khắc phục triệt để lỗi chuyển di tiêu cực từ tiếng mẹ đẻ sang tiếng Hán."
    },
    {
      id: "4",
      level: 1,
      title: "CHƯƠNG II: CƠ SỞ LÝ LUẬN",
      suggestedContent: "Tổng hợp cơ sở lý thuyết ngôn ngữ học, lý thuyết thụ đắc ngôn ngữ thứ hai SLA, phân tích lỗi sai (Error Analysis), ngôn ngữ trung gian (Interlanguage) và các văn bản pháp lý chỉ đạo của Bộ GD&ĐT."
    },
    {
      id: "4.1",
      level: 2,
      title: "1. Cơ sở lý thuyết về nội dung sáng kiến",
      suggestedContent: "Lý luận về từ đồng nghĩa và từ gần nghĩa trong tiếng Hán (近义词); Bản chất, phân loại và đặc trưng ngữ pháp của phó từ tiếng Hán hiện đại (7 nhóm phó từ, đặc trưng cú pháp); Lý thuyết thụ đắc ngôn ngữ thứ hai (SLA), Phân tích lỗi sai (Error Analysis) và Ngôn ngữ trung gian (Interlanguage); Hiện tượng giao thoa ngôn ngữ và chuyển di tiêu cực (Negative Transfer) từ tiếng mẹ đẻ sang tiếng Hán."
    },
    {
      id: "4.2",
      level: 2,
      title: "2. Cơ sở pháp lý và yêu cầu của Chương trình GDPT 2018 môn Tiếng Trung",
      suggestedContent: "Căn cứ Thông tư 32/2018/TT-BGDĐT ban hành Chương trình GDPT môn Tiếng Trung Quốc; Chuẩn đầu ra bậc 3 theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam (tương đương HSK 3 - HSK 4), định hướng phát triển năng lực giao tiếp toàn diện cho học sinh THPT."
    },
    {
      id: "5",
      level: 1,
      title: "CHƯƠNG III: THỰC TRẠNG VẤN ĐỀ",
      suggestedContent: "Khảo sát thực tế tình hình dạy và học môn Tiếng Trung tại đơn vị; Thực trạng khó khăn của học sinh khi sử dụng phó từ tiếng Trung; Phân loại và phân tích chi tiết lỗi sai theo 4 phương diện ngôn ngữ học (Ngữ tố, Ý nghĩa, Ngữ dụng & kết hợp cú pháp, Sắc thái biểu cảm & phong cách) kèm câu sai thực tế (*) và câu đúng; Bảng thống kê định lượng lỗi sai khảo sát đầu vào của học sinh THPT trước tác động."
    },
    {
      id: "6",
      level: 1,
      title: "CHƯƠNG IV: CÁC GIẢI PHÁP",
      suggestedContent: "Xây dựng hệ thống giải pháp sư phạm hoàn chỉnh, có tính thực tiễn và tính mới cao, hướng dẫn chi tiết từng bước triển khai cho giáo viên tiếng Trung."
    },
    {
      id: "6.1",
      level: 2,
      title: "1. Phân tích các vấn đề",
      suggestedContent: "Chỉ rõ 4 nhóm nguyên nhân cốt lõi gây ra lỗi sai: Giao thoa tiêu cực từ tiếng mẹ đẻ tiếng Việt; Tính trừu tượng và phức tạp của hư từ tiếng Hán; Phương pháp học thụ động và dịch thô từng chữ của học sinh; Thiếu ngữ liệu đối chiếu chuyên biệt trong SGK và tài liệu tham khảo."
    },
    {
      id: "6.2",
      level: 2,
      title: "2. Giải pháp 1:",
      suggestedContent: "Phương pháp phân tích ngữ tố (语素分析法) giúp học sinh bóc tách cấu trúc từ vựng: nhận diện ngữ tố chung, làm rõ ngữ tố dị biệt, phân biệt nhịp điệu phối âm tiết đơn - song âm tiết (ví dụ: 白 vs 白白, 更 vs 更加, 相 vs 互相, 处处 vs 到处, 按时 vs 按期, 逐步 vs 逐渐...)."
    },
    {
      id: "6.3",
      level: 2,
      title: "3. Giải pháp 2:",
      suggestedContent: "Xây dựng quy trình 3 bước phân biệt ngữ nghĩa (三步词义辨析法) kết hợp Sơ đồ tư duy: Bước 1 - Hiểu bản nghĩa qua ngữ cảnh chuẩn; Bước 2 - Tích lũy ngữ nghĩa mở rộng qua SGK; Bước 3 - Vận dụng so sánh đối chiếu bằng bảng ma trận sai biệt (ví dụ: 竭力 vs 极力, 非常 vs 十分, 立刻 vs 马上, 忽然 vs 突然, 曾经 vs 已经...)."
    },
    {
      id: "6.4",
      level: 2,
      title: "4. Giải pháp 3:",
      suggestedContent: "Rèn luyện kỹ năng ngữ dụng, thói quen kết hợp cú pháp qua hệ thống bài tập phân hóa: Thiết kế chuỗi hoạt động luyện tập theo ngữ cảnh: Bài tập điền từ có điều kiện cú pháp, Bài tập phát hiện và chữa lỗi sai điển hình (*), Bài tập viết câu giao tiếp có tình huống thực tế (ví dụ: 将 vs 即将, 尤其 vs 特别, 常常 vs 往往, 向来 vs 一直...)."
    },
    {
      id: "6.5",
      level: 2,
      title: "5. Giải pháp 4: (nếu có)",
      suggestedContent: "Giảng dạy sắc thái tình cảm, phong cách gắn liền văn hóa giao tiếp và ứng dụng công nghệ AI: Tích hợp yếu tố văn hóa ngôn ngữ để học sinh cảm nhận sắc thái trang trọng/thân mật, khen/chê (恐怕 vs 也许, 皆 vs 都); Ứng dụng công cụ AI, phần mềm luyện khẩu ngữ, thẻ Quizlet/Canva hỗ trợ học sinh tự học tại nhà."
    },
    {
      id: "6.6",
      level: 2,
      title: "6. Giải pháp 5: (nếu có)",
      suggestedContent: "Biên soạn 'Sổ tay tra cứu 25 cặp phó từ gần nghĩa thường gặp' và ngân hàng đề kiểm tra định kỳ: Cẩm nang bỏ túi tiện dụng cho học sinh lớp 10, 11, 12 ôn thi tốt nghiệp THPT và chứng chỉ HSK; ngân hàng câu hỏi đánh giá định kỳ theo ma trận năng lực của Bộ GD&ĐT."
    },
    {
      id: "7",
      level: 1,
      title: "CHƯƠNG V: HIỆU QUẢ CỦA SÁNG KIẾN VÀ KẾT LUẬN",
      suggestedContent: "Báo cáo số liệu thực nghiệm đối chứng trước và sau khi áp dụng sáng kiến, đánh giá định tính, bài học kinh nghiệm và kiến nghị đề xuất."
    },
    {
      id: "7.1",
      level: 2,
      title: "1. Kết quả thực nghiệm sư phạm định lượng (Bảng số liệu đối chứng trước và sau tác động)",
      suggestedContent: "So sánh kết quả giữa lớp thực nghiệm (TN) và lớp đối chứng (ĐC) trước và sau khi triển khai giải pháp. Trình bày bảng số liệu chi tiết (tỉ lệ điểm Giỏi, Khá, Trung bình, Yếu; tỉ lệ giảm lỗi sai ở cả 4 phương diện >35%), kiểm định độ tin cậy khoa học."
    },
    {
      id: "7.2",
      level: 2,
      title: "2. Đánh giá định tính",
      suggestedContent: "Đánh giá định tính về sự chuyển biến năng lực của học sinh THPT: sự tiến bộ về tâm lý, tính chủ động, hứng thú học tập, khả năng diễn đạt khẩu ngữ tự nhiên, kỹ năng viết đoạn văn đạt chuẩn và kết quả các kỳ thi học sinh giỏi, kỳ thi tốt nghiệp THPT."
    },
    {
      id: "7.3",
      level: 2,
      title: "3. Bài học kinh nghiệm và khả năng nhân rộng của sáng kiến",
      suggestedContent: "Tổng kết những bài học quý báu trong công tác giảng dạy tiếng Trung THPT; điều kiện để nhân rộng mô hình cho các trường THPT khác trong tỉnh và toàn quốc."
    },
    {
      id: "7.4",
      level: 2,
      title: "4. Kết luận và Khuyến nghị",
      suggestedContent: "Kết luận khẳng định giá trị thực tiễn của sáng kiến; Khuyến nghị đối với Bộ/Sở GD&ĐT (tài liệu chuyên khảo, tập huấn chuyên môn), Ban giám hiệu nhà trường (cơ sở vật chất, tiết tự chọn tiếng Trung), tổ chuyên môn và đồng nghiệp."
    },
    {
      id: "8",
      level: 1,
      title: "TÀI LIỆU THAM KHẢO CHUẨN MỰC",
      suggestedContent: "Danh mục tài liệu tham khảo bằng tiếng Việt và tiếng Trung theo chuẩn khoa học: Hiện đại Hán ngữ bát bách từ (Lữ Thúc Tương), Nghiên cứu phó từ tiếng Hán hiện đại (Trương Ý Sinh), 1700 đôi từ cận nghĩa đối chiếu (Dương Ký Châu), Sổ tay hư từ tiếng Hán hiện đại (Lý Hiểu Kỳ), các giáo trình chuẩn HSK và Chương trình GDPT 2018 môn Tiếng Trung."
    },
    {
      id: "9",
      level: 1,
      title: "PHỤ LỤC SÁNG KIẾN KINH NGHIỆM",
      suggestedContent: "Phụ lục 1: Phiếu điều tra khảo sát lỗi sai của học sinh THPT; Phụ lục 2: Bảng tổng hợp 25 cặp phó từ gần nghĩa tiếng Hán và bài tập thực hành mẫu; Phụ lục 3: Kế hoạch bài dạy (Giáo án) minh họa ứng dụng giải pháp; Phụ lục 4: Đề kiểm tra đánh giá trước và sau thực nghiệm."
    }
  ],
  rawContent: `SỞ GIÁO DỤC VÀ ĐÀO TẠO
TRƯỜNG THPT CHUYÊN CHU VĂN AN
= = = = =* ----- * = = = = =
SÁNG KIẾN KINH NGHIỆM
GIẢI PHÁP KHẮC PHỤC LỖI SAI CỦA HỌC SINH VIỆT NAM KHI SỬ DỤNG PHÓ TỪ GẦN NGHĨA TRONG TIẾNG HÁN
(越南学生汉语近义副词习得偏误分析及教学对策)
Tác giả: ThS. Dương Thị Vinh
Chức vụ: Giáo viên môn Tiếng Trung
Nơi công tác: Trường THPT Chuyên Chu Văn An

📌THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM
1. Tên sáng kiến: Giải pháp khắc phục lỗi sai của học sinh Việt Nam khi sử dụng phó từ gần nghĩa trong tiếng Hán.
2. Lĩnh vực áp dụng: Dạy và học bộ môn tiếng Hán (Tiếng Trung Giản Thể cấp THPT).
3. Tác giả: Dương Thị Vinh - Thạc sỹ, Giáo viên trường THPT Chuyên Chu Văn An.
4. Đối tượng áp dụng: Học sinh THPT hoặc du học sinh Việt Nam học tiếng Hán.
5. Căn cứ chuyên môn: Chương trình Giáo dục phổ thông môn Tiếng Trung Quốc ban hành theo Thông tư 32/2018/TT-BGDĐT.

📌TÓM TẮT SÁNG KIẾN (中文摘要 & TÓM TẮT TIẾNG VIỆT)
中文摘要 (TÓM TẮT TIẾNG TRUNG):
学生的词汇量往往能体现其语言表达能力。词汇的掌握包含同义词、近义词的掌握和使用。学生对近义词掌握程度标志着其语言水平的高低。近义词的语义、色彩意义、语用的特征复杂多样，成为学生在习得汉语时遇到的一大障碍。汉语虚词是在汉语作为第二语言教学过程中的一个重点和难点，尤其是在虚词中占很大部分的副词。通过对高中学校学生的写作作业、作文试卷和调查问卷进行考察、统计，发现学生在使用汉语副词过程中的偏误主要就是混用近义副词。本文在对所收集语料中近义副词的语音、语义、语用、色彩等进行考察分析的基础上，对汉语近义副词偏误进行了系统分析，分出偏误类型并寻找偏误产生的原因，进而提出针对越南高中生切实可行的教学对策和建议。

TÓM TẮT TIẾNG VIỆT:
Vốn từ vựng của học sinh là chỉ số phản ánh trực tiếp năng lực biểu đạt ngôn ngữ. Trong đó, mức độ nắm bắt và vận dụng từ gần nghĩa là thước đo quan trọng đánh giá trình độ tiếng Hán. Do phó từ tiếng Hán có đặc tính phức tạp về ngữ nghĩa, ngữ dụng và sắc thái phong cách, học sinh THPT Việt Nam thường xuyên mắc lỗi dùng lẫn lộn giữa các phó từ gần nghĩa. Sáng kiến tiến hành khảo sát thực tiễn, phân loại lỗi sai theo 4 phương diện (ngữ tố, ngữ nghĩa, ngữ dụng/cú pháp, sắc thái phong cách), bóc tách nguyên nhân chuyển di tiêu cực từ tiếng mẹ đẻ và đề xuất hệ thống giải pháp sư phạm đột phá kèm thực nghiệm đối chứng tại trường THPT.

MỤC LỤC CHI TIẾT (目录)
📌THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM
📌TÓM TẮT SÁNG KIẾN (中文摘要 & TÓM TẮT TIẾNG VIỆT)
📌CHƯƠNG I: MỞ ĐẦU
•1. Lý do chọn đề tài (Tính cấp thiết của đề tài)
•2. Mục đích và nhiệm vụ nghiên cứu
•3. Đối tượng và phạm vi nghiên cứu
•4. Phương pháp nghiên cứu
•5. Điểm mới và đóng góp khoa học của sáng kiến
📌CHƯƠNG II: CƠ SỞ LÝ LUẬN
•1. Cơ sở lý thuyết về nội dung sáng kiến
•2. Cơ sở pháp lý và yêu cầu của Chương trình GDPT 2018 môn Tiếng Trung
📌CHƯƠNG III: THỰC TRẠNG VẤN ĐỀ
📌CHƯƠNG IV: CÁC GIẢI PHÁP
•1. Phân tích các vấn đề
•2. Giải pháp 1: Ứng dụng phương pháp phân tích ngữ tố (语素分析法) nhận diện bản chất từ vựng
•3. Giải pháp 2: Xây dựng quy trình 3 bước phân biệt ngữ nghĩa (三步词义辨析法) kết hợp Sơ đồ tư duy
•4. Giải pháp 3: Rèn luyện kỹ năng ngữ dụng, thói quen kết hợp cú pháp qua hệ thống bài tập phân hóa
•5. Giải pháp 4: (nếu có) Giảng dạy sắc thái tình cảm, phong cách gắn liền văn hóa giao tiếp và ứng dụng công nghệ AI
•6. Giải pháp 5: (nếu có) Biên soạn 'Sổ tay tra cứu 25 cặp phó từ gần nghĩa thường gặp' và ngân hàng đề kiểm tra định kỳ
📌CHƯƠNG V: HIỆU QUẢ CỦA SÁNG KIẾN VÀ KẾT LUẬN
•1. Kết quả thực nghiệm sư phạm định lượng (Bảng số liệu đối chứng trước và sau tác động)
•2. Đánh giá định tính
•3. Bài học kinh nghiệm và khả năng nhân rộng của sáng kiến
•4. Kết luận và Khuyến nghị
📌TÀI LIỆU THAM KHẢO CHUẨN MỰC
📌PHỤ LỤC SÁNG KIẾN KINH NGHIỆM
`
};
