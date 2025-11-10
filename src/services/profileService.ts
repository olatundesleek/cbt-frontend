import api from '@/lib/axios';
import {
  StudentProfile,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  PersonalInformation,
  PasswordChange,
} from '@/types/profile.types';

export const profileService = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<StudentProfile> => {
    const response = await api.get<ProfileResponse>('/profile');
    return response.data.data;
  },

  /**
   * Update profile (firstname, lastname, username)
   */
  updateProfile: async (
    payload: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> => {
    const response = await api.patch<UpdateProfileResponse>(
      '/profile',
      payload,
    );
    return response.data;
  },

  /**
   * Update password
   */
  updatePassword: async (
    payload: UpdatePasswordRequest,
  ): Promise<UpdatePasswordResponse> => {
    const response = await api.patch<UpdatePasswordResponse>(
      '/profile/password',
      payload,
    );
    return response.data;
  },

  /**
   * Update personal information
   */
  updatePersonalInfo: async (
    data: PersonalInformation,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.put('/profile/personal', data);
      return {
        success: true,
        message:
          response.data.message || 'Personal information updated successfully',
      };
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw new Error('Failed to update personal information');
    }
  },

  /**
   * Change password
   */
  changePassword: async (
    data: PasswordChange,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/profile/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      };
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Failed to change password');
    }
  },

  /**
   * Update profile image
   */
  updateProfileImage: async (
    imageFile: File,
  ): Promise<{ success: boolean; message: string; imageUrl?: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        message: response.data.message || 'Profile image updated successfully',
        imageUrl: response.data.imageUrl,
      };
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw new Error('Failed to update profile image');
    }
  },
};
