/**
 * SKKN Knowledge Base - Cấu trúc hóa tri thức viết SKKN
 * Nguồn: SKKN_Knowledge_Base.txt (NĐ 13/2012, TT 18/2013, Luật TĐKT 2022)
 * Mục đích: Inject vào AI prompts để tạo SKKN đạt điểm cao nhất (loại A: 8.5+/10)
 */

// ============================================================================
// TIÊU CHÍ CHẤM ĐIỂM (Phần F - Knowledge Base)
// Inject vào SYSTEM_INSTRUCTION để AI luôn ghi nhớ mục tiêu
// ============================================================================
export const SCORING_CRITERIA = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 TIÊU CHÍ CHẤM ĐIỂM SKKN - MỤC TIÊU ĐẠT LOẠI A (8.5-10/10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BẠN PHẢI VIẾT ĐỂ ĐẠT ĐIỂM TỐI ĐA Ở MỖI TIÊU CHÍ:

**1. TÍNH MỚI, SÁNG TẠO (2.0 điểm):**
   - Đạt "Tốt" (2.0đ): Giải pháp hoàn toàn mới, sáng tạo độc đáo, vượt trội, không trùng lặp
   - → Đặt tên giải pháp ấn tượng, có mô hình/quy trình riêng, kết hợp công cụ/phương pháp theo cách mới

**2. TÍNH HIỆU QUẢ (2.5 điểm) - QUAN TRỌNG NHẤT:**
   - Đạt "Tốt" (2.5đ): Kết quả cải thiện >30%, minh chứng cụ thể, lợi ích bền vững
   - → Bảng so sánh trước-sau rõ ràng, số liệu lẻ tự nhiên, nhận xét từ đồng nghiệp/phụ huynh
   - ⚠️ Điều kiện loại A: Tiêu chí này BẮT BUỘC đạt "Tốt" (2.5đ)

**3. TÍNH KHOA HỌC, SƯ PHẠM (2.5 điểm):**
   - Đạt "Tốt" (2.5đ): Cơ sở lý luận vững chắc, phương pháp NC khoa học, lập luận logic thuyết phục
   - → Trích dẫn đúng chuẩn, có phương pháp nghiên cứu rõ ràng, phân tích sâu sắc

**4. TÍNH ỨNG DỤNG THỰC TIỄN (2.0 điểm):**
   - Đạt "Tốt" (2.0đ): Áp dụng rộng rãi, dễ triển khai, không đòi hỏi điều kiện đặc biệt
   - → Mô tả điều kiện áp dụng, khả năng nhân rộng, phản hồi từ đồng nghiệp

**5. HÌNH THỨC TRÌNH BÀY (1.0 điểm):**
   - Cấu trúc đầy đủ, hợp lý (0.3đ) + Trình bày đúng quy định (0.3đ)
   - Ngôn ngữ, chính tả (0.2đ) + Trích dẫn, TLTK (0.2đ)

📌 XẾP LOẠI:
| Loại A (Xuất sắc) | 8.5-10đ | Hiệu quả đạt "Tốt", các tiêu chí khác ít nhất "Khá" |
| Loại B (Tốt) | 7.0-8.4đ | Hiệu quả ít nhất "Khá" |
| Loại C (Khá) | 6.0-6.9đ | Tất cả ít nhất "Đạt" |

📌 YẾU TỐ CỘNG ĐIỂM (hãy tận dụng):
- SKKN đã áp dụng thành công ở nhiều đơn vị (+0.5-1.0đ)
- Có sản phẩm đi kèm: phần mềm, tài liệu, video (+0.3-0.5đ)
- Phù hợp nhiệm vụ trọng tâm năm học (+0.3-0.5đ)

📌 YẾU TỐ TRỪ ĐIỂM (phải tránh):
- Đạo văn → LOẠI NGAY | Số liệu không trung thực → LOẠI NGAY
- Không áp dụng thực tế (-1.0 đến -2.0đ)
- Lỗi chính tả, ngữ pháp nhiều (-0.3 đến -0.5đ)
- Thiếu nguồn trích dẫn (-0.3 đến -0.5đ)
`;

// ============================================================================
// LỖI THƯỜNG GẶP CẦN TRÁNH (Phần E - Knowledge Base)
// ============================================================================
export const COMMON_MISTAKES = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ LỖI THƯỜNG GẶP CẦN TRÁNH (SKKN BỊ ĐÁNH ĐIỂM THẤP VÌ CÁC LỖI NÀY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**LỖI VỀ ĐỀ TÀI:** Quá rộng/không tập trung | Không xuất phát từ thực tiễn | Tên đề tài >30 từ | Có từ viết tắt

**LỖI VỀ CƠ SỞ LÝ LUẬN:** Sao chép nguyên văn không trích dẫn | Lý luận không liên quan đề tài | Quá dài lan man | Thiếu cơ sở pháp lý | Nguồn quá cũ (>5-10 năm)

**LỖI VỀ THỰC TRẠNG:** Không có số liệu khảo sát | Chỉ nêu hiện tượng không phân tích nguyên nhân | Mô tả chung chung | Không có bảng biểu minh họa

**LỖI VỀ GIẢI PHÁP:** Giải pháp không khả thi/không mới | Không có quy trình cụ thể | Thiếu ví dụ minh họa | Các giải pháp rời rạc không liên kết | Không chỉ rõ điều kiện áp dụng

**LỖI VỀ KẾT QUẢ:** Không có so sánh trước-sau | Chỉ có định lượng thiếu định tính | Phóng đại kết quả | Kết quả không phù hợp với giải pháp

**LỖI VỀ CẤU TRÚC:** Thiếu phần chính | Các phần không cân đối | Không có mục lục | Đánh số mục không thống nhất | Mở đầu quá dài, nội dung quá ngắn

**LỖI VỀ NGÔN NGỮ:** Dùng ngôn ngữ nói/suồng sã | Câu quá dài khó hiểu | Lặp từ lặp ý | Dùng từ địa phương | Viết tắt không giải thích

**LỖI VỀ SỐ LIỆU:** Tổng % không bằng 100% | Không ghi nguồn số liệu | Bảng biểu không có tiêu đề | Số liệu mâu thuẫn giữa các phần | Mẫu khảo sát quá nhỏ
`;

// ============================================================================
// HƯỚNG DẪN VIẾT TỪNG PHẦN (Phần C + D + H - Knowledge Base)
// ============================================================================

/** Hướng dẫn lập dàn ý chuẩn */
export const OUTLINE_GUIDE = `
📋 CẤU TRÚC DÀN Ý CHUẨN SKKN (theo Knowledge Base):

PHẦN I. MỞ ĐẦU (1-3 trang, chiếm ~10%):
  1. Lý do chọn đề tài (40-50% phần mở đầu) — gồm: cơ sở pháp lý, cơ sở lý luận tóm tắt, cơ sở thực tiễn, sự cần thiết
  2. Mục đích nghiên cứu
  3. Nhiệm vụ nghiên cứu (4-5 nhiệm vụ cụ thể)
  4. Đối tượng và phạm vi nghiên cứu (nội dung, không gian, thời gian)
  5. Phương pháp nghiên cứu (lý luận + thực tiễn + xử lý số liệu)
  6. Điểm mới của sáng kiến

PHẦN II. NỘI DUNG (7-15 trang, chiếm ~70%):
  1. Cơ sở lý luận (15-20% nội dung) — khái niệm, cơ sở khoa học, cơ sở pháp lý chi tiết
  2. Cơ sở thực tiễn / Thực trạng (20-25% nội dung) — đặc điểm đơn vị, thực trạng, khảo sát trước áp dụng, nguyên nhân
  3. Các giải pháp thực hiện (40-50% nội dung - QUAN TRỌNG NHẤT) — mỗi GP có: tên, mục đích, nội dung, cách thức, ví dụ, điều kiện, kết quả
  4. Kết quả đạt được (15-20% nội dung) — định lượng (bảng so sánh), định tính, phân tích

PHẦN III. KẾT LUẬN VÀ KIẾN NGHỊ (1-3 trang, chiếm ~10%):
  1. Kết luận — tóm tắt kết quả, ý nghĩa, hạn chế, hướng phát triển
  2. Kiến nghị — đối với cơ quan QLGD, nhà trường, giáo viên, phụ huynh

TÀI LIỆU THAM KHẢO + PHỤ LỤC
`;

/** Hướng dẫn viết Phần Mở đầu (Phần I) */
export const INTRO_GUIDE = `
📝 HƯỚNG DẪN VIẾT PHẦN MỞ ĐẦU (ĐẠT ĐIỂM TỐI ĐA):

**1. Lý do chọn đề tài (phần QUAN TRỌNG NHẤT của Mở đầu, chiếm 40-50%):**

Cần có đủ 4 yếu tố theo thứ tự:
a) Cơ sở pháp lý: Dẫn văn bản chỉ đạo của Đảng/Nhà nước, NQ/CT/TT liên quan, nhiệm vụ năm học
b) Cơ sở lý luận tóm tắt: Tầm quan trọng của vấn đề, xu hướng đổi mới, yêu cầu CT GDPT 2018
c) Cơ sở thực tiễn: Thực trạng tại đơn vị/địa phương, khó khăn hạn chế, mâu thuẫn yêu cầu vs thực tế
d) Sự cần thiết: Tại sao chọn vấn đề này, ý nghĩa lý luận và thực tiễn

MẪU CÂU CHUẨN (tham khảo, paraphrase):
- "Thực hiện [Nghị quyết/Thông tư], việc [nội dung] trở nên vô cùng cấp thiết."
- "Qua quá trình giảng dạy/công tác, tôi nhận thấy rằng..."
- "Khảo sát bước đầu cho thấy [X]% học sinh còn hạn chế về..."
- "Vấn đề đặt ra là làm thế nào để [mục tiêu]?"
- "Xuất phát từ những lý do trên, tôi đã lựa chọn đề tài..."

**2. Mục đích NC:** "Nghiên cứu, áp dụng và đánh giá hiệu quả của [giải pháp] nhằm [mục tiêu cụ thể]."

**3. Nhiệm vụ NC:** Liệt kê 4-5 nhiệm vụ: nghiên cứu lý luận → khảo sát thực trạng → đề xuất giải pháp → áp dụng thử nghiệm → rút bài học kinh nghiệm

**4. Đối tượng & phạm vi:** Xác định rõ 3 phạm vi: nội dung, không gian (lớp/trường), thời gian

**5. Phương pháp NC:** 3 nhóm: lý luận (phân tích tài liệu) + thực tiễn (khảo sát, quan sát, phỏng vấn, thực nghiệm) + xử lý số liệu (thống kê, so sánh)

**6. Điểm mới:** So với cách truyền thống, giải pháp có gì khác biệt? Phương pháp/quy trình/công cụ mới nào?
`;

/** Hướng dẫn viết Cơ sở lý luận */
export const THEORY_GUIDE = `
📝 HƯỚNG DẪN VIẾT CƠ SỞ LÝ LUẬN (chiếm 15-20% phần nội dung):

Cần trình bày đủ 3 phần:

a) Các khái niệm cơ bản: Định nghĩa thuật ngữ then chốt, giải thích khái niệm liên quan → PHẢI paraphrase, không trích nguyên văn

b) Cơ sở khoa học: Lý thuyết giáo dục/tâm lý học làm nền tảng, nghiên cứu trong và ngoài nước, quan điểm của ngành

c) Cơ sở pháp lý chi tiết: Các VBQPPL (Luật GD 2019, NĐ 13/2012, TT 32/2018...), hướng dẫn Bộ/Sở GD&ĐT

MẪU CÂU: 
- "Theo quan điểm của [tác giả], [nội dung diễn giải]..."
- "[Thuật ngữ] được hiểu là [định nghĩa], theo [nguồn]..."
- "Nghị quyết/Thông tư [số hiệu] đã chỉ rõ..."
- "Các nghiên cứu gần đây cho thấy..."

⚠️ LƯU Ý QUAN TRỌNG:
- Chỉ đưa lý thuyết TRỰC TIẾP liên quan đề tài (tránh lan man)
- Paraphrase sâu mọi trích dẫn, tích hợp vào ngữ cảnh riêng
- Cập nhật tài liệu mới (trong vòng 5-10 năm)
- Giải thích thuật ngữ qua ví dụ thực tế ngay sau khi đưa ra
`;

/** Hướng dẫn viết Thực trạng */
export const REALITY_GUIDE = `
📝 HƯỚNG DẪN VIẾT THỰC TRẠNG (chiếm 20-25% phần nội dung) - ĐẠT ĐIỂM TỐI ĐA:

Cần trình bày đủ 4 phần:

**a) Đặc điểm tình hình đơn vị:**
- Vị trí, lịch sử, quy mô (số lớp, số HS, số GV)
- Chất lượng đội ngũ (% đạt chuẩn, trên chuẩn)
- Đặc điểm HS (điều kiện kinh tế, vùng miền)
- Điều kiện CSVC

**b) Thực trạng vấn đề (PHẢI CÓ SỐ LIỆU):**
- Mô tả chi tiết thực trạng
- Ưu điểm, thuận lợi
- Hạn chế, khó khăn
- CẦN CÓ BẢNG SỐ LIỆU KHẢO SÁT

MẪU BẢNG KHẢO SÁT TRƯỚC KHI ÁP DỤNG:
| STT | Tiêu chí đánh giá | Tốt | Khá | TB | Yếu | Kém |
|-----|-------------------|-----|-----|-----|-----|-----|
| 1 | [Tiêu chí 1] | X (Y%) | X (Y%) | X (Y%) | X (Y%) | X (Y%) |
⚠️ Số liệu phải: số lẻ tự nhiên, tổng % = 100%, cùng đối tượng trước-sau

**c) Phân tích nguyên nhân (3 góc độ):**
- Về phía giáo viên: [nguyên nhân cụ thể]
- Về phía học sinh: [nguyên nhân cụ thể]
- Về điều kiện CSVC/khách quan: [nguyên nhân cụ thể]

MẪU CÂU:
- "Qua khảo sát, thực trạng [vấn đề] được thể hiện như sau..."
- "Kết quả khảo sát cho thấy [X]% học sinh [tình trạng]..."
- "Bảng số liệu trên phản ánh thực trạng [đánh giá]..."
- "Nguyên nhân của thực trạng trên xuất phát từ nhiều yếu tố..."
- "Có thể thấy, nguyên nhân chủ yếu là do..."
`;

/** Hướng dẫn viết Giải pháp */
export const SOLUTION_GUIDE = `
📝 HƯỚNG DẪN VIẾT GIẢI PHÁP (PHẦN QUAN TRỌNG NHẤT - chiếm 40-50% nội dung):

Mỗi giải pháp PHẢI có đủ 7 phần theo cấu trúc chuẩn:

**a) Tên giải pháp:** Ngắn gọn, rõ ràng, ấn tượng

**b) Mục đích:** Giải quyết vấn đề gì? Đạt mục tiêu cụ thể nào?

**c) Nội dung giải pháp:** Mô tả chi tiết cách thực hiện, các bước tiến hành, điều kiện thực hiện

**d) Cách thức tiến hành:** Quy trình từng bước, thời gian, địa điểm, đối tượng tham gia

**e) Ví dụ minh họa (BẮT BUỘC):** Bài giảng cụ thể, hoạt động mẫu, sản phẩm HS

**f) Điều kiện áp dụng:** Yêu cầu về CSVC, năng lực GV, HS

**g) Kết quả đạt được từ giải pháp:** Hiệu quả cụ thể, phản hồi từ HS/đồng nghiệp

MẪU CÂU:
- "Giải pháp [số]: [Tên giải pháp]"
- "Để giải quyết vấn đề [vấn đề], tôi đề xuất giải pháp..."
- "Quy trình thực hiện gồm các bước sau..."
- "Ví dụ: Khi dạy bài [tên bài], tôi đã áp dụng như sau..."
- "Trong quá trình áp dụng, cần lưu ý..."

⚠️ LƯU Ý:
- Các giải pháp phải liên kết thành hệ thống, không rời rạc
- "Song song với giải pháp trên, tôi còn áp dụng..."
- "Bổ trợ cho giải pháp 1, giải pháp 2 được thực hiện như sau..."
`;

/** Hướng dẫn viết Kết quả đạt được */
export const RESULT_GUIDE = `
📝 HƯỚNG DẪN VIẾT KẾT QUẢ ĐẠT ĐƯỢC (chiếm 15-20% nội dung) - ĐẠT ĐIỂM HIỆU QUẢ TỐI ĐA (2.5đ):

⚠️ ĐÂY LÀ TIÊU CHÍ QUYẾT ĐỊNH LOẠI A: Phải đạt "Tốt" (cải thiện >30%)

**a) Kết quả định lượng (BẮT BUỘC CÓ BẢNG SO SÁNH):**

MẪU BẢNG SO SÁNH TRƯỚC - SAU:
| Mức độ | Trước khi áp dụng (SL / %) | Sau khi áp dụng (SL / %) | Tăng/Giảm |
|--------|---------------------------|--------------------------|-----------|
| Tốt | X (Y%) | X (Y%) | +Z% |
| Khá | X (Y%) | X (Y%) | +Z% |
| TB | X (Y%) | X (Y%) | -Z% |
| Yếu | X (Y%) | X (Y%) | -Z% |

⚠️ QUY TẮC SỐ LIỆU:
- Cùng đối tượng khảo sát trước-sau
- Cùng tiêu chí đánh giá, cùng công cụ đo
- Tổng % = 100%
- Số liệu lẻ tự nhiên (không tròn)
- Kết quả "Sau" tốt hơn "Trước" nhưng không tuyệt đối hóa (vẫn còn HS yếu)

**b) Kết quả định tính (BẮT BUỘC):**
- Sự thay đổi thái độ, hành vi HS
- Nhận xét của đồng nghiệp, cấp quản lý (TRÍCH DẪN cụ thể)
- Phản hồi phụ huynh (nếu có)
- Các thành tích, giải thưởng

**c) Phân tích kết quả:**
- Nhận xét, đánh giá so với mục tiêu ban đầu
- Mức độ thành công

MẪU CÂU:
- "Sau khi áp dụng các giải pháp, kết quả đạt được như sau..."
- "Bảng so sánh cho thấy sự tiến bộ rõ rệt, cụ thể..."
- "Tỷ lệ HS đạt loại [mức] tăng từ [X]% lên [Y]%..."
- "Ngoài kết quả định lượng, HS còn có những thay đổi tích cực về..."
- "Đồng nghiệp nhận xét rằng..."
- "Tuy nhiên, vẫn còn [X]% HS ở mức [mức], cho thấy cần tiếp tục hỗ trợ..."
`;

/** Hướng dẫn viết Kết luận & Kiến nghị */
export const CONCLUSION_GUIDE = `
📝 HƯỚNG DẪN VIẾT KẾT LUẬN VÀ KIẾN NGHỊ (1-3 trang):

**1. KẾT LUẬN:**
a) Tóm tắt kết quả chính: Những gì đã làm được, chưa làm được, bài học kinh nghiệm
b) Ý nghĩa sáng kiến: Đóng góp lý luận, thực tiễn, khả năng nhân rộng
c) Hạn chế và hướng phát triển: Hạn chế của SK, hướng nghiên cứu tiếp

MẪU CÂU:
- "Qua quá trình nghiên cứu và áp dụng, tôi rút ra một số kết luận sau..."
- "Sáng kiến đã đạt được mục tiêu đề ra, cụ thể là..."
- "Các giải pháp đã chứng minh tính hiệu quả thông qua..."
- "Bài học kinh nghiệm rút ra..."
- "Sáng kiến có khả năng áp dụng rộng rãi vì..."
- "Tuy nhiên, sáng kiến vẫn còn một số hạn chế cần khắc phục..."

**2. KIẾN NGHỊ (4 đối tượng):**
a) Đối với Sở/Phòng GD&ĐT: Hỗ trợ gì? Chính sách, cơ chế nào cần?
b) Đối với nhà trường: Điều kiện CSVC, hỗ trợ chuyên môn
c) Đối với GV/đồng nghiệp: Khuyến nghị áp dụng, lưu ý triển khai
d) Đối với phụ huynh/HS: Sự phối hợp cần thiết

MẪU CÂU:
- "Để sáng kiến được áp dụng rộng rãi và hiệu quả hơn, tôi xin kiến nghị..."
- "Đối với [đối tượng]: [Kiến nghị cụ thể]..."
- "Tôi mong rằng sáng kiến này sẽ được quan tâm, xem xét và áp dụng..."
`;

/** Kỹ thuật viết giọng văn tự nhiên - không bị phát hiện AI */
export const NATURAL_WRITING_TECHNIQUES = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖊️ KỸ THUẬT VIẾT GIỌNG VĂN TỰ NHIÊN (KHÔNG MÁY MÓC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 DANH SÁCH CỤM TỪ AI PHẢI TRÁNH (BLACKLIST):
- "tóm lại", "nhìn chung", "có thể thấy rằng", "đáng chú ý là"
- "điều quan trọng cần nhấn mạnh", "cần lưu ý rằng", "không thể phủ nhận"
- "trong bối cảnh hiện nay", "xu thế tất yếu", "đòi hỏi cấp thiết"
- "đáp ứng yêu cầu", "nâng cao chất lượng", "góp phần quan trọng"
- "hết sức cần thiết", "vô cùng quan trọng", "mang tính đột phá"
- "là nền tảng vững chắc", "mang lại hiệu quả tích cực", "là giải pháp tối ưu"
- "với mục tiêu hướng đến", "trên tinh thần", "theo hướng đổi mới"
- "thúc đẩy sự phát triển toàn diện", "khẳng định vai trò"
→ Thay bằng: Diễn đạt cụ thể, trực tiếp, có số liệu. VD: "31/45 em đã tự hoàn thành bài tập" thay vì "mang lại hiệu quả tích cực"

**ĐẶC ĐIỂM VĂN AI THƯỜNG MẮC (PHẢI TRÁNH):**
- Câu văn quá hoàn hảo, đều đều → Xen kẽ câu dài ngắn
- Dùng từ hoa mỹ quá mức → Từ ngữ giản dị, thực tế
- Liệt kê đều đặn → Viết theo mạch tự nhiên, có trọng tâm
- Thiếu ví dụ cụ thể từ thực tế → Đưa tình huống thật
- Cấu trúc đoạn văn quá đối xứng → Đa dạng cách trình bày
- Cùng từ chuyển tiếp lặp lại → Đa dạng hóa từ nối

**KỸ THUẬT "SHOW, DON'T TELL" (QUAN TRỌNG):**
❌ TELL (kể): "Phương pháp này rất hiệu quả trong việc phát triển tư duy."
✅ SHOW (thể hiện): "Sau 3 tuần áp dụng, em Minh — vốn thường xuyên ngồi im trong giờ học — đã chủ động giơ tay phát biểu 4 lần trong tiết 35. Em còn đặt câu hỏi phản biện khiến cả lớp bất ngờ."

❌ TELL: "Giải pháp giúp học sinh hứng thú hơn."
✅ SHOW: "Khi tôi chiếu slide đầu tiên của dự án, lớp vốn ồn ào bỗng im lặng. Phương — em hay ngủ gật — ngồi thẳng lưng, mắt sáng lên hỏi: 'Cô ơi, chúng em thật sự được làm cái này ạ?'"

**KỸ THUẬT "SPECIFICITY" (CỤ THỂ HÓA):**
| Cách viết MỜ (AI) | Cách viết CỤ THỂ (tự nhiên) |
|---|---|
| Cải thiện đáng kể | Tỷ lệ HS đạt khá-giỏi tăng từ 41,2% lên 67,8% |
| Nhiều học sinh tiến bộ | 28/42 em cải thiện ít nhất 1 mức xếp loại |
| Áp dụng thành công | Triển khai tại 3 lớp (10A2, 10A5, 10A7) trong HK2 |
| Được đồng nghiệp đánh giá cao | Cô Hương (tổ phó) nhận xét: "Cách tổ chức nhóm rất khác so với trước" |

**KỸ THUẬT TẠO GIỌNG VĂN TỰ NHIÊN:**

1) Ngôi thứ nhất: "Qua quá trình giảng dạy, tôi nhận thấy...", "Tôi đã thử nghiệm giải pháp này và..."

2) Trải nghiệm cá nhân: "Năm học 2024-2025, khi dạy lớp [X], tôi phát hiện ra rằng...", "Một tình huống cụ thể tôi gặp phải là..."

