# Senior Registration - Quick Data Reference

## 📊 All Collected Fields (18 Total)

### Section 1: Basic Information (5 fields)
1. **Full Name** - `full_name` - String(255) - Required ✅
2. **What should we call you?** - `call_name` - String(100) - Required ✅
3. **College Email** - `college_email` - Email(255) - Required ✅ - **OTP Verified** 🔐
4. **Personal Email** - `personal_email` - Email(255) - Required ✅
5. **Phone** - `phone` - String(20) - Required ✅ - **OTP Verified** 🔐

### Section 2: Academic Details (5 fields)
6. **Partner College** - `partner_college` - Enum - Required ✅
   - Options: `CDU`, `BITSAT`
7. **Graduation Year** - `graduation_year` - Integer - Required ✅
   - Options: `2027`, `2028`, `2029`
8. **Branch** - `branch` - String(100) - Required ✅
   - Options: Computer Science, IT, Electronics, Mechanical, Civil, Electrical, Chemical, Other
9. **Student ID** - `student_id` - String(50) - Required ✅ - **Unique**
10. **Current Status** - `current_status` - Enum - Required ✅
    - Options: `Student`, `Intern`

### Section 3: Verification (1 field)
11. **ID Card Image** - `id_card_image` - File (Image) - Required ✅
    - Max size: 5MB
    - Formats: JPG, PNG

### Section 4: Engagement Questions (4 fields)
12. **Why join as mentor?** - `why_join` - Text(1000) - Required ✅
13. **Best NIAT experience?** - `best_experience` - Text(1000) - Required ✅
14. **Advice to juniors** - `advice_to_juniors` - Text(1000) - Required ✅
15. **Key skills gained** - `skills_gained` - String(500) - Required ✅

### Meta Fields (3 fields - Auto-generated)
16. **review_status** - Enum - Default: `pending`
    - Options: `pending`, `approved`, `rejected`
17. **created_at** - Timestamp - Auto
18. **updated_at** - Timestamp - Auto

---

## 🔐 Unique Constraints

These fields must be unique across all registrations:
- `college_email` ✅
- `phone` ✅
- `student_id` ✅

---

## ✅ Required Verifications

Before submission is allowed:
1. College Email → OTP verified (4-digit code)
2. Phone → OTP verified (4-digit code)
3. ID Card Image → File uploaded

---

## 📋 Database Table Size Estimate

**Fields**: 18 total (15 user-input + 3 auto)  
**Unique Constraints**: 3 (email, phone, student_id)  
**Indexes Needed**: ~8 (for performance)  
**File Storage**: Separate (S3/Cloudinary)  
**Related Tables**: 1 (OTP verifications - separate table)

**Estimated Storage per Registration**:
- Database row: ~3-5 KB
- ID card image: 500 KB - 5 MB (average ~1-2 MB after compression)

**For 1000 registrations**:
- Database: ~5 MB
- Images: ~1-2 GB

---

## 🎯 Field Purpose Classification

### Identity Verification (3)
- `college_email` (verified)
- `phone` (verified)
- `id_card_image`

### Profile Information (5)
- `full_name`
- `call_name`
- `personal_email`
- `student_id`
- `current_status`

### Academic Context (4)
- `partner_college`
- `graduation_year`
- `branch`
- `skills_gained`

### Engagement Assessment (3)
- `why_join` (motivation)
- `best_experience` (positive outlook)
- `advice_to_juniors` (mentorship capability)

### Administrative (3)
- `review_status`
- `created_at`
- `updated_at`

---

## 🚀 Quick Implementation Guide

### Step 1: Create Database Table
Use the SQL schema from `SENIOR_REGISTRATION_DATA.md`

### Step 2: Set Up File Storage
- Development: Local `media/` folder
- Production: AWS S3 or Cloudinary

### Step 3: Implement OTP System
- Email OTP: Use SendGrid/AWS SES
- Phone OTP: Use Twilio/AWS SNS
- Create `otp_verifications` table

### Step 4: Create API Endpoints
- POST `/api/senior-registration/send-otp/`
- POST `/api/senior-registration/verify-otp/`
- POST `/api/senior-registration/` (main submission)

### Step 5: Admin Interface
- List all registrations
- Filter by status (pending/approved/rejected)
- View ID card image
- Approve/reject with notes

---

## 📝 TypeScript Interface (Frontend)

```typescript
interface SeniorRegistration {
  // Basic
  fullName: string;
  callName: string;
  collegeEmail: string;
  personalEmail: string;
  phone: string;
  
  // Academic
  partnerCollege: 'CDU' | 'BITSAT';
  graduationYear: 2027 | 2028 | 2029;
  branch: string;
  studentId: string;
  currentStatus: 'Student' | 'Intern';
  
  // Verification
  idCardImage: File;
  
  // Engagement
  whyJoin: string;
  bestExperience: string;
  adviceToJuniors: string;
  skillsGained: string;
}
```

---

## 📊 Sample Data for Testing

```json
{
  "fullName": "Priya Patel",
  "callName": "Priya",
  "collegeEmail": "priya.patel@niat.edu",
  "personalEmail": "priya.tech@gmail.com",
  "phone": "+91 9123456789",
  "partnerCollege": "CDU",
  "graduationYear": 2028,
  "branch": "Information Technology",
  "studentId": "NIAT2028IT015",
  "currentStatus": "Intern",
  "whyJoin": "I want to give back to the NIAT community...",
  "bestExperience": "Winning the inter-college coding competition...",
  "adviceToJuniors": "Start building your portfolio early...",
  "skillsGained": "Web development, Database design, Git, Agile"
}
```

---

**Ready to implement!** Use these specs to build your database schema. 🚀
