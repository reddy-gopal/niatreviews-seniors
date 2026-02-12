# Senior Registration Data Collection Specification

## Overview
This document specifies all data collected from NIAT seniors during registration. Use this to design the database schema and API endpoints.

---

## 📋 Complete Data Fields

### 1. Basic Information

| Field Name | Type | Required | Max Length | Validation | Purpose |
|------------|------|----------|------------|------------|---------|
| `fullName` | String | ✅ Yes | 255 | Non-empty | Legal name for verification |
| `callName` | String | ✅ Yes | 100 | Non-empty | Preferred name/nickname for community |
| `collegeEmail` | Email | ✅ Yes | 255 | Valid email format, Must be verified via OTP | Primary contact, college verification |
| `personalEmail` | Email | ✅ Yes | 255 | Valid email format | Updates and notifications |
| `phone` | String | ✅ Yes | 20 | Valid phone format, Must be verified via OTP | SMS notifications, verification |

**Verification Requirements:**
- College Email: 4-digit OTP verification mandatory
- Phone: 4-digit OTP verification mandatory
- Both must be verified before form submission

---

### 2. Academic Information

| Field Name | Type | Required | Options/Validation | Purpose |
|------------|------|----------|-------------------|---------|
| `partnerCollege` | Enum/String | ✅ Yes | `CDU`, `BITSAT` | Identify partner institution |
| `graduationYear` | Integer | ✅ Yes | `2027`, `2028`, `2029` | Academic cohort tracking |
| `branch` | Enum/String | ✅ Yes | See branch options below | Department identification |
| `studentId` | String | ✅ Yes | 50 chars | Unique college ID | Cross-reference with records |
| `currentStatus` | Enum/String | ✅ Yes | `Student`, `Intern` | Current academic/work status |

**Branch Options:**
- Computer Science
- Information Technology
- Electronics
- Mechanical
- Civil
- Electrical
- Chemical
- Other

---

### 3. Verification Documents

| Field Name | Type | Required | Validation | Storage |
|------------|------|----------|------------|---------|
| `idCardImage` | File (Image) | ✅ Yes | • Max size: 5MB<br>• Formats: JPG, PNG<br>• Must be uploaded | Secure file storage (S3/Cloudinary) |

**File Handling:**
- Store original filename
- Generate unique server filename
- Store file path/URL in database
- Implement secure access controls
- Consider image compression for storage optimization

---

### 4. Engagement Questions

| Field Name | Type | Required | Max Length | Purpose |
|------------|------|----------|------------|---------|
| `whyJoin` | Text | ✅ Yes | 1000 | Assess motivation and commitment |
| `bestExperience` | Text | ✅ Yes | 1000 | Understand positive experiences |
| `adviceToJuniors` | Text | ✅ Yes | 1000 | Evaluate mentorship capability |
| `skillsGained` | String | ✅ Yes | 500 | Identify expertise areas |

**Text Fields Notes:**
- Use `TEXT` or `VARCHAR` based on expected length
- Consider full-text search indexing for matching mentors with questions
- Store as UTF-8 for emoji/special character support

---

## 🗄️ Suggested Database Schema

### Table: `senior_registrations`

