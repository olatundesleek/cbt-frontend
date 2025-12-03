/**
 * Profile Types
 * Type definitions for student profile data and components
 */

export interface TeacherOfType {
  id: number;
  className: string;
}

export interface StudentProfile {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  class: {
    id: number;
    className: string;
    teacherId: number;
    createdAt: string;
  };
  teacherOf?: Array<TeacherOfType>;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
}

export interface PersonalInformation {
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  // address?: string;
}

export interface AcademicInformation {
  className: string;
}

// Update profile payload/response
export interface UpdateProfileRequest {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
}

// Update password payload/response
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormData extends PersonalInformation {
  address: string;
}
