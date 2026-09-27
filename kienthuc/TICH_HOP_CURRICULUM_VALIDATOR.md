# Tich hop Curriculum Validator vao App SKKN

## Phien lam viec: 2026-04-08

---

## 1. Van de phat hien

**Trieu chung:** Khi nguoi dung nhap de tai "Toan lop 9", dan y va noi dung SKKN do Gemini sinh ra lai chua kien thuc **nguyen ham, tich phan** (thuoc chuong trinh lop 12).

**Nguyen nhan goc:**
- Thu muc `KIEN THUC CAC MON/` da co san `curriculum-database.json` (database GDPT 2018) va `curriculum-validator.ts` (class kiem tra vuot cap).
- Tuy nhien, **KHONG co file nao trong app chinh** (`App.tsx`, `services/`, `constants.ts`) import hay su dung chung.
- Prompt gui cho Gemini chi ghi `Mon hoc: Toan`, `Khoi lop: 9` dang text thuan — **khong co rang buoc gi** ve pham vi kien thuc.
- Gemini tu do sinh noi dung, de nham sang tich phan, dao ham (lop 11-12).

---

## 2. Giai phap da trien khai (Giai phap A - Tich hop day du)

### Co che hoat dong 2 lop bao ve:

```
Nguoi dung nhap: "Toan lop 9"
        |
        v
[LOP 1: PROMPT INJECTION]
App tu dong chen vao prompt gui Gemini:
  - Danh sach topics HOP LE (Can thuc bac hai, PT bac 2, He PT...)
  - Danh sach keywords CAM (nguyen ham, tich phan, dao ham, logarit...)
  - Quy tac nghiem ngat: KHONG duoc dung kien thuc vuot cap
        |
        v
Gemini sinh dan y (da bi rang buoc boi prompt)
        |
        v
[LOP 2: POST-VALIDATION]
App quet lai dan y vua sinh:
  - Tim forbidden keywords trong van ban
  - Neu phat hien → hien thi CANH BAO DO cho user
  - User co the chinh sua lai truoc khi tiep tuc
```

---

## 3. Cac file da thay doi

### 3.1. File MOI: `services/curriculumValidator.ts`

**Muc dich:** Service wrapper cho CurriculumValidator, import tu `data/curriculum-database.json`.

**Cac method chinh:**

| Method | Muc dich |
|--------|----------|
| `generateCurriculumPrompt(subject, grade)` | Tao doan prompt rang buoc pham vi kien thuc de chen vao prompt Gemini |
| `validateOutline(subject, grade, outline)` | Kiem tra noi dung co chua keyword vuot cap khong |
| `getForbiddenKeywords(subject, grade)` | Lay danh sach keyword cam cho lop/mon |
| `getValidTopics(subject, grade)` | Lay danh sach topics hop le cho lop/mon |
| `getGradeInfo(grade)` | Tra ve thong tin cap hoc (THCS/THPT) |

**Vi du su dung:**

```typescript
import { curriculumValidator } from './services/curriculumValidator';

// Tao prompt rang buoc
const prompt = curriculumValidator.generateCurriculumPrompt('Toan', '9');
// → Tra ve doan text dai chua topics cho phep + keywords cam

// Kiem tra dan y
const result = curriculumValidator.validateOutline('Toan', '9', 'Ung dung nguyen ham...');
// → { isValid: false, issues: ['Noi dung chua kien thuc VUOT CAP: nguyen ham'], ... }
```

**Anh xa mon hoc (mapSubjectName):**

| Input nguoi dung | Key trong DB |
|-----------------|-------------|
| "Toan", "Math" | `toan` |
| "Ngu van", "Tieng Viet" | `nguVan` |
| "Tieng Anh", "English" | `tiengAnh` |
| "Dia li", "Dia ly" | `diaLi` |
| "Lich su" | `lichSu` |
| "Vat li", "Hoa hoc", "Sinh hoc", "KHTN" | `khoaHocTuNhien` |
| "Giao duc cong dan" | `giaoDucCongDan` |

---

### 3.2. File COPY: `data/curriculum-database.json`

- Copy tu `KIEN THUC CAC MON/curriculum-database.json`
- Ly do: Thu muc `KIEN THUC CAC MON` co dau cach trong ten, Vite/Rollup khong resolve duoc khi build production
- Noi dung giong 100% file goc

