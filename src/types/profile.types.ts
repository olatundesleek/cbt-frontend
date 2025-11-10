/**
 * Profile Types
 * Type definitions for student profile data and components
 */

export interface StudentProfile {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  role: string;
  class: {
    id: number;
    className: string;
    teacherId: number;
    createdAt: string;
  };
  teacherOf: unknown[];
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
  address?: string;
}

export interface AcademicInformation {
  className: string;
  registeredCourses?: string[];
}

// Update profile payload/response
export interface UpdateProfileRequest {
  firstname: string;
  lastname: string;
  username: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
}

// Update password payload/response
export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
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
