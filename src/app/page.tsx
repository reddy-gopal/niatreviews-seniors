"use client";

import { useState, useRef } from "react";
import { GraduationCap, CheckCircle, Upload, X, ImageIcon, Check } from "lucide-react";
import { Navbar } from "../components/Navbar";
import Image from "next/image";
import { submitSeniorRegistration } from "../lib/api";

interface FormData {
  // Basic Info
  fullName: string;
  callName: string;
  collegeEmail: string;
  personalEmail: string;
  phone: string;
  
  // Academic Info
  partnerCollege: string;
  graduationYear: string;
  branch: string;
  studentId: string;
  currentStatus: string;
  
  // Verification
  idCardImage: File | null;
  
  // Engaging Questions
  whyJoin: string;
  bestExperience: string;
  adviceToJuniors: string;
  skillsGained: string;
}

export default function SeniorRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // OTP verification states
  const [collegeEmailVerified, setCollegeEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showCollegeEmailOTP, setShowCollegeEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [collegeEmailOTP, setCollegeEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    callName: "",
    collegeEmail: "",
    personalEmail: "",
    phone: "",
    partnerCollege: "",
    graduationYear: "",
    branch: "",
    studentId: "",
    currentStatus: "",
    idCardImage: null,
    whyJoin: "",
    bestExperience: "",
    adviceToJuniors: "",
    skillsGained: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!collegeEmailVerified) {
      alert("Please verify your college email");
      return;
    }
    
    if (!phoneVerified) {
      alert("Please verify your phone number");
      return;
    }
    
    if (!formData.idCardImage) {
      alert("Please upload your NIAT College ID Card");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await submitSeniorRegistration({
        full_name: formData.fullName,
        call_name: formData.callName,
        college_email: formData.collegeEmail,
        personal_email: formData.personalEmail,
        phone: formData.phone,
        partner_college: formData.partnerCollege,
        graduation_year: formData.graduationYear,
        branch: formData.branch,
        student_id: formData.studentId,
        current_status: formData.currentStatus,
        id_card_image: formData.idCardImage,
        why_join: formData.whyJoin,
        best_experience: formData.bestExperience,
        advice_to_juniors: formData.adviceToJuniors,
        skills_gained: formData.skillsGained,
        college_email_verified: collegeEmailVerified,
        phone_verified: phoneVerified,
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : "Failed to submit registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCollegeEmailOTP = () => {
    if (!formData.collegeEmail) {
      alert("Please enter your college email");
      return;
    }
    // In production, send OTP to email
    setShowCollegeEmailOTP(true);
    alert("OTP sent to your college email! (For demo, enter any 4-digit code)");
  };

  const handleVerifyCollegeEmailOTP = () => {
    if (collegeEmailOTP.length === 4 && /^\d+$/.test(collegeEmailOTP)) {
      setCollegeEmailVerified(true);
      setShowCollegeEmailOTP(false);
      alert("College email verified successfully!");
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  };

  const handleSendPhoneOTP = () => {
    if (!formData.phone) {
      alert("Please enter your phone number");
      return;
    }
    // In production, send OTP to phone
    setShowPhoneOTP(true);
    alert("OTP sent to your phone! (For demo, enter any 4-digit code)");
  };

  const handleVerifyPhoneOTP = () => {
    if (phoneOTP.length === 4 && /^\d+$/.test(phoneOTP)) {
      setPhoneVerified(true);
      setShowPhoneOTP(false);
      alert("Phone number verified successfully!");
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      
      setFormData({ ...formData, idCardImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIdCard = () => {
    setFormData({ ...formData, idCardImage: null });
    setIdCardPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-8 text-center border border-niat-border">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-niat-text mb-4">
              Registration Submitted!
            </h1>
            <p className="text-niat-text-secondary mb-2">
              Thank you for registering as a NIAT senior!
            </p>
            <p className="text-sm text-niat-text-secondary mb-6">
              Our team will review your application and verify your credentials. You'll receive an email within 2-3 business days.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSubmitError(null);
                setIsSubmitting(false);
                setFormData({
                  fullName: "",
                  callName: "",
                  collegeEmail: "",
                  personalEmail: "",
                  phone: "",
                  partnerCollege: "",
                  graduationYear: "",
                  branch: "",
                  studentId: "",
                  currentStatus: "",
                  idCardImage: null,
                  whyJoin: "",
                  bestExperience: "",
                  adviceToJuniors: "",
                  skillsGained: "",
                });
                setIdCardPreview(null);
                setCollegeEmailVerified(false);
                setPhoneVerified(false);
                setShowCollegeEmailOTP(false);
                setShowPhoneOTP(false);
                setCollegeEmailOTP("");
                setPhoneOTP("");
              }}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Submit Another
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-5rem)] py-8 px-4 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 mb-4">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="NIAT Logo"
                  width={120}
                  height={40}
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl">
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
              )}
              <div className="flex flex-col items-start text-left">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-primary leading-tight">
                  National Innovation of
                </p>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-primary leading-tight">
                  Advanced Technology
                </p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-niat-text mb-2">
              Join as a NIAT Senior
            </h1>
            <p className="text-niat-text-secondary text-sm sm:text-base">
              Share your experience and guide prospective students on their journey
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 border border-niat-border">
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-niat-text flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg text-primary-foreground text-sm font-bold">1</span>
                  Basic Information
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-niat-text mb-2">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                      placeholder="John Doe"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-niat-text mb-2">
                      What should we call you? <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="callName"
                      value={formData.callName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                      placeholder="Your preferred name or nickname"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    College Email <span className="text-primary">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="collegeEmail"
                      value={formData.collegeEmail}
                      onChange={handleChange}
                      required
                      disabled={collegeEmailVerified}
                      className="flex-1 px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="your.name@college.edu"
                      suppressHydrationWarning
                    />
                    {!collegeEmailVerified && !showCollegeEmailOTP && (
                      <button
                        type="button"
                        onClick={handleSendCollegeEmailOTP}
                        className="px-4 py-3 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap"
                        suppressHydrationWarning
                      >
                        Send OTP
                      </button>
                    )}
                    {collegeEmailVerified && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg">
                        <Check className="h-5 w-5" />
                        <span className="font-medium whitespace-nowrap">Verified</span>
                      </div>
                    )}
                  </div>
                  {showCollegeEmailOTP && !collegeEmailVerified && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={collegeEmailOTP}
                        onChange={(e) => setCollegeEmailOTP(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="flex-1 px-4 py-2 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary text-center text-lg font-semibold tracking-widest"
                        placeholder="0000"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCollegeEmailOTP}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                        suppressHydrationWarning
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    Personal Email <span className="text-primary">*</span>
                  </label>
                  <p className="text-xs text-niat-text-secondary mb-2">
                    For receiving updates and notifications
                  </p>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                    placeholder="john@gmail.com"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    Phone <span className="text-primary">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={phoneVerified}
                      className="flex-1 px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="+91 9876543210"
                      suppressHydrationWarning
                    />
                    {!phoneVerified && !showPhoneOTP && (
                      <button
                        type="button"
                        onClick={handleSendPhoneOTP}
                        className="px-4 py-3 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap"
                        suppressHydrationWarning
                      >
                        Send OTP
                      </button>
                    )}
                    {phoneVerified && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg">
                        <Check className="h-5 w-5" />
                        <span className="font-medium whitespace-nowrap">Verified</span>
                      </div>
                    )}
                  </div>
                  {showPhoneOTP && !phoneVerified && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={phoneOTP}
                        onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="flex-1 px-4 py-2 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary text-center text-lg font-semibold tracking-widest"
                        placeholder="0000"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPhoneOTP}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                        suppressHydrationWarning
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4 pt-4 border-t border-niat-border">
                <h2 className="text-xl font-semibold text-niat-text flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg text-primary-foreground text-sm font-bold">2</span>
                  Academic Details
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    Partner College <span className="text-primary">*</span>
                  </label>
                  <select
                    name="partnerCollege"
                    value={formData.partnerCollege}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                    suppressHydrationWarning
                  >
                    <option value="">Select College</option>
                    <option value="CDU">CDU</option>
                    <option value="BITSAT">BITSAT</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-niat-text mb-2">
                      Graduation Year <span className="text-primary">*</span>
                    </label>
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                      suppressHydrationWarning
                    >
                      <option value="">Select Year</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-niat-text mb-2">
                      Branch <span className="text-primary">*</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                      suppressHydrationWarning
                    >
                      <option value="">Select Branch</option>
                      <option value="BTECH">B.TECH</option>
                      <option value="BSC">B.SC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-niat-text mb-2">
                      Student ID <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                      placeholder="N24H01A000"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    Current Status <span className="text-primary">*</span>
                  </label>
                  <select
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                    suppressHydrationWarning
                  >
                    <option value="">Select Status</option>
                    <option value="Student">Student</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>

              {/* ID Card Upload */}
              <div className="space-y-4 pt-4 border-t border-niat-border">
                <h2 className="text-xl font-semibold text-niat-text flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg text-primary-foreground text-sm font-bold">3</span>
                  Verification
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    NIAT College ID Card <span className="text-primary">*</span>
                  </label>
                  <p className="text-xs text-niat-text-secondary mb-3">
                    Upload a clear photo of your college ID card for verification (Max 5MB, JPG/PNG)
                  </p>
                  
                  {!idCardPreview ? (
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="idCard"
                      />
                      <label
                        htmlFor="idCard"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-niat-border rounded-lg cursor-pointer hover:bg-niat-navbar/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 text-niat-text-secondary mb-3" />
                          <p className="mb-2 text-sm text-niat-text">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-niat-text-secondary">PNG, JPG (MAX. 5MB)</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border-2 border-niat-border rounded-lg p-4">
                      <button
                        type="button"
                        onClick={removeIdCard}
                        className="absolute top-2 right-2 p-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
                        aria-label="Remove ID card"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-niat-navbar flex items-center justify-center">
                          <img
                            src={idCardPreview}
                            alt="ID Card Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-niat-text mb-1">
                            {formData.idCardImage?.name}
                          </p>
                          <p className="text-sm text-niat-text-secondary">
                            {formData.idCardImage &&
                              `${(formData.idCardImage.size / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            ID card uploaded successfully
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Engaging Questions */}
              <div className="space-y-4 pt-4 border-t border-niat-border">
                <h2 className="text-xl font-semibold text-niat-text flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg text-primary-foreground text-sm font-bold">4</span>
                  Share Your Journey
                </h2>
                <p className="text-sm text-niat-text-secondary">
                  Help us understand your experience and how you can contribute to the community
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    Why do you want to join as a senior mentor? <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text resize-none"
                    placeholder="Share your motivation to help prospective students..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    What was your best experience at NIAT? <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="bestExperience"
                    value={formData.bestExperience}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text resize-none"
                    placeholder="Tell us about a memorable moment, achievement, or experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    One piece of advice you'd give to juniors <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="adviceToJuniors"
                    value={formData.adviceToJuniors}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text resize-none"
                    placeholder="What would you tell your younger self or current students?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-niat-text mb-2">
                    Key Skills You Gained <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="skillsGained"
                    value={formData.skillsGained}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-niat-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-niat-text"
                    placeholder="e.g., Programming, Leadership, Communication..."
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {submitError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
                <p className="text-xs text-center text-niat-text-secondary mt-3">
                  By submitting, you agree to our verification process and community guidelines
                </p>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-niat-border shadow-soft">
            <h3 className="font-semibold text-niat-text mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-niat-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Our team will verify your credentials within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You'll receive a confirmation email once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Start answering questions and sharing your valuable insights!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
