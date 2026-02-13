/**
 * API client for seniors-frontend
 */
import { API_BASE } from "./utils";

export interface SeniorRegistrationData {
  full_name: string;
  call_name: string;
  college_email: string;
  personal_email: string;
  phone: string;
  partner_college: string;
  graduation_year: string;
  branch: string;
  student_id: string;
  current_status: string;
  id_card_image: File;
  why_join: string;
  best_experience: string;
  advice_to_juniors: string;
  skills_gained: string;
  college_email_verified: boolean;
  phone_verified: boolean;
}

export async function submitSeniorRegistration(
  data: SeniorRegistrationData
): Promise<{ id: string; status: string }> {
  const formData = new FormData();
  
  // Append all text fields
  formData.append("full_name", data.full_name);
  formData.append("call_name", data.call_name);
  formData.append("college_email", data.college_email);
  formData.append("personal_email", data.personal_email);
  formData.append("phone", data.phone);
  formData.append("partner_college", data.partner_college);
  formData.append("graduation_year", data.graduation_year);
  formData.append("branch", data.branch);
  formData.append("student_id", data.student_id);
  formData.append("current_status", data.current_status);
  formData.append("why_join", data.why_join);
  formData.append("best_experience", data.best_experience);
  formData.append("advice_to_juniors", data.advice_to_juniors);
  formData.append("skills_gained", data.skills_gained);
  formData.append("college_email_verified", String(data.college_email_verified));
  formData.append("phone_verified", String(data.phone_verified));
  
  // Append image file
  formData.append("id_card_image", data.id_card_image);
  
  const response = await fetch(`${API_BASE}/api/verification/senior/register/`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to submit registration" }));
    throw new Error(error.detail || "Failed to submit registration");
  }
  
  return response.json();
}