```sql
CREATE TABLE senior_registrations (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    full_name VARCHAR(255) NOT NULL,
    call_name VARCHAR(100) NOT NULL,
    college_email VARCHAR(255) NOT NULL UNIQUE,
    college_email_verified BOOLEAN DEFAULT FALSE,
    college_email_verified_at TIMESTAMP,
    personal_email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP,
    
    -- Academic Information
    partner_college VARCHAR(50) NOT NULL,  -- 'CDU' or 'BITSAT'
    graduation_year INTEGER NOT NULL,  -- 2027, 2028, 2029
    branch VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    current_status VARCHAR(50) NOT NULL,  -- 'Student' or 'Intern'
    
    -- Verification
    id_card_image_url VARCHAR(500) NOT NULL,  -- S3/Cloudinary URL
    id_card_original_filename VARCHAR(255),
    
    -- Engagement Questions
    why_join TEXT NOT NULL,
    best_experience TEXT NOT NULL,
    advice_to_juniors TEXT NOT NULL,
    skills_gained VARCHAR(500) NOT NULL,
    
    -- Review & Status
    review_status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    CONSTRAINT check_partner_college CHECK (partner_college IN ('CDU', 'BITSAT')),
    CONSTRAINT check_graduation_year CHECK (graduation_year IN (2027, 2028, 2029)),
    CONSTRAINT check_current_status CHECK (current_status IN ('Student', 'Intern')),
    CONSTRAINT check_review_status CHECK (review_status IN ('pending', 'approved', 'rejected'))
);

-- Indexes for common queries
CREATE INDEX idx_senior_reg_college_email ON senior_registrations(college_email);
CREATE INDEX idx_senior_reg_phone ON senior_registrations(phone);
CREATE INDEX idx_senior_reg_student_id ON senior_registrations(student_id);
CREATE INDEX idx_senior_reg_review_status ON senior_registrations(review_status);
CREATE INDEX idx_senior_reg_created_at ON senior_registrations(created_at DESC);
CREATE INDEX idx_senior_reg_partner_college ON senior_registrations(partner_college);
CREATE INDEX idx_senior_reg_graduation_year ON senior_registrations(graduation_year);
```

---

## 🐍 Django Model Example

```python
# verification/models.py

import uuid
from django.db import models
from django.conf import settings

class SeniorRegistration(models.Model):
    """
    Registration form for NIAT seniors to become verified mentors.
    Includes verification via college email and phone OTP.
    """
    
    # Partner College Choices
    PARTNER_CDU = 'CDU'
    PARTNER_BITSAT = 'BITSAT'
    PARTNER_CHOICES = [
        (PARTNER_CDU, 'CDU'),
        (PARTNER_BITSAT, 'BITSAT'),
    ]
    
    # Current Status Choices
    STATUS_STUDENT = 'Student'
    STATUS_INTERN = 'Intern'
    STATUS_CHOICES = [
        (STATUS_STUDENT, 'Student'),
        (STATUS_INTERN, 'Intern'),
    ]
    
    # Review Status
    REVIEW_PENDING = 'pending'
    REVIEW_APPROVED = 'approved'
    REVIEW_REJECTED = 'rejected'
    REVIEW_CHOICES = [
        (REVIEW_PENDING, 'Pending'),
        (REVIEW_APPROVED, 'Approved'),
        (REVIEW_REJECTED, 'Rejected'),
    ]
    
    # Graduation Year Choices (2027-2029)
    GRADUATION_YEAR_CHOICES = [
        (2027, '2027'),
        (2028, '2028'),
        (2029, '2029'),
    ]
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Information
    full_name = models.CharField(max_length=255)
    call_name = models.CharField(max_length=100)
    college_email = models.EmailField(unique=True, db_index=True)
    college_email_verified = models.BooleanField(default=False)
    college_email_verified_at = models.DateTimeField(null=True, blank=True)
    personal_email = models.EmailField()
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    phone_verified = models.BooleanField(default=False)
    phone_verified_at = models.DateTimeField(null=True, blank=True)
    
    # Academic Information
    partner_college = models.CharField(max_length=50, choices=PARTNER_CHOICES, db_index=True)
    graduation_year = models.IntegerField(choices=GRADUATION_YEAR_CHOICES, db_index=True)
    branch = models.CharField(max_length=100)
    student_id = models.CharField(max_length=50, unique=True, db_index=True)
    current_status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    
    # Verification Documents
    id_card_image = models.ImageField(upload_to='senior_verifications/id_cards/')
    id_card_original_filename = models.CharField(max_length=255, blank=True)
    
    # Engagement Questions
    why_join = models.TextField()
    best_experience = models.TextField()
    advice_to_juniors = models.TextField()
    skills_gained = models.CharField(max_length=500)
    
    # Review & Approval
    review_status = models.CharField(
        max_length=50,
        choices=REVIEW_CHOICES,
        default=REVIEW_PENDING,
        db_index=True
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_senior_registrations'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'senior_registration'
        ordering = ['-created_at']
        verbose_name = 'Senior Registration'
        verbose_name_plural = 'Senior Registrations'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['review_status', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.full_name} ({self.college_email})"
```