---

### 3.3. File SUA: `App.tsx`

**Thay doi 1: Them import** (dong 6)
```typescript
import { curriculumValidator } from './services/curriculumValidator';
```

**Thay doi 2: Chen curriculum prompt vao `startGeneration()`**

Vi tri: Ngay truoc phan "THONG TIN DE TAI" trong `initMessage`.

```typescript
${(() => {
  // Tich hop rang buoc pham vi kien thuc theo GDPT 2018
  const gradeMatch = userInfo.grade.match(/\d+/);
  const gradeNum = gradeMatch ? gradeMatch[0] : '';
  if (gradeNum && !isHigherEd) {
    return curriculumValidator.generateCurriculumPrompt(userInfo.subject, gradeNum);
  }
  return '';
})()}
```

Logic:
- Trích so lop tu `userInfo.grade` (co the la "Lop 9", "9", "Khoi 9")
- Chi ap dung cho cap pho thong (khong ap dung cho Cao dang/Dai hoc)
- Goi `generateCurriculumPrompt()` de tao doan prompt rang buoc
- Neu mon hoc khong co trong DB (VD: "Cong doan", "Quan ly") → tra ve chuoi rong, khong anh huong

**Thay doi 3: Post-validation sau khi Gemini tra dan y**

Vi tri: Ngay sau khi streaming hoan tat, truoc `setState({ isStreaming: false })`.

```typescript
// Post-validation: Kiem tra dan y co chua noi dung vuot cap khong
const gradeMatch = userInfo.grade.match(/\d+/);
const gradeNum = gradeMatch ? gradeMatch[0] : '';
if (gradeNum && !isHigherEd) {
  const validation = curriculumValidator.validateOutline(
    userInfo.subject, gradeNum, generatedText
  );
  if (!validation.isValid) {
    const warningText = `\n\n---\n⚠️ **CANH BAO KIEM TRA TU DONG:** ${validation.issues.join('. ')}.\n${validation.suggestions.join(' ')}\n\nVui long kiem tra lai dan y va chinh sua neu can.`;
    generatedText += warningText;
    setState(prev => ({ ...prev, fullDocument: generatedText }));
  }
}
```

---

### 3.4. File SUA: `constants.ts`

**Thay doi:** Them PHAN 1B trong `SYSTEM_INSTRUCTION` (ngay truoc PHAN 2).

```
## PHAN 1B: TUAN THU PHAM VI KIEN THUC THEO CAP LOP (BAT BUOC)
- Noi dung SKKN PHAI phu hop chinh xac voi cap lop va mon hoc ma nguoi dung chi dinh.
- TUYET DOI KHONG su dung kien thuc vuot cap.
- Cac vi du, bai tap minh hoa phai nam trong pham vi chuong trinh GDPT 2018 cua lop do.
- Neu prompt co muc "RANG BUOC PHAM VI KIEN THUC" → PHAI tuan thu nghiem ngat.
```

---

## 4. Vi du minh hoa: Toan lop 9

### Prompt gui cho Gemini (phan curriculum - tu dong chen):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RANG BUOC PHAM VI KIEN THUC (GDPT 2018) - BAT BUOC TUAN THU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
De tai nay thuoc mon Toan, lop 9 (THCS).

PHAM VI KIEN THUC DUOC PHEP (lop 9):
  - Can thuc bac hai
  - Phuong trinh bac hai mot an
  - He phuong trinh
  - Bat dang thuc
  - Ham so y = ax² (a ≠ 0)
  - Ti so luong giac cua goc nhon
  - He thuc luong trong tam giac vuong
  - Duong tron
  - Hinh tru, hinh non, hinh cau
  - Thong ke va xac suat co ban

TUYET DOI KHONG DUOC CHUA:
  - "nguyen ham" ← VUOT CAP, CAM SU DUNG
  - "tich phan" ← VUOT CAP, CAM SU DUNG
  - "logarit" ← VUOT CAP, CAM SU DUNG
  - "dao ham" ← VUOT CAP, CAM SU DUNG
  - "ham mu" ← VUOT CAP, CAM SU DUNG
  - "so phuc" ← VUOT CAP, CAM SU DUNG
  - "ma tran" ← VUOT CAP, CAM SU DUNG
  - "vecto trong khong gian" ← VUOT CAP, CAM SU DUNG
