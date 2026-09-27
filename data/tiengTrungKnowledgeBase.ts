/**
 * TÀI LIỆU VÀ CƠ SỞ TRI THỨC CHUYÊN SÂU MÔN TIẾNG TRUNG (TIẾNG HÁN GIẢN THỂ) CẤP THPT
 * Dành cho ứng dụng tạo Sáng kiến kinh nghiệm (SKKN) chuẩn Bộ GD&ĐT
 * Trích xuất từ thực nghiệm giảng dạy THPT và công trình nghiên cứu SKKN:
 * "Giải pháp khắc phục lỗi sai của học sinh Việt Nam khi sử dụng phó từ gần nghĩa trong tiếng Hán"
 */

export interface ChineseAdverbPair {
  pair: [string, string];
  category: '语素方面 (Ngữ tố)' | '词义方面 (Ý nghĩa)' | '语用方面 (Ngữ dụng)' | '色彩方面 (Sắc thái)';
  subCategory: string;
  vietnameseMeaning: string;
  keyDifference: string;
  incorrectExample: string;
  correctExample: string;
  ruleExplanation: string;
}

/**
 * Danh mục 25 cặp phó từ gần nghĩa điển hình thường gặp lỗi sai ở học sinh THPT
 */
export const CHINESE_ADVERB_PAIRS: ChineseAdverbPair[] = [
  // --- 1. NHÓM LỖI VỀ NGỮ TỐ (语素方面) ---
  {
    pair: ['白', '白白'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp đơn - song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'uổng công, vô ích, lãng phí / được không',
    keyDifference: '"白" có thể tu sức động từ đơn âm tiết đứng một mình (白学), có nghĩa là nhận được lợi ích không tốn tiền ("白吃白喝"). "白白" là dạng trùng điệp mang ngữ khí nặng hơn, chỉ sự uổng công phí sức, sau đó thường là động từ song âm tiết hoặc có bổ ngữ (白白等了两个小时).',
    incorrectExample: '* 他说一个很简单的汉语句子，我学了一年还听不懂，白白学了。',
    correctExample: '他说一个很简单的汉语句子，我学了一年还听不懂，白学了。/ 他早上不来，我白白等了两个小时。',
    ruleExplanation: 'Động từ đơn âm tiết đứng cuối câu không có bổ ngữ chỉ dùng "白", không dùng "白白".'
  },
  {
    pair: ['更', '更加'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp đơn - song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'càng, thêm nữa (mức độ so sánh tăng tiến)',
    keyDifference: '"更" dùng được cả khẩu ngữ và thư diện ngữ, tu sức được cả tính từ/động từ đơn âm tiết và song âm tiết. "更加" thiên về văn viết trang trọng, ngữ khí nặng hơn, KHÔNG tu sức tính từ đơn âm tiết đứng một mình (không nói *更加好, *更加美, phải nói 更加漂亮, 更加努力).',
    incorrectExample: '* 这儿的风景冬天更加美。',
    correctExample: '这儿的风景冬天更美。/ 这儿的风景冬天更加美丽。',
    ruleExplanation: 'Tính từ đơn âm tiết (美, 好, 快) chỉ kết hợp với "更", không kết hợp với "更加".'
  },
  {
    pair: ['相', '互相'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp đơn - song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'lẫn nhau, cùng nhau',
    keyDifference: '"互相" biểu thị hành động qua lại hai chiều giữa các bên, không đi trực tiếp trước động từ đơn âm tiết. "相" là phó từ thư diện ngữ, thường đi trước động từ đơn âm tiết tạo thành cụm 4 chữ (相爱, 相见, 好言相劝) và có thể biểu thị hành vi một chiều hướng về đối phương.',
    incorrectExample: '* 我们好言互相劝，他改变了主意。',
    correctExample: '我们好言相劝，他改变了主意。/ 我们互相帮助。',
    ruleExplanation: 'Trong kết cấu cố định hoặc trước động từ đơn âm tiết chỉ dùng "相", không dùng "互相".'
  },
  {
    pair: ['处处', '到处'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'nơi nơi, khắp nơi, mọi mặt',
    keyDifference: '"到处" nhấn mạnh vào không gian địa điểm cụ thể (nơi chốn thực tế). "处处" có thể chỉ nơi chốn nhưng phạm vi rộng và trừu tượng hơn, đặc biệt dùng khi chỉ các phương diện, khía cạnh, hành vi trừu tượng (mọi mặt không trừ trường hợp nào).',
    incorrectExample: '* 他到处严格教育孩子。',
    correctExample: '他处处严格教育孩子。/ 公园里到处都是鲜花。',
    ruleExplanation: 'Khi nói về các khía cạnh đạo đức, học tập, hành vi trừu tượng bắt buộc dùng "处处".'
  },
  {
    pair: ['从不', '从没'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'từ trước tới nay không / chưa từng',
    keyDifference: '"从不" nhấn mạnh thói quen, ý chí chủ quan từ quá khứ đến hiện tại không muốn làm hoặc không làm việc gì. "从没" nhấn mạnh vào sự thật khách quan là chưa từng có trải nghiệm làm việc đó, thường kết hợp với trợ từ động thái "过".',
    incorrectExample: '* 来越南以前他从不学过越南语。/ * 我相信他人，他从没做这样的事。',
    correctExample: '来越南以前他从没学过越南语。/ 我相信他人，他从不做这样的事。',
    ruleExplanation: 'Có trợ từ "过" biểu thị kinh nghiệm phải dùng "从没"; biểu thị nguyên tắc thói quen dùng "从不".'
  },
  {
    pair: ['决不', '决无'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'tuyệt đối không / quyết không có',
    keyDifference: '"决不" làm trạng ngữ tu sức cho động từ hoặc tính từ, biểu thị ý chí kiên quyết không làm. "决无" làm vị ngữ trong câu, biểu thị sự khẳng định chắc chắn hoàn toàn không có sự vật/kết quả nào đó.',
    incorrectExample: '* 你做坏事决不好结果。',
    correctExample: '你做坏事决无好结果。/ 遇到困难我决不放弃。',
    ruleExplanation: '"决无" mang chức năng vị ngữ (hoàn toàn không có), không thay thế bừa bãi bằng "决不".'
  },
  {
    pair: ['按时', '按期'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'đúng giờ / đúng hạn, đúng kỳ hạn',
    keyDifference: '"按时" nhấn mạnh vào thời điểm cụ thể (giờ, phút: uống thuốc đúng giờ, đến lớp đúng giờ). "按期" nhấn mạnh vào khoảng thời gian, hạn định ngày tháng năm (giao hàng đúng kỳ hạn, hoàn thành dự án đúng hạn).',
    incorrectExample: '* 我会按期吃药，你放心。/ * 这批货要按时给客户发出。',
    correctExample: '我会按时吃药，你放心。/ 这批货要按期给客户发出。',
    ruleExplanation: 'Hành động sinh hoạt theo mốc giờ dùng "按时", hợp đồng công việc có kỳ hạn dùng "按期".'
  },
  {
    pair: ['逐步', '逐渐'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'từng bước / dần dần',
    keyDifference: '"逐步" nhấn mạnh vào có kế hoạch, có giai đoạn, từng bước từng bước một (mang tính nhân vi, có chủ đích), KHÔNG tu sức tính từ. "逐渐" nhấn mạnh vào tiến trình biến đổi tự nhiên, chậm rãi, tu sức được cả động từ và tính từ (天逐渐黑了).',
    incorrectExample: '* 国家要有人才就要逐渐推进教育改革。/ * 冬天日子短，五点钟天就逐步黑了。',
    correctExample: '国家要有人才就要逐步推进教育改革。/ 冬天日子短，五点钟天就逐渐黑了。',
    ruleExplanation: 'Tính từ chỉ biến đổi tự nhiên chỉ đi với "逐渐"; kế hoạch cải cách từng bước dùng "逐步".'
  },
  {
    pair: ['决不', '绝不'],
    category: '语素方面 (Ngữ tố)',
    subCategory: 'Cặp song âm tiết có chung ngữ tố',
    vietnameseMeaning: 'nhất quyết không / tuyệt đối không',
    keyDifference: '"决不" thiên về sắc thái chủ quan, thể hiện quyết tâm và nỗ lực của bản thân trong tương lai. "绝不" nhấn mạnh tính tuyệt đối khách quan loại trừ mọi ngoại lệ, thường dùng cho hiện thực khách quan.',
    incorrectExample: '* 教育孩子决不会只是学校的责任。/ * 为了取得这比赛的冠军，遇到什么困难我绝不放手。',
    correctExample: '教育孩子绝不会只是学校的责任。/ 为了取得这比赛的冠军，遇到什么困难我决不放手。',
    ruleExplanation: 'Phủ định khách quan hiển nhiên dùng "绝不"; thể hiện ý chí quyết tâm cá nhân dùng "决不".'
  },

  // --- 2. NHÓM LỖI VỀ Ý NGHĨA TỪ (词义方面) ---
  {
    pair: ['竭力', '极力'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Mức độ nông sâu / nặng nhẹ khác nhau',
    vietnameseMeaning: 'hết sức, dốc toàn lực / ra sức',
    keyDifference: '"竭力" (kiệt lực) có mức độ sâu hơn nhiều, nghĩa là dùng cạn kiệt toàn bộ sức lực của bản thân. "极力" nghĩa là ra sức, bỏ nhiều công sức tìm cách làm việc gì đó.',
    incorrectExample: '* 她极力控制自己，不想为一句话使夫妻吵架。',
    correctExample: '她竭力控制自己，不想为一句话使夫妻吵架。/ 老百姓极力克服地震后果。',
    ruleExplanation: 'Cố gắng kìm nén cảm xúc cá nhân bằng toàn bộ ý chí dùng "竭力".'
  },
  {
    pair: ['非常', '十分'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Mức độ nông sâu / nặng nhẹ khác nhau',
    vietnameseMeaning: 'vô cùng, rất / mười phần, rất',
    keyDifference: '"非常" có mức độ cao hơn "十分", có thể đi với cảm thán từ biểu thị ngạc nhiên (哇、真). Ngoài ra "非常" có thể làm định ngữ (非常时期) và có thể lặp lại (非常非常), "十分" không có các chức năng này và trước "十分" có thể thêm phủ định "不十分" (không mấy).',
    incorrectExample: '* 哇，今年选美大赛的冠军十分漂亮！/ * 在这个十分时期，还是不出门安全。',
    correctExample: '哇，今年选美大赛的冠军非常漂亮！/ 在这个非常时期，还是不出门安全。',
    ruleExplanation: 'Thán từ cảm thán mạnh và làm định ngữ danh từ chỉ dùng "非常".'
  },
  {
    pair: ['立刻', '马上'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Phạm vi thời gian và mức độ dồn dập',
    vietnameseMeaning: 'ngay lập tức / liền, sắp',
    keyDifference: '"立刻" chỉ khoảng thời gian cực ngắn, dồn dập ngay tức khắc, chỉ dùng cho quá khứ hoặc hiện tại. "马上" có độ co giãn thời gian lớn hơn và có thể dùng cho tương lai gần (vừa qua tết Dương lịch là sắp đến tết Âm lịch: 马上就春节了).',
    incorrectExample: '* 小狗看见主人马上跑了过去。/ * 元旦刚过，立刻就春节了。',
    correctExample: '小狗看见主人立刻跑了过去。/ 元旦刚过，马上就春节了。',
    ruleExplanation: 'Hành động phản xạ tức thì dùng "立刻"; sự việc sắp xảy ra trong tương lai gần dùng "马上".'
  },
  {
    pair: ['不时', '时时'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Tần suất và khoảng cách thời gian',
    vietnameseMeaning: 'thỉnh thoảng, chốc chốc / luôn luôn, mọi lúc',
    keyDifference: '"时时" mang nghĩa mọi lúc, luôn luôn (tần suất liên tục dày đặc: lúc nào cũng phải cẩn thận). "不时" mang nghĩa chốc chốc, thỉnh thoảng, ngắt quãng (tiếng động thỉnh thoảng vọng lại).',
    incorrectExample: '* 你必须不时小心，小孩一个人在路上很危险。/ * 身后时时传来的沙沙声让人害怕。',
    correctExample: '你必须时时小心，小孩一个人在路上很危险。/ 身后不时传来的沙沙声让人害怕。',
    ruleExplanation: 'Nhắc nhở luôn luôn cảnh giác dùng "时时"; âm thanh ngắt quãng dùng "不时".'
  },
  {
    pair: ['忽然', '突然'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Từ tính và mức độ đột ngột',
    vietnameseMeaning: 'bỗng nhiên, đột nhiên',
    keyDifference: '"忽然" thuần túy là phó từ, chỉ làm trạng ngữ tu sức động từ. "突然" là hình dung từ (tính từ), có thể làm trạng ngữ, vị ngữ, định ngữ, bổ ngữ (病得太突然了) và nhận phó từ mức độ tu sức (很突然). Mức độ của "突然" mãnh liệt và bất ngờ hơn "忽然".',
    incorrectExample: '* 奶奶这次病得太忽然了。',
    correctExample: '奶奶这次病得太突然了。/ 他的病症在这个时候突然恶化了。',
    ruleExplanation: 'Đứng sau trợ từ "得" làm bổ ngữ bắt buộc dùng tính từ "突然", cấm dùng "忽然".'
  },
  {
    pair: ['将', '即将'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Phạm vi thời gian xa gần',
    vietnameseMeaning: 'sẽ, sắp',
    keyDifference: '"即将" chỉ dùng cho tương lai rất gần và KHÔNG kết hợp trực tiếp với từ chỉ mốc thời gian cụ thể (không nói *即将于十月二十号). "将" có phạm vi rộng hơn (tương lai gần và xa), kết hợp được mốc ngày tháng cụ thể (将于十月二十号) và có nghĩa phán đoán "chắc chắn sẽ".',
    incorrectExample: '* 我们学校的足球比赛即将于十月二十号举行。',
    correctExample: '我们学校的足球比赛将于十月二十号举行。/ 人们的生活水平将大大提高。',
    ruleExplanation: 'Đi cùng mốc thời gian ngày tháng cụ thể (于...举行) chỉ dùng "将".'
  },
  {
    pair: ['曾经', '已经'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Phạm vi thời gian và tính tiếp diễn',
    vietnameseMeaning: 'từng, đã từng / đã',
    keyDifference: '"曾经" biểu thị hành động đã diễn ra trong quá khứ và HIỆN TẠI ĐÃ KẾT THÚC (thường xa hiện tại). "已经" biểu thị hành động bắt đầu từ quá khứ nhưng kết quả hoặc trạng thái VẪN KÉO DÀI ĐẾN HIỆN TẠI hoặc việc vừa mới hoàn thành.',
    incorrectExample: '* 我和玛丽曾经五年没有见面了。/ * 他现在曾经是一位医生了。',
    correctExample: '我和玛丽已经五年没有见面了。/ 他现在已经是一位医生了。/ 这部电影我曾经看过好几次。',
    ruleExplanation: 'Khoảng thời gian kéo dài đến hiện tại (năm năm nay) bắt buộc dùng "已经".'
  },
  {
    pair: ['常常', '往往'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Trọng tâm khách quan vs quy luật tổng kết',
    vietnameseMeaning: 'thường, hay / thường thường (theo quy luật)',
    keyDifference: '"常常" trần thuật khách quan hành động xảy ra nhiều lần trong thời gian ngắn, dùng được cho việc sắp tới và có dạng phủ định "不常". "往往" tổng kết quy luật kinh nghiệm trong quá khứ dưới điều kiện nhất định, dùng được với khoảng thời gian dài có tính quy luật (ba tháng về nhà một lần), không có dạng *不往往.',
    incorrectExample: '* 这里不往往下雪。/ * 我常常三个月回一次家。',
    correctExample: '这里不常下雪。/ 我往往三个月回一次家。/ 我会常常来看你。',
    ruleExplanation: 'Phủ định dùng "不常"; quy luật định kỳ chu kỳ dài dùng "往往"; lời hứa tương lai dùng "常常".'
  },
  {
    pair: ['向来', '一直'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Độ dài thời gian và kết hợp bổ ngữ',
    vietnameseMeaning: 'từ trước tới nay / liên tục, suốt',
    keyDifference: '"向来" biểu thị thói quen bản chất từ xưa đến nay không đổi, không đi cùng bổ ngữ thời lượng ngắn (không nói *向来哭了一天一夜). "一直" biểu thị hành động diễn ra liên tục không gián đoạn trong một khoảng thời gian, đi được với bổ ngữ số lượng/thời lượng (哭了一天一夜, 说了两个小时).',
    incorrectExample: '* 因为老公突然去世，她向来哭了一天一夜。',
    correctExample: '因为老公突然去世，她一直哭了一天一夜。/ 我这几天一直还没见到他。',
    ruleExplanation: 'Có bổ ngữ thời lượng (một ngày một đêm) bắt buộc dùng "一直".'
  },
  {
    pair: ['尤其', '特别'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Liên từ tăng tiến và cấu trúc chữ 的',
    vietnameseMeaning: 'đặc biệt, nhất là',
    keyDifference: '"尤其" chỉ là phó từ, thường đứng ở phân câu sau với liên từ tăng tiến (不但...尤其/特别), không đi với trợ từ 的, không lặp lại. "特别" vừa là phó từ vừa là tính từ, có thể lặp lại (特别特别), đi được cấu trúc chữ 的 (有什么特别的), có thể đứng đầu câu.',
    incorrectExample: '* 我尤其尤其喜欢汉语。/ * 没发现他有什么尤其的。',
    correctExample: '我特别特别喜欢汉语。/ 没发现他有什么特别的。/ 不仅要教他们会读，尤其要教他们做人。',
    ruleExplanation: 'Cấu trúc lặp lại và kết cấu "đặc biệt 的" bắt buộc dùng "特别".'
  },
  {
    pair: ['无法', '无力'],
    category: '词义方面 (Ý nghĩa)',
    subCategory: 'Không có cách vs không có sức lực',
    vietnameseMeaning: 'không thể, không có cách nào / bất lực, không đủ sức',
    keyDifference: '"无法" nghĩa là không có phương pháp, biện pháp để giải quyết (thường chỉ sự việc khách quan). "无力" nghĩa là không đủ năng lực, thể lực hoặc sức lực (thể chất mệt mỏi, tài chính eo hẹp).',
    incorrectExample: '* 我发烧了，感到全身无法做什么。',
    correctExample: '我发烧了，感到全身无力做什么。/ 这个问题复杂，目前无法解决。',
    ruleExplanation: 'Chỉ tình trạng sức khỏe thể lực kiệt sức dùng "无力".'
  },

  // --- 3. NHÓM LỖI VỀ NGỮ DỤNG & CÚ PHÁP (语用方面) ---
  {
    pair: ['顶', '最'],
    category: '语用方面 (Ngữ dụng)',
    subCategory: 'Phong cách và thói quen kết hợp',
    vietnameseMeaning: 'nhất (mức độ cao nhất)',
    keyDifference: '"顶" là từ khẩu ngữ đậm nét phương ngữ miền Bắc Trung Quốc, thường chỉ dùng trong giao tiếp thường nhật. "最" dùng được ở cả văn viết chính luận, quy định pháp luật và khẩu ngữ. Trước danh từ chỉ dùng "最+đơn âm tính từ+danh từ" (最高价格, 最好结果, không nói *顶高价格).',
    incorrectExample: '* 这才是顶高价格，不能再高了。/ * 产假时间顶少是98天。',
    correctExample: '这才是最高价格，不能再高了。/ 产假时间最少是98天。',
    ruleExplanation: 'Trong văn bản quy định, luật pháp hoặc tu sức trực tiếp danh từ bắt buộc dùng "最".'
  },
  {
    pair: ['时时', '时刻'],
    category: '语用方面 (Ngữ dụng)',
    subCategory: 'Từ tính phó từ vs danh từ',
    vietnameseMeaning: 'mọi lúc / thời khắc, khoảnh khắc',
    keyDifference: '"时时" chỉ là phó từ làm trạng ngữ. "时刻" vừa là phó từ vừa là danh từ, có thể làm định ngữ và làm trung tâm ngữ trong cụm "幸福的时刻" (khoảnh khắc hạnh phúc).',
    incorrectExample: '* 见到儿子的时候，是我最开心幸福的时时。',
    correctExample: '见到儿子的时候，是我最开心幸福的时刻。',
    ruleExplanation: 'Làm danh từ trung tâm ngữ (khoảnh khắc) bắt buộc dùng "时刻".'
  },
  {
    pair: ['仍然', '仍旧'],
    category: '语用方面 (Ngữ dụng)',
    subCategory: 'Khả năng đảm nhiệm vị ngữ',
    vietnameseMeaning: 'vẫn, vẫn như cũ',
    keyDifference: '"仍然" chỉ là phó từ, chỉ đứng trước động từ/tính từ làm trạng ngữ. "仍旧" ngoài làm phó từ còn có thể làm động từ đóng vai trò vị ngữ đứng cuối câu (情况仍旧).',
    incorrectExample: '* 过了几年，这里的情况仍然。',
    correctExample: '过了几年，这里的情况仍旧。/ 过了几年，这里的情况仍然没有变化。',
    ruleExplanation: 'Đứng cuối câu làm vị ngữ bắt buộc dùng "仍旧".'
  },

  // --- 4. NHÓM LỖI VỀ SẮC THÁI BIỂU CẢM & PHONG CÁCH (色彩方面) ---
  {
    pair: ['恐怕', '也许'],
    category: '色彩方面 (Sắc thái)',
    subCategory: 'Sắc thái tình cảm lo lắng vs trung tính',
    vietnameseMeaning: 'e rằng, sợ rằng / có lẽ, có thể',
    keyDifference: '"也许" là phó từ trung tính, ước đoán khả năng không mang màu sắc khen chê. "恐怕" mang sắc thái tình cảm lo âu, ái ngại, dự đoán tình huống tiêu cực hoặc không mong muốn xảy ra.',
    incorrectExample: '* 看你脸色那么差，也许血压变低了，我带你去医院。',
    correctExample: '看你脸色那么差，恐怕血压变低了，我带你去医院。',
    ruleExplanation: 'Dự đoán việc xấu, thể hiện sự lo lắng cho đối phương phải dùng "恐怕".'
  },
  {
    pair: ['皆', '都'],
    category: '色彩方面 (Sắc thái)',
    subCategory: 'Sắc thái phong cách khẩu ngữ vs thư diện ngữ',
    vietnameseMeaning: 'đều, tất cả',
    keyDifference: '"皆" là phó từ cổ văn, thư diện ngữ trang trọng cao, thường đi trước động từ/tính từ đơn âm tiết hoặc trong thành ngữ (尽人皆知, 皆大欢喜). "都" là từ thông dụng toàn dân cả khẩu ngữ và văn viết.',
    incorrectExample: '* 这次考试我们皆及格了。',
    correctExample: '这次考试我们都及格了。/ 人所共知，尽人皆知。',
    ruleExplanation: 'Giao tiếp thường nhật sinh hoạt dùng "都", không dùng "皆".'
  }
];

/**
 * Ma trận thống kê khảo sát lỗi sai của học sinh THPT trước thực nghiệm
 */
export const ADVERB_ERROR_STATISTICS_SAMPLE = `
| STT | Phương diện lỗi sai (偏误类型) | Số lượt lỗi (N=120 HS) | Tỷ lệ (%) | Nguyên nhân chủ yếu |
|:---:|:---|:---:|:---:|:---|
| 1 | Lỗi về Ngữ tố (语素偏误) | 168 | 41,2% | Giao thoa tiếng mẹ đẻ (tiếng Việt dịch cùng 1 từ), không bóc tách ngữ tố chung - riêng |
| 2 | Lỗi về Ngữ nghĩa (词义偏误) | 114 | 27,9% | Dùng từ không tính mức độ nông sâu, nhầm lẫn phạm vi thời gian tiếp diễn và kinh nghiệm |
| 3 | Lỗi về Ngữ dụng & Cú pháp (语用偏误) | 86 | 21,1% | Không nắm vững quy tắc kết hợp cú pháp, nhầm lẫn từ tính (phó từ vs hình dung từ/danh từ) |
| 4 | Lỗi về Sắc thái & Phong cách (色彩偏误) | 40 | 9,8% | Trộn lẫn khẩu ngữ với thư diện ngữ, bỏ qua sắc thái khen/chê, lo âu/trung tính |
| **Tổng** | **Tổng số lỗi khảo sát trước tác động** | **408** | **100%** | **Cần can thiệp bằng hệ sinh thái giải pháp đồng bộ** |
`;

/**
 * Bảng số liệu đối chứng Thực nghiệm (TN) vs Đối chứng (ĐC) sau tác động
 */
export const EXPERIMENTAL_RESULTS_TABLE_SAMPLE = `
| Nhóm lớp | Sĩ số | Giỏi (8.0-10đ) | Khá (6.5-7.9đ) | Trung bình (5.0-6.4đ) | Yếu (<5.0đ) | Điểm TB |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Lớp ĐC (Trước TN)** | 42 | 5 em (11,9%) | 14 em (33,3%) | 18 em (42,9%) | 5 em (11,9%) | 6,18 |
| **Lớp TN (Trước TN)** | 43 | 6 em (14,0%) | 13 em (30,2%) | 19 em (44,2%) | 5 em (11,6%) | 6,24 |
| **Lớp ĐC (Sau TN)** | 42 | 7 em (16,7%) | 16 em (38,1%) | 16 em (38,1%) | 3 em (7,1%) | 6,55 (+0,37) |
| **Lớp TN (Sau TN)** | 43 | **18 em (41,9%)** | **19 em (44,2%)** | **6 em (14,0%)** | **0 em (0%)** | **7,82 (+1,58)** |
`;

// Tích hợp gói tài liệu tham khảo chính thức chuẩn Bộ GD&ĐT & MALL 2008
export * from './officialTiengTrungDocuments';