---

## 📊 Data Validation Rules

### Email Validation
- **College Email**: 
  - Must follow standard email format
  - Should ideally match college domain pattern (e.g., `@niat.edu`)
  - OTP verification required (4-digit numeric code)
  - Store verification timestamp

- **Personal Email**:
  - Must follow standard email format
  - No verification required
  - Used for notifications only

### Phone Validation
- Format: Support international format (+91 XXXXXXXXXX)
- OTP verification required (4-digit numeric code)
- Store verification timestamp
- Should be unique across all registrations

### Student ID
- Must be unique
- Suggested pattern: `NIAT[YEAR][BRANCH][NUMBER]`
- Example: `NIAT2027CS001`
- Cross-reference with college records

### ID Card Image
- **Size**: Maximum 5MB
- **Format**: JPG, PNG only
- **Security**: Store in secure location with access controls
- **Retention**: Keep for audit/verification purposes

---

## 🔐 OTP Verification System

### College Email OTP
```json
{
  "purpose": "Verify college email ownership",
  "code_length": 4,
  "code_type": "numeric",
  "valid_for": "10 minutes",
  "max_attempts": 3,
  "resend_cooldown": "60 seconds"
}
```

### Phone OTP
```json
{
  "purpose": "Verify phone number ownership",
  "code_length": 4,
  "code_type": "numeric",
  "valid_for": "10 minutes",
  "max_attempts": 3,
  "resend_cooldown": "60 seconds"
}
```

### Suggested OTP Table Schema
```sql
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES senior_registrations(id),
    type VARCHAR(20) NOT NULL,  -- 'college_email' or 'phone'
    recipient VARCHAR(255) NOT NULL,  -- email or phone number
    code VARCHAR(4) NOT NULL,
    attempts INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    
    CONSTRAINT check_otp_type CHECK (type IN ('college_email', 'phone'))
);

CREATE INDEX idx_otp_recipient ON otp_verifications(recipient, type, verified);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);
```

---

## 📝 Form Data JSON Structure

### Frontend Submission Payload

```typescript
interface SeniorRegistrationSubmission {
  // Basic Information
  fullName: string;              // "John Doe"
  callName: string;              // "Johnny" (what we call them)
  collegeEmail: string;          // "john.doe@niat.edu"
  personalEmail: string;         // "john@gmail.com"
  phone: string;                 // "+91 9876543210"
  
  // Academic Information
  partnerCollege: "CDU" | "BITSAT";
  graduationYear: 2027 | 2028 | 2029;
  branch: string;                // "Computer Science"
  studentId: string;             // "NIAT2027CS001"
  currentStatus: "Student" | "Intern";
  
  // Verification (multipart/form-data)
  idCardImage: File;             // Image file (JPG/PNG, max 5MB)
  
  // Engagement Questions
  whyJoin: string;               // Motivation (max 1000 chars)
  bestExperience: string;        // Best NIAT memory (max 1000 chars)
  adviceToJuniors: string;       // Advice for juniors (max 1000 chars)
  skillsGained: string;          // Key skills learned (max 500 chars)
  
  // Verification tokens (already verified in frontend)
  collegeEmailVerified: boolean; // true
  phoneVerified: boolean;        // true
}
```

### Example JSON (excluding file)
```json
{
  "fullName": "Rahul Sharma",
  "callName": "Rahul",
  "collegeEmail": "rahul.sharma@niat.edu",
  "personalEmail": "rahultech@gmail.com",
  "phone": "+91 9876543210",
  "partnerCollege": "CDU",
  "graduationYear": 2027,
  "branch": "Computer Science",
  "studentId": "NIAT2027CS042",
  "currentStatus": "Student",
  "whyJoin": "I want to help prospective students make informed decisions about their college choices. During my time at NIAT, I struggled to find reliable information...",
  "bestExperience": "The tech fest in my second year was incredible. Our team won the hackathon and it was a turning point in my coding journey...",
  "adviceToJuniors": "Focus on building real projects rather than just theoretical knowledge. Join clubs, participate in competitions, and network with seniors...",
  "skillsGained": "Full-stack development, Problem solving, Team collaboration, Public speaking",
  "collegeEmailVerified": true,
  "phoneVerified": true
}
```

