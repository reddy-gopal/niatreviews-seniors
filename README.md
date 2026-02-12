# NIAT Seniors Registration Portal

A dedicated registration platform for NIAT college seniors to join as verified mentors and help prospective students.

## 🎨 Design & Features

### Color Palette (Matching Main Frontend)
- **Primary (Red)**: #991b1b - Main brand color
- **Secondary (Purple)**: #7678ed - Accent color
- **Accents**: Amber (#f7b801), Orange (#f18701)
- **Backgrounds**: Warm cream tones (#fff8eb, #fbf2f3)
- **Text**: Slate shades for readability

### Key Features Implemented

#### 1. **Navbar**
- Matches the main frontend design exactly
- Responsive with mobile-first approach
- Logo with fallback icon (GraduationCap)
- Links to main site login/register
- Sticky positioning with glassmorphism effect

#### 2. **Enhanced Registration Form**
The form is organized into 4 sections:

**Section 1: Basic Information**
- Full Name, Username
- Email, Phone Number

**Section 2: Academic Details**
- Graduation Year (4-digit input)
- Branch (dropdown with common NIAT branches)
- Student ID (NIAT format)
- Current Status (Placed, Higher Studies, Entrepreneur, etc.)

**Section 3: Verification**
- **ID Card Upload** (NEW!)
  - Visual upload area with drag-and-drop
  - Image preview with file details
  - File size validation (max 5MB)
  - Image type validation (JPG/PNG only)
  - Remove/replace functionality
  - Clear success indicator

**Section 4: Engaging Questions**
- "Why do you want to join as a senior mentor?"
- "What was your best experience at NIAT?"
- "One piece of advice you'd give to juniors"
- Current/Most Recent Company (optional)
- Key Skills Gained

#### 3. **Success State**
- Celebration screen with success icon
- Clear next steps explanation
- Option to submit another registration

#### 4. **Additional Information Panel**
- "What happens next?" section
- Timeline expectations (2-3 business days)
- Process transparency

### 🎯 UX Improvements

1. **Visual Hierarchy**: Numbered sections with colored badges
2. **Required Fields**: Asterisk (*) indicators in brand red
3. **Form Validation**: 
   - All required fields enforced
   - File size and type validation
   - Proper input types (email, tel, etc.)
4. **Responsive Design**:
   - Mobile-first approach
   - Grid layouts adapt to screen size
   - Touch-friendly 44px minimum tap targets
5. **Accessibility**:
   - Proper ARIA labels
   - Semantic HTML
   - Focus states on all interactive elements

### 🚀 Running the Application

```bash
# Install dependencies
npm install

# Run development server (port 3002)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application runs on **port 3002** to avoid conflicts with the main frontend.

### 📝 Form Data Structure

```typescript
interface FormData {
  // Basic
  fullName: string;
  username: string;
  email: string;
  phone: string;
  
  // Academic
  graduationYear: string;
  branch: string;
  studentId: string;
  currentStatus: string;
  
  // Verification
  idCardImage: File | null;
  
  // Engagement
  whyJoin: string;
  bestExperience: string;
  adviceToJuniors: string;
  placementCompany: string;
  skillsGained: string;
}
```

### 🔗 Integration Points

The form currently logs data to console. To integrate with backend:

1. Update `handleSubmit` function in `src/app/page.tsx`
2. Use FormData API to send multipart/form-data
3. POST to your backend endpoint (e.g., `/api/senior-registration/`)
4. Handle success/error states

Example integration:
```typescript
const formDataToSend = new FormData();
Object.entries(formData).forEach(([key, value]) => {
  if (key === 'idCardImage' && value) {
    formDataToSend.append(key, value);
  } else if (key !== 'idCardImage') {
    formDataToSend.append(key, value);
  }
});

const response = await fetch('/api/senior-registration/', {
  method: 'POST',
  body: formDataToSend,
});
```

### 🎨 Styling Approach

- **Tailwind CSS** with custom NIAT color variables
- **CSS Variables** for consistent theming
- **Responsive utilities** for all screen sizes
- **Focus states** using primary color
- **Hover effects** with opacity transitions

### 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 🔒 Security Considerations

- File upload validation (size, type)
- Form validation on both client and server
- Secure ID card image storage
- HTTPS required for production

### 🚧 Future Enhancements

- [ ] Email verification
- [ ] Phone OTP verification
- [ ] LinkedIn profile integration
- [ ] Resume upload (optional)
- [ ] Video introduction (optional)
- [ ] Multi-step progress indicator
- [ ] Draft save functionality
- [ ] Social proof (number of seniors joined)

---

**Built with ❤️ for the NIAT Community**
