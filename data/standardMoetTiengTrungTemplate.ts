import { SKKNTemplate } from '../types';

/**
 * MẪU CHUẨN SÁNG KIẾN KINH NGHIỆM BỘ GIÁO DỤC VÀ ĐÀO TẠO
 * Chuyên ngành: Môn Tiếng Trung (Tiếng Hán Giản Thể) cấp THPT
 * Được phân tích và chuẩn hóa trực tiếp từ mẫu SKKN thực tế đạt chuẩn của Sở GD&ĐT:
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
3. Cấu trúc bài viết gồm 5 Chương chuẩn mực:
   - Chương I: Mở đầu (Lý do chọn đề tài, Mục đích, Đối tượng, Phạm vi, Phương pháp nghiên cứu thực nghiệm).
   - Chương II: Cơ sở lý luận (Lý thuyết ngôn ngữ học đối chiếu Hán - Việt, Thụ đắc ngôn ngữ thứ 2 SLA, Phân tích lỗi sai Interlanguage, Phân loại hệ thống phó từ và hư từ tiếng Hán).
   - Chương III: Thực trạng và phân tích lỗi sai (Khảo sát thực tiễn tại trường THPT; Phân tích 4 chiều: Ngữ tố, Ý nghĩa, Ngữ dụng/kết hợp cú pháp, Sắc thái tình cảm & phong cách; Có bảng số liệu điều tra).
   - Chương IV: Các giải pháp sư phạm (Phân tích nguyên nhân chuyển di tiêu cực; Đề xuất 4-5 giải pháp sư phạm đột phá: Phân tích ngữ tố, Quy trình 3 bước phân biệt nghĩa, Rèn luyện ngữ dụng kết hợp, Giảng dạy sắc thái văn hóa và ứng dụng CNTT/AI).
   - Chương V: Hiệu quả sáng kiến và Kết luận (Bảng số liệu đối chứng trước - sau tác động, kiểm định định lượng & định tính, bài học kinh nghiệm, kiến nghị nhân rộng).
4. Phong cách học thuật: Chuẩn mực sư phạm, lập luận chặt chẽ, số liệu thực nghiệm lẻ tự nhiên, bảng biểu Markdown chuẩn.
`,
  sections: [
    {
      id: "1",
      level: 1,
      title: "THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM",
      suggestedContent: "Tên sáng kiến, tác giả, đơn vị công tác, lĩnh vực nghiên cứu (Phương pháp dạy học môn Tiếng Trung THPT), đối tượng và thời gian áp dụng sáng kiến."
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
      suggestedContent: "Đặt vấn đề, lý do chọn đề tài, mục tiêu, nhiệm vụ, đối tượng, phương pháp nghiên cứu và tính mới của sáng kiến kinh nghiệm tiếng Trung THPT."
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
      title: "CHƯƠNG II: CƠ SỞ LÝ LUẬN VỀ TỪ GẦN NGHĨA VÀ PHÓ TỪ TIẾNG HÁN HIỆN ĐẠI",
      suggestedContent: "Tổng hợp cơ sở lý thuyết ngôn ngữ học, ngữ pháp tiếng Hán, lý thuyết thụ đắc ngôn ngữ thứ hai SLA và các văn bản chỉ đạo của Bộ GD&ĐT."
    },
    {
      id: "4.1",
      level: 2,
      title: "1. Lý luận về từ đồng nghĩa và từ gần nghĩa trong tiếng Hán",
      suggestedContent: "Khái niệm từ gần nghĩa (近义词), phân biệt từ đồng nghĩa tuyệt đối và từ cận nghĩa, các tiêu chí đối chiếu và phân biệt từ gần nghĩa trong dạy học ngoại ngữ."
    },
    {
      id: "4.2",
      level: 2,
      title: "2. Bản chất, phân loại và đặc trưng ngữ pháp của phó từ tiếng Hán hiện đại",
      suggestedContent: "Bản chất hư từ - thực từ của phó từ (副词); hệ thống 7 nhóm phó từ chính: mức độ (程度), phạm vi (范围), ngữ khí (语气), phương thức tình thái (方式情态), thời gian (时间), phủ định (否定), tần suất (频率); đặc điểm cú pháp làm trạng ngữ, bổ ngữ, tính liên kết."
    },
    {
      id: "4.3",
      level: 2,
      title: "3. Lý thuyết thụ đắc ngôn ngữ thứ hai (SLA) và Phân tích lỗi sai (Error Analysis)",
      suggestedContent: "Ngôn ngữ trung gian (Interlanguage), hiện tượng giao thoa ngôn ngữ và chuyển di tiêu cực (Negative Transfer) từ tiếng mẹ đẻ tiếng Việt sang tiếng Hán, quy trình nhận diện và xử lý lỗi sai theo quan điểm sư phạm hiện đại."
    },
    {
      id: "4.4",
      level: 2,
      title: "4. Cơ sở pháp lý và yêu cầu của Chương trình GDPT 2018 môn Tiếng Trung",
      suggestedContent: "Căn cứ Thông tư 32/2018/TT-BGDĐT, chuẩn đầu ra bậc 3 theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam (tương đương HSK 3 - HSK 4), định hướng phát triển năng lực giao tiếp toàn diện cho học sinh THPT."
    },
    {
      id: "5",
      level: 1,
      title: "CHƯƠNG III: THỰC TRẠNG VÀ PHÂN TÍCH LỖI SAI CỦA HỌC SINH THPT KHI SỬ DỤNG PHÓ TỪ TIẾNG TRUNG",
      suggestedContent: "Khảo sát thực tế tình hình học sinh THPT, phân loại và phân tích chi tiết lỗi sai theo 4 phương diện ngôn ngữ học kèm dẫn chứng sinh động."
    },
    {
      id: "5.1",
      level: 2,
      title: "1. Thực trạng dạy và học môn Tiếng Trung tại đơn vị",
      suggestedContent: "Đặc điểm tình hình nhà trường, đội ngũ giáo viên, số lượng học sinh học tiếng Trung, điều kiện cơ sở vật chất, thói quen học tập của học sinh THPT, khảo sát sơ bộ trước khi áp dụng giải pháp."
    },
    {
      id: "5.2",
      level: 2,
      title: "2. Phân tích lỗi sai về mặt Ngữ tố (语素方面)",
      suggestedContent: "Phân tích hiện tượng nhầm lẫn giữa các phó từ có chung ngữ tố: Cặp đơn - song âm tiết (白 vs 白白, 更 vs 更加, 相 vs 互相); Cặp song âm tiết có chung một ngữ tố (处处 vs 到处, 从不 vs 从没, 决不 vs 决无, 按时 vs 按期, 逐步 vs 逐渐, 决不 vs 绝不). Chỉ rõ câu sai thực tế của học sinh và phân tích cấu trúc ngữ tố dị biệt."
    },
    {
      id: "5.3",
      level: 2,
      title: "3. Phân tích lỗi sai về mặt Ý nghĩa của từ (词义方面)",
      suggestedContent: "Phân tích 3 mức độ sai lệch nghĩa: Mức độ nông sâu/nặng nhẹ khác nhau (竭力 vs 极力, 非常 vs 十分, 立刻 vs 马上, 不时 vs 时时, 忽然 vs 突然); Phạm vi ý nghĩa lớn nhỏ khác nhau (立刻 vs 马上, 将 vs 即将, 曾经 vs 已经); Trọng tâm ý nghĩa khác nhau (无法 vs 无力, 常常 vs 往往, 曾经 vs 已经, 向来 vs 一直, 尤其 vs 特别)."
    },
    {
      id: "5.4",
      level: 2,
      title: "4. Phân tích lỗi sai về mặt Ngữ dụng và Thói quen kết hợp cú pháp (语用方面)",
      suggestedContent: "Lỗi về thói quen kết hợp và đối tượng áp dụng (将 vs 即将 kết hợp mốc thời gian cụ thể; 尤其 vs 特别 kết hợp liên từ递进 hoặc cấu trúc trợ từ 的; 常常 vs 往往 kết hợp phó từ phủ định; 向来 vs 一直 kết hợp bổ ngữ số lượng; 最 vs 顶 kết hợp tính từ đơn âm); Lỗi về từ tính và chức năng cú pháp (đặc điểm lặp lại trùng điệp, khả năng làm vị ngữ, định ngữ, bổ ngữ: 时时 vs 时刻, 仍然 vs 仍旧, 忽然 vs 突然, 非常 vs 十分)."
    },
    {
      id: "5.5",
      level: 2,
      title: "5. Phân tích lỗi sai về mặt Sắc thái biểu cảm và Phong cách văn thể (色彩方面)",
      suggestedContent: "Lỗi về sắc thái hình tượng (cấu trúc mở rộng 'Phó từ mức độ + Danh từ': 更男人, 非常中国, 特别韩国); Sắc thái tình cảm khen chê (恐怕 mang sắc thái lo âu/tiêu cực vs 也许 trung tính; 白白 mang sắc thái uổng phí vs 更加 mang sắc thái tích cực); Sắc thái phong cách khẩu ngữ vs thư diện ngữ (皆 vs 都, 最 vs 顶 trong văn bản chính luận/học thuật)."
    },
    {
      id: "5.6",
      level: 2,
      title: "6. Bảng thống kê định lượng lỗi sai khảo sát đầu vào của học sinh THPT",
      suggestedContent: "Trình bày bảng số liệu khảo sát chi tiết trước tác động (số lượng, tỉ lệ % theo 4 phương diện lỗi sai), phân tích nguyên nhân tổng quát từ số liệu điều tra thực tế."
    },
    {
      id: "6",
      level: 1,
      title: "CHƯƠNG IV: CÁC GIẢI PHÁP SƯ PHẠM KHẮC PHỤC LỖI SAI CHO HỌC SINH THPT",
      suggestedContent: "Xây dựng hệ thống giải pháp sư phạm hoàn chỉnh, có tính thực tiễn và tính mới cao, hướng dẫn chi tiết từng bước triển khai cho giáo viên tiếng Trung."
    },
    {
      id: "6.1",
      level: 2,
      title: "1. Phân tích các nhóm nguyên nhân cốt lõi gây ra lỗi sai",
      suggestedContent: "Chỉ rõ 4 nhóm nguyên nhân: Giao thoa tiêu cực từ tiếng mẹ đẻ tiếng Việt; Tính trừu tượng và phức tạp của hư từ tiếng Hán; Phương pháp học thụ động và dịch thô từng chữ của học sinh; Thiếu ngữ liệu đối chiếu chuyên biệt trong SGK và tài liệu tham khảo."
    },
    {
      id: "6.2",
      level: 2,
      title: "2. Giải pháp 1: Ứng dụng phương pháp phân tích ngữ tố (语素分析法) nhận diện bản chất từ vựng",
      suggestedContent: "Quy trình hướng dẫn học sinh bóc tách cấu trúc ngữ tố: xác định ngữ tố chung, làm rõ nghĩa của ngữ tố dị biệt, phân biệt quy luật phối âm tiết đơn - song âm tiết và nhịp điệu câu tiếng Hán. Ví dụ bài giảng cụ thể trên lớp THPT."
    },
    {
      id: "6.3",
      level: 2,
      title: "3. Giải pháp 2: Xây dựng quy trình 3 bước phân biệt ngữ nghĩa (三步词义辨析法) kết hợp Sơ đồ tư duy",
      suggestedContent: "Quy trình 3 bước: Bước 1 - Hiểu bản nghĩa qua ngữ cảnh chuẩn; Bước 2 - Tích lũy ngữ nghĩa mở rộng qua SGK; Bước 3 - Vận dụng so sánh đối chiếu bằng bảng ma trận sai biệt. Hướng dẫn thiết kế bảng so sánh trực quan."
    },
    {
      id: "6.4",
      level: 2,
      title: "4. Giải pháp 3: Rèn luyện kỹ năng ngữ dụng, thói quen kết hợp cú pháp qua hệ thống bài tập phân hóa",
      suggestedContent: "Thiết kế chuỗi hoạt động luyện tập theo ngữ cảnh: Bài tập điền từ có điều kiện cú pháp, Bài tập phát hiện và chữa lỗi sai điển hình, Bài tập viết câu giao tiếp có tình huống thực tế. Tiêu chí đánh giá rubric cụ thể."
    },
    {
      id: "6.5",
      level: 2,
      title: "5. Giải pháp 4: Giảng dạy sắc thái tình cảm, phong cách gắn liền văn hóa giao tiếp và ứng dụng công nghệ AI",
      suggestedContent: "Tích hợp yếu tố văn hóa ngôn ngữ để học sinh cảm nhận sắc thái trang trọng/thân mật, khen/chê; ứng dụng các công cụ công nghệ và AI (như ứng dụng luyện khẩu ngữ, tra cứu ngữ liệu Corpus, phần mềm tạo thẻ tương tác Quizlet/Canva) hỗ trợ học sinh tự học tại nhà."
    },
    {
      id: "6.6",
      level: 2,
      title: "6. Giải pháp 5: Biên soạn 'Sổ tay tra cứu 25 cặp phó từ gần nghĩa thường gặp' và ngân hàng đề kiểm tra định kỳ",
      suggestedContent: "Xây dựng cẩm nang bỏ túi tiện dụng cho học sinh lớp 10, 11, 12 ôn thi tốt nghiệp THPT và chứng chỉ HSK; thiết lập ngân hàng câu hỏi đánh giá định kỳ theo ma trận năng lực của Bộ GD&ĐT."
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
      title: "2. Đánh giá định tính về sự chuyển biến năng lực của học sinh THPT",
      suggestedContent: "Phân tích sự tiến bộ về tâm lý, tính chủ động, hứng thú học tập, khả năng diễn đạt khẩu ngữ tự nhiên, kỹ năng viết đoạn văn đạt chuẩn và kết quả các kỳ thi học sinh giỏi, kỳ thi tốt nghiệp THPT."
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

I/ THÔNG TIN CHUNG VỀ SÁNG KIẾN
1. Tên sáng kiến: Giải pháp khắc phục lỗi sai của học sinh Việt Nam khi sử dụng phó từ gần nghĩa trong tiếng Hán.
2. Lĩnh vực áp dụng: Dạy và học bộ môn tiếng Hán (Tiếng Trung Giản Thể cấp THPT).
3. Tác giả: Dương Thị Vinh - Thạc sỹ, Giáo viên trường THPT Chuyên Chu Văn An.
4. Đối tượng áp dụng: Học sinh THPT hoặc du học sinh Việt Nam học tiếng Hán.
5. Căn cứ chuyên môn: Chương trình Giáo dục phổ thông môn Tiếng Trung Quốc ban hành theo Thông tư 32/2018/TT-BGDĐT.

中文摘要 (TÓM TẮT TIẾNG TRUNG)
学生的词汇量往往能体现其语言表达能力。词汇的掌握包含同义词、近义词的掌握和使用。学生对近义词掌握程度标志着其语言水平的高低。近义词的语义、色彩意义、语用的特征复杂多样，成为学生在习得汉语时遇到的一大障碍。汉语虚词是在汉语作为第二语言教学过程中的一个重点和难点，尤其是在虚词中占很大部分的副词。通过对高中学校学生的写作作业、作文试卷和调查问卷进行考察、统计，发现学生在使用汉语副词过程中的偏误主要就是混用近义副词。本文在对所收集语料中近义副词的语音、语义、语用、色彩等进行考察分析的基础上，对汉语近义副词偏误进行了系统分析，分出偏误类型并寻找偏误产生的原因，进而提出针对越南高中生切实可行的教学对策和建议。

MỤC LỤC CHI TIẾT (目录)
CHƯƠNG I: MỞ ĐẦU (第一章 绪论)
- 1. Lý do chọn đề tài (问题提出)
- 2. Mục đích và nhiệm vụ nghiên cứu
- 3. Phương pháp nghiên cứu (研究方法: 调查问卷, 数据统计, 对比分析, 偏误分析, 归纳总结)

CHƯƠNG II: CƠ SỞ LÝ LUẬN VỀ TỪ GẦN NGHĨA VÀ PHÓ TỪ TIẾNG HÁN HIỆN ĐẠI (第二章 现代汉语近义词及副词)
- 1. Lý luận về từ gần nghĩa (一、近义词)
- 2. Bản chất và phân loại phó từ tiếng Hán hiện đại (二、现代汉语副词)
  + Thuộc tính hư từ - thực từ của phó từ (副词的归属)
  + Định nghĩa phó từ (副词的定义)
  + Phân loại 7 nhóm phó từ: mức độ, phạm vi, ngữ khí, phương thức/tình thái, thời gian, phủ định, tần suất (副词的分类)
  + Đặc trưng ngữ pháp và cú pháp của phó từ (副词的语法特征)
- 3. Cơ sở lý thuyết Thụ đắc ngôn ngữ thứ 2 và Phân tích lỗi sai (偏误分析理论)

CHƯƠNG III: THỰC TRẠNG VÀ PHÂN TÍCH LỖI SAI CỦA HỌC SINH THPT KHI SỬ DỤNG PHÓ TỪ GẦN NGHĨA (第三章 越南学生汉语近义副词习得偏误分析)
- 1. Khảo sát thực trạng tại trường THPT
- 2. Phân tích lỗi sai về mặt Ngữ tố (一、语素方面)
  + Nhầm lẫn cặp đơn - song âm tiết có chung ngữ tố: 白 vs 白白, 更 vs 更加, 相 vs 互相
  + Nhầm lẫn cặp song âm tiết có chung ngữ tố: 处处 vs 到处, 从不 vs 从没, 决不 vs 决无, 按时 vs 按期, 逐步 vs 逐渐, 决不 vs 绝不
- 3. Phân tích lỗi sai về mặt Ý nghĩa của từ (二、词义方面)
  + Mức độ nông sâu/nhẹ nặng khác nhau: 竭力 vs 极力, 非常 vs 十分, 立刻 vs 马上, 不时 vs 时时, 忽然 vs 突然
  + Phạm vi ý nghĩa lớn nhỏ khác nhau: 立刻 vs 马上, 将 vs 即将, 曾经 vs 已经
  + Trọng tâm ý nghĩa khác nhau: 无法 vs 无力, 常常 vs 往往, 曾经 vs 已经, 向来 vs 一直, 尤其 vs 特别
- 4. Phân tích lỗi sai về mặt Ngữ dụng và Kết hợp cú pháp (三、语用方面)
  + Thói quen kết hợp và đối tượng áp dụng: 将 vs 即将 + thời gian cụ thể; 尤其 vs 特别 + liên từ / trợ từ 的; 常常 vs 往往 + phủ định; 一直 vs 向来 + bổ ngữ số lượng; 顶 vs 最 + tính từ đơn âm tiết; 十分 vs 非常 + phủ định 不
  + Từ tính và chức năng cú pháp: 特别 (có thể lặp lại, kiêm tính từ) vs 尤其 (chỉ làm phó từ); 时刻 (danh từ/phó từ) vs 时时 (chỉ là phó từ); 仍旧 (động từ/phó từ) vs 仍然 (phó từ); 突然 (hình dung từ) vs 忽然 (phó từ); 非常时期 (định ngữ) vs 十分
- 5. Phân tích lỗi sai về mặt Sắc thái biểu cảm và Phong cách (四、色彩方面)
  + Sắc thái hình tượng: cấu trúc mở rộng 'Phó từ mức độ + Danh từ' (更男人, 更加男人, 非常中国, 十分中国, 特别韩国)
  + Sắc thái tình cảm: 恐怕 (lo âu/tiêu cực) vs 也许 (trung tính); 白白 (uổng phí/tiêu cực) vs 更加 (tích cực)
  + Sắc thái phong cách: 皆 vs 都, 最 vs 顶 (văn bản học thuật/chính luận vs khẩu ngữ sinh hoạt)
- 6. Bảng thống kê định lượng lỗi sai khảo sát đầu vào

CHƯƠNG IV: NGUYÊN NHÂN VÀ CÁC GIẢI PHÁP SƯ PHẠM ĐỀ XUẤT CHO HỌC SINH THPT (第四章 偏误原因及教学对策)
- 1. Phân tích nguyên nhân: chuyển di tiêu cực từ tiếng mẹ đẻ tiếng Việt, độ phức tạp của hư từ tiếng Hán, thói quen học vẹt dịch từng từ của học sinh THPT.
- 2. Giải pháp 1: Phương pháp phân tích ngữ tố (语素分析法) giúp học sinh bóc tách cấu trúc từ vựng.
- 3. Giải pháp 2: Quy trình 3 bước phân biệt ngữ nghĩa (三步词义辨析法: Hiểu bản nghĩa -> Tích lũy ngữ cảnh -> Vận dụng đối chiếu).
- 4. Giải pháp 3: Rèn luyện kỹ năng ngữ dụng và thói quen kết hợp cú pháp chuẩn xác qua hệ thống bài tập phân hóa.
- 5. Giải pháp 4: Giảng dạy sắc thái tình cảm, phong cách gắn liền văn hóa giao tiếp và ứng dụng công nghệ AI / Corpus.
- 6. Giải pháp 5: Biên soạn Sổ tay tra cứu 25 cặp phó từ gần nghĩa bỏ túi và ngân hàng bài kiểm tra định kỳ.

CHƯƠNG V: HIỆU QUẢ CỦA SÁNG KIẾN VÀ KẾT LUẬN (第五章 结语)
- 1. Kết quả thực nghiệm sư phạm: Bảng số liệu đối chứng trước - sau tác động, tỉ lệ học sinh cải thiện >35%.
- 2. Đánh giá định tính: Sự tự tin và năng lực ngôn ngữ của học sinh THPT.
- 3. Bài học kinh nghiệm và khả năng nhân rộng.
- 4. Kết luận và Khuyến nghị đối với Sở GD&ĐT, nhà trường, giáo viên.

TÀI LIỆU THAM KHẢO & PHỤ LỤC (参考文献及附录)`
};