---

## 🔄 Registration Workflow

### 1. Form Submission
```
User fills form → Frontend validates → OTP verification → Upload ID card → Submit
```

### 2. Backend Processing
```
Receive data → Validate fields → Store ID card → Save to DB → Send confirmation email → Admin notification
```

### 3. Review Process
```
Admin reviews → Verify ID card → Check credentials → Approve/Reject → Notify applicant
```

### 4. Approval
```
Status = approved → Create user account → Assign 'senior' role → Send welcome email
```

---

## 🎯 API Endpoints Needed

### Registration
```
POST /api/senior-registration/
Content-Type: multipart/form-data

Request:
- All form fields (as JSON or form data)
- idCardImage (file upload)

Response:
{
  "id": "uuid",
  "status": "pending",
  "message": "Registration submitted successfully"
}
```

### OTP Generation
```
POST /api/senior-registration/send-otp/
{
  "type": "college_email" | "phone",
  "recipient": "email@domain.com" | "+91 9876543210"
}

Response:
{
  "message": "OTP sent successfully",
  "expiresIn": 600  // seconds
}
```

### OTP Verification
```
POST /api/senior-registration/verify-otp/
{
  "type": "college_email" | "phone",
  "recipient": "email@domain.com",
  "code": "1234"
}

Response:
{
  "verified": true,
  "token": "verification-token"  // Use to track verified state
}
```

### Admin Review
```
PATCH /api/admin/senior-registrations/{id}/
{
  "review_status": "approved" | "rejected",
  "review_notes": "Verified credentials match college records"
}
```

---

## 📊 Database Indexes (Performance)

### Essential Indexes
1. **college_email** (unique, for login/lookup)
2. **phone** (unique, for verification)
3. **student_id** (unique, for duplicate prevention)
4. **review_status** (for admin dashboard filtering)
5. **created_at** (for chronological listing)
6. **partner_college + graduation_year** (composite, for cohort queries)

### Optional Indexes
- `branch` - if filtering by department
- `current_status` - if tracking student vs intern separately
- `college_email_verified + phone_verified` - for verification status reports

---

## 🔍 Search & Query Patterns

### Common Queries to Optimize

1. **Pending Reviews**
```sql
SELECT * FROM senior_registrations 
WHERE review_status = 'pending' 
ORDER BY created_at ASC;
```

2. **Approved Seniors by College**
```sql
SELECT * FROM senior_registrations 
WHERE review_status = 'approved' 
AND partner_college = 'CDU'
ORDER BY graduation_year DESC;
```

3. **Verification Status**
```sql
SELECT college_email_verified, phone_verified, COUNT(*) 
FROM senior_registrations 
GROUP BY college_email_verified, phone_verified;
```

4. **Skills Search** (Full-text)
```sql
SELECT * FROM senior_registrations 
WHERE review_status = 'approved'
AND skills_gained ILIKE '%programming%';
```

---

## 🔒 Security Considerations

### Personal Data Protection
- Encrypt sensitive fields: `phone`, `college_email`
- Hash student ID for lookups
- Secure file storage with signed URLs
- Implement rate limiting on OTP generation
- Log all verification attempts

### File Upload Security
- Scan uploaded images for malware
- Strip EXIF data from images
- Generate unique filenames (prevent overwrites)
- Store in separate bucket/folder
- Implement access controls (admin-only)

### Data Retention
- Keep approved applications: Indefinitely (for audit)
- Keep rejected applications: 30 days
- Keep pending applications: 90 days (auto-expire)
- Archive old applications after user account creation

---

## 📈 Analytics & Reporting

### Useful Metrics to Track