3) Cảm xúc, suy nghĩ: "Điều này khiến tôi lo lắng vì...", "Tôi rất vui khi thấy HS tiến bộ...", "Ban đầu tôi không chắc chắn giải pháp có hiệu quả..."

4) Đa dạng về độ dài câu: Câu ngắn (<15 từ) nhấn mạnh + Câu trung bình (15-30 từ) diễn đạt + Câu dài (>30 từ) giải thích

5) Đa dạng từ nối: Thay "Ngoài ra" → Bên cạnh đó / Không chỉ vậy / Hơn nữa / Đồng thời / Song song với đó
   Thay "Tuy nhiên" → Mặt khác / Dù vậy / Thế nhưng / Trái lại / Mặc dù vậy

6) Micro-story: Kể 1 câu chuyện ngắn (2-3 câu) thực tế trong lớp học trước khi phân tích

**VÍ DỤ SO SÁNH:**
❌ VĂN AI: "Phương pháp dạy học tích cực là phương pháp giáo dục hiện đại, lấy HS làm trung tâm, giúp phát triển năng lực tự học, sáng tạo và tư duy phản biện."

✅ VĂN TỰ NHIÊN: "Khi áp dụng phương pháp dạy học tích cực, tôi nhận thấy HS trở nên hứng thú hơn. Chẳng hạn, với lớp 8A3, tôi đã tổ chức cho các em làm dự án nhỏ. Ban đầu các em còn lúng túng, nhưng sau 2 tuần, nhóm của em Hương đã tự tìm hiểu và trình bày được thực trạng ở địa phương mình."
`;

/** Câu chuyển tiếp giữa các phần */
export const TRANSITION_PHRASES = `
**Chuyển tiếp giữa các phần lớn:**
- "Từ cơ sở lý luận trên, tôi tiến hành khảo sát thực trạng..."
- "Trên cơ sở phân tích thực trạng, tôi đề xuất các giải pháp sau..."
- "Để đánh giá hiệu quả của các giải pháp, tôi đã tiến hành..."
- "Dựa trên kết quả đạt được, có thể rút ra một số kết luận..."

