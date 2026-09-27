/**
 * Curriculum Validator Service - Kiểm tra nội dung SKKN theo GDPT 2018
 * Đảm bảo nội dung phù hợp với cấp lớp, môn học
 */

import curriculumDB from '../data/curriculum-database.json';

interface ValidationResult {
  isValid: boolean;
  grade: string;
  subject: string;
  issues: string[];
  suggestions: string[];
}

class CurriculumValidator {
  private db: typeof curriculumDB;

  constructor() {
    this.db = curriculumDB;
  }

  /**
   * Ánh xạ tên môn học từ các dạng khác nhau sang key trong DB
   */
  private mapSubjectName(subject: string): string {
    const mapping: { [key: string]: string } = {
      'toán': 'toan',
      'toan': 'toan',
      'math': 'toan',
      'ngữ văn': 'nguVan',
      'ngu van': 'nguVan',
      'tiếng việt': 'nguVan',
      'vietnamese': 'nguVan',
      'tiếng anh': 'tiengAnh',
      'tieng anh': 'tiengAnh',
      'english': 'tiengAnh',
      'địa lí': 'diaLi',
      'địa lý': 'diaLi',
      'dia li': 'diaLi',
      'geography': 'diaLi',
      'lịch sử': 'lichSu',
      'lich su': 'lichSu',
      'history': 'lichSu',
      'lịch sử và địa lí': 'lichSu',
      'khoa học tự nhiên': 'khoanHocTuNhien',
      'khtn': 'khoanHocTuNhien',
      'vật lí': 'khoanHocTuNhien',
      'vật lý': 'khoanHocTuNhien',
      'vat li': 'khoanHocTuNhien',
      'hoá học': 'khoanHocTuNhien',
      'hoa hoc': 'khoanHocTuNhien',
      'sinh học': 'khoanHocTuNhien',
      'sinh hoc': 'khoanHocTuNhien',
      'giáo dục công dân': 'giaoDucCongDan',
      'gdcd': 'giaoDucCongDan',
      'civics': 'giaoDucCongDan',
      'tiếng trung': 'tiengTrung',
      'tieng trung': 'tiengTrung',
      'tiếng trung quốc': 'tiengTrung',
      'tieng trung quoc': 'tiengTrung',
      'tiếng hán': 'tiengTrung',
      'tieng han': 'tiengTrung',
      'tiếng trung (tiếng hán giản thể)': 'tiengTrung',
      'tieng trung (tieng han gian the)': 'tiengTrung',
      'chinese': 'tiengTrung',
    };

    const key = subject.toLowerCase().trim();
    return mapping[key] || key;
  }

  /**
   * Lấy danh sách keywords cấm cho một lớp, môn
   */
  private getForbiddenKeywords(subject: string, grade: string): string[] {
    const subjectKey = this.mapSubjectName(subject);
    const subjectData = (this.db.subjects as any)[subjectKey];

    if (!subjectData || !subjectData.grades[grade]) {
      return [];
    }

    return subjectData.grades[grade].forbiddenKeywords || [];
  }

  /**
   * Lấy danh sách topics hợp lệ cho lớp, môn
   */
  private getValidTopics(subject: string, grade: string): string[] {
    const subjectKey = this.mapSubjectName(subject);
    const subjectData = (this.db.subjects as any)[subjectKey];

    if (!subjectData || !subjectData.grades[grade]) {
      return [];
    }

    return subjectData.grades[grade].topics || [];
  }

  /**
   * Tìm forbidden keywords trong nội dung
   */
  private findForbiddenContent(content: string, forbiddenKeywords: string[]): string[] {
    const found: string[] = [];
    const lowerContent = content.toLowerCase();

    forbiddenKeywords.forEach((keyword) => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        found.push(keyword);
      }
    });

    return found;
  }

  /**
   * Lấy thông tin cấp học
   */
  getGradeInfo(grade: string | number) {
    const gradeNum = parseInt(grade.toString());

    if (gradeNum >= 1 && gradeNum <= 5) {
      return { stage: 'Tiểu học', level: 'elementary' };
    } else if (gradeNum >= 6 && gradeNum <= 9) {
      return { stage: 'THCS', level: 'secondary' };
    } else if (gradeNum >= 10 && gradeNum <= 12) {
      return { stage: 'THPT', level: 'highSchool' };
    }
    return { stage: 'Unknown', level: 'unknown' };
  }

  /**
   * Tạo đoạn prompt ràng buộc phạm vi kiến thức để chèn vào prompt Gemini
   */
  generateCurriculumPrompt(subject: string, grade: string): string {
    const validTopics = this.getValidTopics(subject, grade);
    const forbiddenKeywords = this.getForbiddenKeywords(subject, grade);
    const gradeInfo = this.getGradeInfo(grade);

    if (validTopics.length === 0 && forbiddenKeywords.length === 0) {
      return '';
    }

    let prompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÀNG BUỘC PHẠM VI KIẾN THỨC (GDPT 2018) - BẮT BUỘC TUÂN THỦ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Đề tài này thuộc môn ${subject}, lớp ${grade} (${gradeInfo.stage}).
`;

    if (validTopics.length > 0) {
      prompt += `
PHẠM VI KIẾN THỨC ĐƯỢC PHÉP (lớp ${grade}):
${validTopics.map(t => `  - ${t}`).join('\n')}
`;
    }

    if (forbiddenKeywords.length > 0) {
      prompt += `
TUYỆT ĐỐI KHÔNG ĐƯỢC CHỨA:
${forbiddenKeywords.map(k => `  - "${k}" ← VƯỢT CẤP, CẤM SỬ DỤNG`).join('\n')}

⚠️ NẾU BẤT KỲ NỘI DUNG NÀO TRONG DÀN Ý HOẶC NỘI DUNG SKKN CHỨA CÁC TỪ KHÓA TRÊN → BẠN ĐANG VIẾT SAI CẤP LỚP.
Hãy thay thế bằng kiến thức phù hợp lớp ${grade}.
`;
    }

    return prompt;
  }

  /**
   * Validate dàn ý/nội dung SKKN sau khi Gemini sinh
   */
  validateOutline(subject: string, grade: string, outline: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      grade,
      subject,
      issues: [],
      suggestions: [],
    };

    const subjectKey = this.mapSubjectName(subject);
    const subjectData = (this.db.subjects as any)[subjectKey];

    if (!subjectData || !subjectData.grades[grade]) {
      return result;
    }

    const forbiddenKeywords = this.getForbiddenKeywords(subject, grade);
    const foundForbidden = this.findForbiddenContent(outline, forbiddenKeywords);

    if (foundForbidden.length > 0) {
      result.isValid = false;
      result.issues.push(
        `Nội dung chứa kiến thức VƯỢT CẤP (không thuộc lớp ${grade}): ${foundForbidden.join(', ')}`
      );
      result.suggestions.push(
        `Các từ khóa trên thuộc chương trình lớp cao hơn. Hãy thay thế bằng nội dung phù hợp lớp ${grade}.`
      );
    }

    return result;
  }
}

export const curriculumValidator = new CurriculumValidator();
export default CurriculumValidator;
