export interface StudentClass {
  id: number;
  className: string;
  teacherId?: number;
  createdAt: string;
}

export interface Student {
  firstname: string;
  lastname: string;
  username: string;
  class?: StudentClass | null;
  courses: Array<{
    id?: number;
    title?: string;
  }>;
}

export interface AdminStudentsResponse {
  success: boolean;
  message: string;
  data: Student[];
}