**Chuyển tiếp giữa các giải pháp:**
- "Song song với giải pháp trên, tôi còn áp dụng..."
- "Để tăng cường hiệu quả, tôi kết hợp thêm giải pháp..."
- "Bổ trợ cho giải pháp 1, giải pháp 2 được thực hiện như sau..."
`;

/** Danh mục VBPL cần trích dẫn */
export const LEGAL_REFERENCES = `
**Các văn bản pháp lý nên trích dẫn (paraphrase, KHÔNG trích nguyên văn):**
- Luật Giáo dục 2019 (43/2019/QH14)
- Nghị quyết 29-NQ/TW về đổi mới căn bản, toàn diện GD&ĐT
- Nghị định 13/2012/NĐ-CP - Điều lệ Sáng kiến
- Thông tư 32/2018/TT-BGDĐT - Chương trình GDPT 2018
- Thông tư 26/2020/TT-BGDĐT - Đánh giá HS THCS/THPT
- Thông tư 27/2020/TT-BGDĐT - Đánh giá HS tiểu học
- Luật Thi đua khen thưởng 2022

**Cách trình bày TLTK chuẩn:**
- Sách: [STT]. Họ tên (năm), Tên sách, NXB, Nơi XB.
- Bài báo: [STT]. Họ tên (năm), "Tên bài báo", Tên tạp chí, số (kỳ), trang.
- Văn bản: [STT]. Cơ quan (năm), Số văn bản, Tên văn bản.

