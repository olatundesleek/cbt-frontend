import { dashboardServices } from "@/services/dashboardService";
import type {
  DashboardResponse,
  DashboardData,
  UploadQuestionBankImagesResponse,
  UpdateQuestionBankImageResponse,
  DeleteQuestionBankImageResponse,
  CreateComprehensionResponse,
  UpdateComprehensionResponse,
  DeleteComprehensionResponse,
  GetQuestionBankResourcesResponse,
} from '@/types/dashboard.types';
import type { PaginationParams } from '@/types/pagination.types';
import { AppError } from '@/types/errors.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import getErrorDetails from '@/utils/getErrorDetails';

export default function useDashboard<T = DashboardData>() {
  const queryResponse = useQuery<DashboardResponse<T>, AppError>({
    queryFn: () => dashboardServices.getDashboard<T>(),
    queryKey: ['dashboard'],
  });

  return queryResponse;
}

export const useGetClasses = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllClasses(params),
    queryKey: ['classes', params],
  });

  return queryResponse;
};

export const useGetTeachers = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllTeacher(params),
    queryKey: ['teachers', params],
  });

  return queryResponse;
};

export const useGetCourses = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllCourses(params),
    queryKey: ['courses', params],
  });

  return queryResponse;
};

export const useGetQuestionBank = (params?: PaginationParams) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getAllQuestionBank(params),
    queryKey: ['questionBanks', params],
  });

  return queryResponse;
};

export const useGetQuestionsInBank = (bankId: string) => {
  const queryResponse = useQuery({
    queryFn: () => dashboardServices.getQuestionsInBank(bankId),
    queryKey: ['questionBanks', bankId],
    enabled: !!bankId,
  });

  return queryResponse;
};

export const useGetQuestionBankResources = (bankId: string | number) => {
  const queryResponse = useQuery<GetQuestionBankResourcesResponse, AppError>({
    queryFn: () => dashboardServices.getQuestionBankResources(bankId),
    queryKey: ['questionBankResources', bankId],
    enabled: !!bankId,
  });

  return queryResponse;
};

export const useUploadQuestionBankImages = (bankId: string) => {
  return useMutation<UploadQuestionBankImagesResponse, AppError, FormData>({
    mutationFn: (formData) =>
      dashboardServices.uploadQuestionBankImages(bankId, formData),
    mutationKey: ['questionBankImages', 'upload', bankId],
    onSuccess: (res) => {
      toast.success(res.message || 'Images uploaded successfully');
    },
    onError: (err) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
};

export const useUpdateQuestionBankImage = () => {
  return useMutation<
    UpdateQuestionBankImageResponse,
    AppError,
    { imageId: string; formData: FormData }
  >({
    mutationFn: ({ imageId, formData }) =>
      dashboardServices.updateQuestionBankImage(imageId, formData),
    mutationKey: ['questionBankImages', 'update'],
    onSuccess: (res) => {
      toast.success(res.message || 'Image updated successfully');
    },
    onError: (err) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
};

export const useDeleteQuestionBankImage = () => {
  return useMutation<DeleteQuestionBankImageResponse, AppError, string>({
    mutationFn: (imageId) => dashboardServices.deleteQuestionBankImage(imageId),
    mutationKey: ['questionBankImages', 'delete'],
    onSuccess: (res) => {
      toast.success(res.message || 'Image deleted');
    },
    onError: (err) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
};

export const useCreateComprehension = (bankId: string | number) => {
  return useMutation<
    CreateComprehensionResponse,
    AppError,
    { title: string; content: string }
  >({
    mutationFn: (payload) =>
      dashboardServices.createQuestionBankComprehension(bankId, payload),
    mutationKey: ['questionBankComprehensions', 'create', bankId],
    onSuccess: (res) => {
      toast.success(res.message || 'Comprehension created');
    },
    onError: (err) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
};

export const useUpdateComprehension = () => {
  return useMutation<
    UpdateComprehensionResponse,
    AppError,
    {
      comprehensionId: string | number;
      payload: { title?: string; content?: string };
    }
  >({
    mutationFn: ({ comprehensionId, payload }) =>
      dashboardServices.updateQuestionBankComprehension(
        comprehensionId,
        payload,
      ),
    mutationKey: ['questionBankComprehensions', 'update'],
    onSuccess: (res) => {
      toast.success(res.message || 'Comprehension updated');
    },
    onError: (err) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
};

export const useDeleteComprehension = () => {
  return useMutation<DeleteComprehensionResponse, AppError, string | number>({
    mutationFn: (comprehensionId) =>
      dashboardServices.deleteQuestionBankComprehension(comprehensionId),
    mutationKey: ['questionBankComprehensions', 'delete'],
    onSuccess: (res) => {
      toast.success(res.message || 'Comprehension deleted');
    },
    onError: (err) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
};