1. **Registration Volume**
   - Total registrations per day/week/month
   - By partner college
   - By graduation year
   - By branch

2. **Verification Success Rate**
   - Email verification completion rate
   - Phone verification completion rate
   - Average time to verify

3. **Review Performance**
   - Average review time
   - Approval rate
   - Rejection reasons

4. **Engagement Quality**
   - Average text length per question
   - Most common skills mentioned
   - Sentiment analysis on responses

---

## 🚀 Implementation Checklist

### Backend Tasks
- [ ] Create `SeniorRegistration` model
- [ ] Create `OTPVerification` model
- [ ] Set up file upload handler (S3/Cloudinary)
- [ ] Implement OTP generation (email + SMS)
- [ ] Implement OTP verification endpoint
- [ ] Create registration submission endpoint
- [ ] Add admin review interface
- [ ] Send confirmation emails
- [ ] Create approved user accounts automatically

### Security Tasks
- [ ] Rate limiting on OTP endpoints
- [ ] File upload validation and sanitization
- [ ] Image malware scanning
- [ ] EXIF data stripping
- [ ] Encryption for sensitive fields
- [ ] Audit logging

### Testing Tasks
- [ ] Unit tests for model validation
- [ ] Integration tests for OTP flow
- [ ] File upload tests
- [ ] End-to-end registration flow test
- [ ] Load testing for concurrent submissions

---

## 💡 Additional Recommendations

### 1. **Duplicate Detection**
Check for duplicates before accepting registration:
- Same `college_email` (enforced by unique constraint)
- Same `phone` (enforced by unique constraint)
- Same `student_id` (enforced by unique constraint)
- Similar `full_name` + `graduation_year` (soft check, flag for review)

### 2. **Email Verification Best Practices**
- Use transactional email service (SendGrid, AWS SES)
- Template: Professional design with NIAT branding
- Include: OTP code, validity period, support contact
- Rate limit: Max 3 OTPs per email per hour

### 3. **Phone Verification Best Practices**
- Use SMS service (Twilio, AWS SNS)
- Template: "Your NIAT verification code is: {code}. Valid for 10 minutes."
- Rate limit: Max 3 OTPs per phone per hour
- Store hash of phone number for privacy

### 4. **File Storage Strategy**
```
Production:
- Use S3/Cloudinary for scalability
- Folder structure: /senior-verifications/{year}/{month}/{uuid}.jpg
- Enable automatic backups
- Set appropriate CORS policies
- Use signed URLs for temporary access

Development:
- Local filesystem: media/senior_verifications/id_cards/
- Easy testing without cloud dependencies
```

### 5. **Approval Workflow**
```
1. Admin receives notification of new registration
2. Reviews all fields and ID card image
3. Cross-checks student ID with college records (if API available)
4. Approves or rejects with notes
5. System automatically:
   - Creates user account (if approved)
   - Assigns 'senior' role
   - Sends welcome email with login credentials
   - Archives registration data
```

---

## 📞 Contact Information Collection Summary

**Primary Contact (Verified)**
- College Email ✅ (with OTP)
- Phone ✅ (with OTP)

**Secondary Contact**
- Personal Email ✅ (no verification needed)

**Why Collect Both Emails?**
- **College Email**: Official verification, proves NIAT affiliation
- **Personal Email**: Long-term contact after graduation, updates and newsletters

---

## 🎓 Partner College Integration

### Current Partners
1. **CDU** (Career Development University)
2. **BITSAT** (Birla Institute of Technology & Science Admission Test)

### Future Expansion
To add more partners, update:
- `PARTNER_CHOICES` in Django model
- `<select>` options in frontend form
- Validation constraints

---

## 📄 Document Checklist

Use this document to:
- ✅ Design database tables
- ✅ Plan API endpoints  
- ✅ Implement validation rules
- ✅ Set up file storage
- ✅ Configure OTP service
- ✅ Build admin review interface
- ✅ Create email templates
- ✅ Set up monitoring and analytics

---

**Last Updated**: February 2026  
**Version**: 1.0  
**Maintained by**: NIAT Development Team