```

### Post-validation (neu Gemini van sinh noi dung sai):

```
---
⚠️ CANH BAO KIEM TRA TU DONG: Noi dung chua kien thuc VUOT CAP
(khong thuoc lop 9): tich phan, dao ham.
Cac tu khoa tren thuoc chuong trinh lop cao hon.
Hay thay the bang noi dung phu hop lop 9.

Vui long kiem tra lai dan y va chinh sua neu can.
```

---

## 5. Cac truong hop dac biet

| Truong hop | Xu ly |
|-----------|-------|
| Mon hoc khong co trong DB (VD: "Quan ly", "Cong doan") | Bo qua validation, khong chen prompt rang buoc |
| Cap hoc cao (Cao dang, Dai hoc) | Bo qua validation (bien `isHigherEd = true`) |
| Grade nhap dang text ("Lop 9", "Khoi 6-9") | Regex `match(/\d+/)` lay so dau tien |
| Grade khong co so ("Toan cho giao vien") | Bo qua validation |

---

## 6. Cau truc file lien quan

```
SKKNPROTHT2025-main/
├── App.tsx                          ← SUA: import + inject prompt + post-validate
├── constants.ts                     ← SUA: them PHAN 1B SYSTEM_INSTRUCTION
├── services/
│   ├── curriculumValidator.ts       ← MOI: service wrapper
│   └── geminiService.ts             (khong doi)
├── data/
│   ├── curriculum-database.json     ← COPY tu KIEN THUC CAC MON/
│   ├── subjectsData.ts              (khong doi)
│   └── ...
└── KIEN THUC CAC MON/
    ├── curriculum-database.json     ← File goc (giu nguyen de tham khao)
    ├── curriculum-validator.ts      ← File goc (giu nguyen de tham khao)
    ├── HUONG_DAN_SU_DUNG.md
    ├── TONG_HOP_BUOC_2.md
    ├── SKKNGeneratorExample.tsx
    └── TICH_HOP_CURRICULUM_VALIDATOR.md  ← FILE NAY
```

---

## 7. Loi da gap va cach xu ly

### Loi: Vite build that bai voi duong dan co dau cach

```
Could not resolve "../KIEN THUC CAC MON/curriculum-database.json"
from "services/curriculumValidator.ts"
```

**Nguyen nhan:** Rollup (bundler cua Vite) khong resolve duoc duong dan thu muc co dau cach.

**Cach xu ly:** Copy `curriculum-database.json` vao thu muc `data/` (khong co dau cach), doi import path:

```typescript
// TRUOC (loi):
import curriculumDB from '../KIEN THUC CAC MON/curriculum-database.json';

// SAU (chay duoc):
import curriculumDB from '../data/curriculum-database.json';
```

---

## 8. Kiem tra / Test

### Test case 1: Toan lop 9 (phai chan vuot cap)
- Nhap: Mon = "Toan", Lop = "9"
- Ky vong: Prompt co rang buoc, KHONG co "nguyen ham", "tich phan" trong dan y
- Neu Gemini van sinh → Post-validation hien canh bao

### Test case 2: Toan lop 12 (cho phep tich phan)
- Nhap: Mon = "Toan", Lop = "12"
- Ky vong: Prompt cho phep "nguyen ham", "tich phan" (nam trong topics hop le)

### Test case 3: Mon khong co trong DB
- Nhap: Mon = "Quan ly", Lop = "THPT"
- Ky vong: Khong co rang buoc curriculum (bo qua), app hoat dong binh thuong

### Test case 4: Bac Dai hoc
- Nhap: Cap hoc = "Dai hoc"
- Ky vong: Bo qua toan bo curriculum validation

---

## 9. Mo rong tuong lai

- [ ] Them validation cho cac buoc tiep theo (Phan III, IV, V...), khong chi dan y
- [ ] Hien thi canh bao bang UI component (modal/toast) thay vi chen text vao dan y
- [ ] Cho phep user bao cao "false positive" (VD: de tai nghien cuu phuong phap giang day tich phan cho lop 12 nhung user nhap lop 9)
- [ ] Dong bo khi cap nhat `KIEN THUC CAC MON/curriculum-database.json` → tu dong copy sang `data/`
- [ ] Bo sung them mon hoc vao database (hien co 7 mon, co the them Tin hoc, The duc...)
