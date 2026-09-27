import { SKKNTemplate } from '../types';

/**
 * MẪU CHUẨN SÁNG KIẾN KINH NGHIỆM BỘ GIÁO DỤC VÀ ĐÀO TẠO
 * Chuyên ngành: Môn Tiếng Trung (Tiếng Hán Giản Thể) cấp THPT
 * Được chuẩn hóa theo đúng cấu trúc chỉ đạo của Bộ GD&ĐT và phân tích từ mẫu thực tế:
 * Đề tài: "Giải pháp khắc phục lỗi sai của học sinh Việt Nam khi sử dụng phó từ gần nghĩa trong tiếng Hán"
 * Tác giả: ThS. Dương Thị Vinh - Trường THPT Chuyên Chu Văn An
 * 
 * QUY ĐỊNH NGÔN NGỮ BẮT BUỘC:
 * - Bước Lập Dàn Ý & Mục I (Thông tin chung về sáng kiến): VIẾT BẰNG TIẾNG VIỆT
 * - Bắt đầu từ Mục Tóm tắt sáng kiến (中文摘要) và toàn bộ các chương tiếp theo: VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)
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

🌐 1. QUY ĐỊNH NGÔN NGỮ TRÌNH BÀY (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
   - BƯỚC LẬP DÀN Ý: Viết hoàn toàn bằng TIẾNG VIỆT để giáo viên và hội đồng thẩm định đánh giá khung sườn cấu trúc.
   - MỤC I. THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM: Viết bằng TIẾNG VIỆT (Tên sáng kiến, tác giả, chức vụ, đơn vị công tác, đối tượng và thời gian nghiên cứu...).
   - BẮT ĐẦU TỪ MỤC TÓM TẮT SÁNG KIẾN (中文摘要) VÀ TOÀN BỘ CÁC CHƯƠNG TIẾP THEO (Chương I: Mở đầu, Chương II: Cơ sở lý luận, Chương III: Thực trạng, Chương IV: Các giải pháp, Chương V: Hiệu quả & Kết luận, Tài liệu tham khảo, Phụ lục): TOÀN BỘ VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)!

🀄 2. Chuẩn chữ viết và ngữ liệu Tiếng Trung:
   - Toàn bộ chữ Hán phải dùng CHỮ HÁN GIẢN THỂ (简体字) chuẩn mực quốc tế.
   - Ngôn phong học thuật chuẩn mực Hán ngữ hiện đại, câu cú trôi chảy, lập luận chặt chẽ.
   - Khi phân tích chi tiết từ vựng/cú pháp, có thể kèm phiên âm Pinyin chuẩn thanh điệu và bản dịch nghĩa đối chiếu.
   - Trích dẫn câu sai thực tế của học sinh kèm dấu sao (*) và câu sửa đúng tương ứng.

📑 3. Cấu trúc bài viết gồm đầy đủ các mục chuẩn Bộ GD&ĐT:
   - 📌THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM (Viết Tiếng Việt)
   - 📌TÓM TẮT SÁNG KIẾN (中文摘要) (Bắt đầu viết Tiếng Trung Giản Thể 简体中文)
   - 📌CHƯƠNG I: MỞ ĐẦU (第一章 引言) (Viết Tiếng Trung Giản Thể)
     • 1. Lý do chọn đề tài (选题理由与紧迫性)
     • 2. Mục đích và nhiệm vụ nghiên cứu (研究目的与任务)
     • 3. Đối tượng và phạm vi nghiên cứu (研究对象与范围)
     • 4. Phương pháp nghiên cứu (研究方法)
     • 5. Điểm mới và đóng góp khoa học của sáng kiến (创新点与科学贡献)
   - 📌CHƯƠNG II: CƠ SỞ LÝ LUẬN (第二章 理论依据) (Viết Tiếng Trung Giản Thể)
     • 1. Cơ sở lý thuyết về nội dung sáng kiến (核心理论)
     • 2. Cơ sở pháp lý và yêu cầu của Chương trình GDPT 2018 môn Tiếng Trung (法规与课标依据)
   - 📌CHƯƠNG III: THỰC TRẠNG VẤN ĐỀ (第三章 现状与偏误分析) (Viết Tiếng Trung Giản Thể)
   - 📌CHƯƠNG IV: CÁC GIẢI PHÁP (第四章 教学对策与实施方案) (Viết Tiếng Trung Giản Thể)
     • 1. Phân tích các vấn đề (偏误成因剖析)
     • 2. Giải pháp 1: (对策一)
     • 3. Giải pháp 2: (对策二)
     • 4. Giải pháp 3: (对策三)
     • 5. Giải pháp 4: (对策四 - nếu có)
     • 6. Giải pháp 5: (对策五 - nếu có)
   - 📌CHƯƠNG V: HIỆU QUẢ CỦA SÁNG KIẾN VÀ KẾT LUẬN (第五章 教学效果与结论建议) (Viết Tiếng Trung Giản Thể)
     • 1. Kết quả thực nghiệm sư phạm định lượng (教学实验量化成果数据表)
     • 2. Đánh giá định tính (质性评估)
     • 3. Bài học kinh nghiệm và khả năng nhân rộng của sáng kiến (教学经验与推广价值)
     • 4. Kết luận và Khuyến nghị (结论与建议)
   - 📌TÀI LIỆU THAM KHẢO CHUẨN MỰC (参考文献)
   - 📌PHỤ LỤC SÁNG KIẾN KINH NGHIỆM (附录) (Viết Tiếng Trung Giản Thể)
`,
  sections: [
    {
      id: "1",
      level: 1,
      title: "THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM",
      suggestedContent: "[VIẾT BẰNG TIẾNG VIỆT] Trình bày đầy đủ thông tin hành chính: Tên sáng kiến, tác giả, chức vụ, đơn vị công tác, lĩnh vực nghiên cứu (Phương pháp dạy học môn Tiếng Trung THPT), đối tượng áp dụng và thời gian áp dụng sáng kiến kinh nghiệm."
    },
    {
      id: "2",
      level: 1,
      title: "中文摘要",
      suggestedContent: "[BẮT ĐẦU VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 中文摘要: 概括研究背景、研究目的、研究对象与范围、主要研究方法、核心教学对策（4-5项具体措施）以及教学实验前后的对比成效。要求语言精炼、学术规范、符合学术论文摘要格式。"
    },
    {
      id: "3",
      level: 1,
      title: "第一章 引言",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 第一章 引言: 提出问题、阐述选题背景与紧迫性、明确研究目的与具体任务、界定研究对象与范围、阐明综合研究方法、提炼本创新成果的学术价值与实践贡献。"
    },
    {
      id: "3.1",
      level: 2,
      title: "1. 选题理由与紧迫性",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 结合高中阶段汉语教学实际，阐述该教学课题的紧迫性与实践价值，剖析越南高中生在汉语学习过程中遇到的突出瓶颈与现实诉求。"
    },
    {
      id: "3.2",
      level: 2,
      title: "2. 研究目的与任务",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 明确提高高中汉语课堂教学质量与学生核心素养的目标；分解为理论梳理、偏误调查统计、对策构建与实验验证四项具体任务。"
    },
    {
      id: "3.3",
      level: 2,
      title: "3. 研究对象与范围",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 明确研究对象为高中生汉语习得过程与典型语言要素；限定范围为高中10-12年级课程教学内容与重点语言项目。"
    },
    {
      id: "3.4",
      level: 2,
      title: "4. 研究方法",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 综合运用问卷调查法(调查问卷)、数据统计分析法(数据统计)、汉越对比分析法(对比分析)、偏误分析法(偏误分析)与对照教学实验法(教学实验)。"
    },
    {
      id: "3.5",
      level: 2,
      title: "5. 创新点与科学贡献",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 突出创新突破点：构建多维偏误分类体系与针对越南学生的进阶式教学干预模式，克服母语负迁移障碍。"
    },
    {
      id: "4",
      level: 1,
      title: "第二章 理论依据",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 第二章 理论依据: 系统梳理现代汉语语言学理论、第二语言习得(SLA)理论、中介语与偏误分析学说，以及越南2018年普通教育汉语课程标准的法理依据。"
    },
    {
      id: "4.1",
      level: 2,
      title: "1. 核心理论基础",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 现代汉语词汇学与虚词理论、二语习得理论(SLA)、偏误分析理论(Error Analysis)、中介语理论(Interlanguage)以及母语负迁移(Negative Transfer)理论在高中汉语教学中的具体体现。"
    },
    {
      id: "4.2",
      level: 2,
      title: "2. 法规与课标依据",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 依据越南教育培训部第32/2018/TT-BGDĐT号通告颁布的《普通教育高中汉语课程标准》与越南外语能力六级架构（第三级/HSK3-4标准），阐述对高中生综合交际能力的要求。"
    },
    {
      id: "5",
      level: 1,
      title: "第三章 现状与偏误分析",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 第三章 现状与偏误分析: 考察所在高中汉语教学实况与学生学情困难；从语素(语素)、语义(语义)、语用及句法搭配(语用与句法搭配)、色彩风格(色彩风格)四个维度对典型偏误进行深度归类剖析；呈现真实偏误例句(*)与纠正句；提供前测基准量化统计表。"
    },
    {
      id: "6",
      level: 1,
      title: "第四章 教学对策与实施方案",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 第四章 教学对策与实施方案: 深入剖析学生偏误产生的四大深层原因；按逻辑层次详细阐述各项创新教学对策（每项均包含理论支撑、操作步骤、情境教学设计与例句分析）。"
    },
    {
      id: "6.1",
      level: 2,
      title: "1. 偏误深层原因剖析",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 剖析成因：母语负迁移的深层干扰、汉语虚词本体的抽象复杂性、学生机械背诵与逐字直译的不良习惯、现有教材针对性练习资源的相对匮乏。"
    },
    {
      id: "6.2",
      level: 2,
      title: "2. 对策一：语素分析与本体认知",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 实施语素分析法(语素分析法)：通过拆解同素词与异素词，强化学生对词汇本义的敏感度，辨识单双音节节奏搭配差异（结合丰富例句解析）。"
    },
    {
      id: "6.3",
      level: 2,
      title: "3. 对策二：词义辨析与思维导图可视化",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 实施三步词义辨析法(三步词义辨析法)：语境初探、义项对比、矩阵归纳；结合思维导图(思维导图)直观呈现词语在语义轻重、范围广狭及适用对象上的微妙分歧。"
    },
    {
      id: "6.4",
      level: 2,
      title: "4. 对策三：语用情境操练与分层练习",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 创设真实交际语境的分层训练体系：设计限制性语法条件填空、典型病句(*)找茬纠错、情境交际造句与段落写作等阶梯式任务。"
    },
    {
      id: "6.5",
      level: 2,
      title: "5. 对策四：情感色彩感知与AI辅助自学",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 强化褒贬与语体色彩感知，渗透交际文化内涵；借助智能AI工具、口语交互平台与Quizlet交互卡片，拓展课后自主学习时空。"
    },
    {
      id: "6.6",
      level: 2,
      title: "6. 对策五：便携手册编制与评价题库建设",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 编纂《高中常用重点近义词辨析便携自学手册》，建设契合高考与HSK3-4级能力矩阵的阶段性测评题库。"
    },
    {
      id: "7",
      level: 1,
      title: "第五章 教学效果与结论建议",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 第五章 教学效果与结论建议: 呈现教学实验对比数据、质性评价反馈、提炼实践经验并提出针对性工作建议。"
    },
    {
      id: "7.1",
      level: 2,
      title: "1. 教学实验量化成果数据表",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 实验班(TN)与对照班(ĐC)实施前后测试数据完整对比表格：成绩优秀/良好率显著提升、各维度偏误发生率显著下降（降幅达35%以上），提供具备科学信度的数据检验。"
    },
    {
      id: "7.2",
      level: 2,
      title: "2. 教学质量与能力质性评估",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 评估学生在学习心理、自信心、课堂参与度、口笔头自主纠错意识等方面的质性飞跃，以及在优秀生选拔与高考模拟中的良好表现。"
    },
    {
      id: "7.3",
      level: 2,
      title: "3. 教学经验与推广价值",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 总结高中汉语词汇教学与虚词教学的成功规律；提出在省内外同类高中推广应用的必备软硬件与教研保障条件。"
    },
    {
      id: "7.4",
      level: 2,
      title: "4. 结论与建议",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 概括本研究的核心成果与现实意义；分别对教育培训厅/局、学校行政管理部门、教研组及同行教师提出可操作的建议。"
    },
    {
      id: "8",
      level: 1,
      title: "参考文献",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ VÀ TIẾNG VIỆT] 参考文献: 严格按学术规范列出中越文核心参考文献（包含吕叔湘《现代汉语八百词》、张谊生《现代汉语副词研究》、杨寄洲《1700对近义词辨析》、越南2018年高中汉语课程标准文件等）。"
    },
    {
      id: "9",
      level: 1,
      title: "附录",
      suggestedContent: "[VIẾT BẰNG TIẾNG TRUNG GIẢN THỂ (简体中文)] 附录: 附录一 调查问卷样表；附录二 重点词语辨析对照表与实操案例；附录三 完整示范教案(教学设计)；附录四 教学实验前后测试卷。"
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
(Phần này viết bằng TIẾNG VIỆT)
1. Tên sáng kiến: Giải pháp khắc phục lỗi sai của học sinh Việt Nam khi sử dụng phó từ gần nghĩa trong tiếng Hán.
2. Lĩnh vực áp dụng: Dạy và học bộ môn tiếng Hán (Tiếng Trung Giản Thể cấp THPT).
3. Tác giả: Dương Thị Vinh - Thạc sỹ, Giáo viên trường THPT Chuyên Chu Văn An.
4. Đối tượng áp dụng: Học sinh THPT học tiếng Hán.
5. Căn cứ chuyên môn: Chương trình Giáo dục phổ thông môn Tiếng Trung Quốc ban hành theo Thông tư 32/2018/TT-BGDĐT.

📌TÓM TẮT SÁNG KIẾN (中文摘要)
(Bắt đầu từ mục này trở đi viết bằng TIẾNG TRUNG GIẢN THỂ 简体中文)
学生的词汇量往往能体现其语言表达能力。词汇的掌握包含同义词、近义词的掌握和使用。学生对近义词掌握程度标志着其语言水平的高低。近义词的语义、色彩意义、语用的特征复杂多样，成为学生在习得汉语时遇到的一大障碍。汉语虚词是在汉语作为第二语言教学过程中的一个重点和难点，尤其是在虚词中占很大部分的副词。通过对高中学校学生的写作作业、作文试卷和调查问卷进行考察、统计，发现学生在使用汉语副词过程中的偏误主要就是混用近义副词。本文在对所收集语料中近义副词的语音、语义、语用、色彩等进行考察分析的基础上，对汉语近义副词偏误进行了系统分析，分出偏误类型并寻找偏误产生的原因，进而提出针对越南高中生切实可行的教学对策和建议。

MỤC LỤC CHI TIẾT (目录)
📌THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM (Tiếng Việt)
📌TÓM TẮT SÁNG KIẾN (中文摘要) (简体中文)
📌CHƯƠNG I: MỞ ĐẦU (第一章 引言) (简体中文)
•1. Lý do chọn đề tài (选题理由与紧迫性)
•2. Mục đích và nhiệm vụ nghiên cứu (研究目的与任务)
•3. Đối tượng và phạm vi nghiên cứu (研究对象与范围)
•4. Phương pháp nghiên cứu (研究方法)
•5. Điểm mới và đóng góp khoa học của sáng kiến (创新点与科学贡献)
📌CHƯƠNG II: CƠ SỞ LÝ LUẬN (第二章 理论依据) (简体中文)
•1. Cơ sở lý thuyết về nội dung sáng kiến (核心理论)
•2. Cơ sở pháp lý và yêu cầu của Chương trình GDPT 2018 môn Tiếng Trung (法规与课标依据)
📌CHƯƠNG III: THỰC TRẠNG VẤN ĐỀ (第三章 现状与偏误分析) (简体中文)
📌CHƯƠNG IV: CÁC GIẢI PHÁP (第四章 教学对策与实施方案) (简体中文)
•1. Phân tích các vấn đề (偏误成因剖析)
•2. Giải pháp 1: Ứng dụng phương pháp phân tích ngữ tố (语素分析法)
•3. Giải pháp 2: Quy trình 3 bước phân biệt ngữ nghĩa kết hợp Sơ đồ tư duy (三步词义辨析法与思维导图)
•4. Giải pháp 3: Rèn luyện kỹ năng ngữ dụng qua bài tập phân hóa (分化情境操练与语用习得)
•5. Giải pháp 4: Giảng dạy sắc thái tình cảm gắn liền văn hóa và AI (情感色彩、交际文化与AI赋能)
•6. Giải pháp 5: Biên soạn Sổ tay tra cứu và ngân hàng đề kiểm tra (编制便携手册与专项题库)
📌CHƯƠNG V: HIỆU QUẢ CỦA SÁNG KIẾN VÀ KẾT LUẬN (第五章 教学效果与结论建议) (简体中文)
•1. Kết quả thực nghiệm sư phạm định lượng (教学实验量化成果数据表)
•2. Đánh giá định tính (质性评估)
•3. Bài học kinh nghiệm và khả năng nhân rộng của sáng kiến (教学经验与推广价值)
•4. Kết luận và Khuyến nghị (结论与建议)
📌TÀI LIỆU THAM KHẢO CHUẨN MỰC (参考文献)
📌PHỤ LỤC SÁNG KIẾN KINH NGHIỆM (附录) (简体中文)
`
};