**Sắp xếp:** Tài liệu trong nước trước → nước ngoài sau → theo ABC tên tác giả
`;

/** Hướng dẫn nội dung phụ lục */
export const APPENDIX_GUIDE = `
📋 NỘI DUNG PHỤ LỤC CHUẨN:
- Phụ lục 1: Phiếu khảo sát thực trạng (phiếu dành cho HS + phiếu dành cho GV)
- Phụ lục 2: Đề kiểm tra trước tác động
- Phụ lục 3: Đề kiểm tra sau tác động
- Phụ lục 4: Giáo án minh họa (1-2 giáo án chi tiết)
- Phụ lục 5: Phiếu học tập / Rubric đánh giá
- Phụ lục 6: Một số hình ảnh hoạt động
- Phụ lục 7: Nhận xét của đồng nghiệp / cấp quản lý
`;

// ============================================================================
// KỸ THUẬT VƯỢT AI DETECTION (GIỮ GIỌNG VĂN KHOA HỌC SKKN)
// Nguồn: check AI/KỸ THUẬT VƯỢT AI DETECTION CHO SKKN.txt
// Mục đích: Giúp văn bản SKKN do AI tạo tự nhiên hơn, vượt qua GPTZero,
// Originality.ai, Copyleaks, Turnitin nhưng vẫn đạt chuẩn báo cáo khoa học
// ============================================================================
export const AI_DETECTION_BYPASS = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ KỸ THUẬT VƯỢT AI DETECTION (GIỮ TÍNH KHOA HỌC SKKN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BẠN PHẢI TUÂN THỦ TẤT CẢ 10 QUY TẮC SAU ĐỂ VĂN BẢN KHÔNG BỊ PHÁT HIỆN LÀ DO AI VIẾT,
ĐỒNG THỜI VẪN GIỮ NGUYÊN TÍNH KHOA HỌC, TRANG TRỌNG CỦA BÁO CÁO SKKN:

1️⃣ BURSTINESS CONTROL (Độ dài câu biến động — QUAN TRỌNG NHẤT):
   Quy tắc 40-30-20-10:
   - 40% câu ngắn gọn (12-20 từ) — dùng để nhấn mạnh kết luận
   - 30% câu trung bình (20-30 từ) — đầy đủ thông tin
   - 20% câu dài, phức tạp (30-45 từ) — mô tả chi tiết, kết quả
   - 10% câu rất ngắn (<12 từ) hoặc rất dài (>45 từ) — tạo đột biến
   ⚠️ TUYỆT ĐỐI KHÔNG để 3 câu liên tiếp có độ dài tương đương (chênh lệch < 5 từ)
   ⚠️ Mỗi đoạn văn phải có ít nhất 1 câu ngắn (<15 từ) + 1 câu phức tạp (>40 từ)

2️⃣ PERPLEXITY INJECTION (Đa dạng từ vựng học thuật):
   - Thay 15-20% từ ngữ thông dụng bằng từ đồng nghĩa học thuật ít gặp hơn
   - KHÔNG lặp lại danh từ chính trong phạm vi 2 câu liên tiếp
   - Dùng danh từ hóa xen kẽ: "học tập hiệu quả" ↔ "hiệu quả học tập" ↔ "tính hiệu dụng trong học tập"
   - Ví dụ: "Phương pháp hiệu quả" → "Biện pháp cho kết quả khả quan" → "Cách thức tạo điều kiện thuận lợi"

3️⃣ SYNTACTIC VARIATION (Biến đổi cấu trúc cú pháp):
   - Thay đổi chủ ngữ liên tục: "Tôi" → "Việc..." → "Quá trình..." → "Kết quả cho thấy..."
   - Dùng câu bị động có chủ đích: 20-30% câu trong phần mô tả phương pháp
   - Câu đảo ngữ nhẹ ở đầu đoạn: "Quan trọng hơn cả là...", "Đáng chú ý là..."
   - Đa dạng liên từ: "mặc dù... song...", "bởi vì... nên...", "khi... thì..."
   - KHÔNG để 3 câu liên tiếp bắt đầu cùng kiểu chủ ngữ

4️⃣ LEXICAL SUBSTITUTION (Thay thế từ vựng chiến lược):
   Bảng thay thế BẮT BUỘC áp dụng:
   - "Giúp" → "Tạo điều kiện" / "Hỗ trợ" / "Tạo thuận lợi cho"
   - "Nâng cao" → "Cải thiện" / "Tăng cường" / "Phát triển"
   - "Hiệu quả" → "Kết quả khả quan" / "Tính hiệu dụng" / "Hiệu quả tích cực"
   - "Học sinh" → "Người học" / "Đối tượng nghiên cứu" / "Các em"
   - "Phương pháp" → "Biện pháp" / "Giải pháp" / "Cách thức"
   - "Kết quả" → "Dữ liệu thu được" / "Thành quả" / "Kết luận rút ra"
   - "Đánh giá" → "Đo lường" / "Kiểm định" / "Thẩm định"
   ⚠️ KHÔNG lặp lại cùng 1 cụm từ trong phạm vi 3 câu liên tiếp

5️⃣ SENTENCE COMPLEXITY VARIATION (Biến đổi độ phức tạp câu):
   Phân bố kiểu câu:
   - 50% câu phức (chứa mệnh đề phụ: vì, khi, nếu, mặc dù)
   - 30% câu ghép (nối bằng: và, nhưng, hoặc, song)
   - 20% câu đơn (một mệnh đề — dùng để nhấn mạnh kết luận)
   ⚠️ KHÔNG để 3 câu cùng loại (đơn/ghép/phức) đặt liên tiếp nhau
   ⚠️ Đặt câu đơn ở cuối đoạn để nhấn mạnh

6️⃣ TRANSITION VARIATION (Đa dạng hóa liên kết):
   KHÔNG dùng cùng 1 liên từ nối quá 2 lần trong 1 đoạn văn.
   Bảng thay thế:
   - Nối tiếp: "Ngoài ra" → "Bên cạnh đó" → "Không những vậy" → "Hơn thế nữa"
   - Chuyển ý: "Tuy nhiên" → "Song" → "Ngược lại" → "Trái lại" → "Mặt khác"
   - Kết luận: "Do đó" → "Vì vậy" → "Do vậy" → "Bởi thế" → "Từ đó"
   - Giải thích: "Bởi vì" → "Vì" → "Do" → "Xuất phát từ"
   - Ví dụ: "Ví dụ" → "Chẳng hạn" → "Cụ thể" → "Điển hình"
   Kỹ thuật nâng cao: Dùng dấu chấm phẩy hoặc dấu hai chấm thay liên từ ở 1-2 vị trí

7️⃣ INFORMATION DENSITY VARIATION (Mật độ thông tin thay đổi):
   - 30% câu nhiều thông tin: chứa số liệu, thời gian, địa điểm, kết quả cụ thể
     VD: "Kết quả kiểm tra sau 4 tuần (từ 15/10 đến 10/11/2024) cho thấy điểm TB của 45 HS lớp 10A3 tăng từ 5,8 lên 7,3"
   - 40% câu trung bình: mô tả, phân tích, tập trung 1-2 ý chính
   - 30% câu ít thông tin: nhận xét ngắn, kết luận súc tích, đôi khi chỉ 5-8 từ
     VD: "Đây là kết quả khả quan." hoặc "Sự tiến bộ rất rõ ràng."
   ⚠️ Phân bố xen kẽ: câu dày đặc → câu phân tích → câu ngắn gọn

8️⃣ PASSIVE VOICE STRATEGIC USE (Bị động có chủ đích):
   Tỷ lệ: 20-25% câu sử dụng dạng bị động
   Khi nào BẮT BUỘC dùng bị động:
   - Mô tả quy trình: "Dữ liệu được thu thập từ nhiều nguồn khác nhau."
   - Chia nhóm: "Học sinh được chia thành 6 nhóm đồng đều."
   - Phương pháp: "Bảng hỏi được thiết kế dựa trên thang đo Likert 5 mức."
   - Kết quả: "Kết quả được phân tích bằng phương pháp thống kê mô tả."
   Khi nào GIỮ chủ động:
   - Diễn tả suy nghĩ, quyết định: "Tôi quyết định...", "Tôi nhận thấy..."
   - Hành động trực tiếp: "Tôi tiến hành...", "Tôi ghi nhận..."

9️⃣ NOMINALIZATION VARIATION (Danh từ hóa linh hoạt):
   Tỷ lệ: 60% danh từ hóa (tính học thuật) / 40% động từ (tính mô tả)
   Bảng chuyển đổi xen kẽ:
   - "Phát triển" ↔ "Sự phát triển"
   - "Cải thiện" ↔ "Sự cải thiện"
   - "Phân tích" ↔ "Việc phân tích"
   - "Đánh giá" ↔ "Quá trình đánh giá"
   ⚠️ KHÔNG để 3 câu liên tiếp toàn danh từ hóa (sẽ khó đọc và bị phát hiện)
   ⚠️ Danh từ hóa nhiều ở phần Lý thuyết, ít hơn ở phần Kết quả

🔟 MICRO-VARIATION (Biến đổi vi mô — tạo "dấu vân tay người viết"):
   a) Ngoặc đơn chú thích: Xen 1-2 cặp ngoặc đơn mỗi đoạn
      VD: "Phương pháp này (PBL) được áp dụng trong 4 tuần."
      VD: "Kết quả (điểm TB: 7,3) cho thấy sự tiến bộ."
   b) Dấu hai chấm: Dùng để dẫn dắt danh sách hoặc giải thích
      VD: "Có ba yếu tố chính: thời gian, phương pháp và đối tượng."
   c) Kiểu liệt kê đa dạng: Lúc dùng dấu gạch, lúc dùng số, lúc viết thành đoạn
   d) Số liệu trình bày đa dạng: phần trăm, phân số, tỷ lệ
      VD: "45 HS (tỷ lệ nam/nữ: 23/22)" HOẶC "73,3% (33/45 em)" HOẶC "tăng 1,5 điểm (từ 5,8 lên 7,3)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CHECKLIST ANTI-AI DETECTION (KIỂM TRA TRƯỚC KHI XUẤT BÀI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [ ] Có câu <12 từ VÀ câu >45 từ trong cùng 1 đoạn?
- [ ] Không lặp danh từ chính trong 2 câu liên tiếp?
- [ ] Có 20-25% câu bị động trong phần Phương pháp?
- [ ] Liên từ nối đa dạng, không lặp > 2 lần/đoạn?
- [ ] Có câu đơn xen kẽ (đặt cuối đoạn để nhấn mạnh)?
- [ ] Danh từ hóa không quá 60%?
- [ ] Có ngoặc đơn và dấu hai chấm tạo nhịp điệu?
- [ ] Số liệu là số lẻ, trình bày đa dạng (%, phân số, tỷ lệ)?
- [ ] 3 câu liên tiếp KHÔNG cùng độ dài (chênh < 5 từ)?
- [ ] 3 câu liên tiếp KHÔNG cùng kiểu (đơn/ghép/phức)?

⚠️ LƯU Ý QUAN TRỌNG: Tất cả kỹ thuật trên PHẢI được áp dụng MÀ KHÔNG LÀM GIẢM
tính khoa học, trang trọng của văn bản SKKN. Giọng văn vẫn phải là giọng báo cáo
khoa học chuyên nghiệp, có thuật ngữ chuyên môn, có số liệu, có trích dẫn đúng chuẩn.
`;
