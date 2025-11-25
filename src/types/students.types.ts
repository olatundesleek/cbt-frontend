export interface StudentClass {
  id: number;
  className: string;
  teacherId?: number;
  createdAt: string;
  courses: Array<{
    id: number;
    title: string;
    teacherId: number;
    description: string;
    createdAt: string;
  }>;
}

export interface Student {
  firstname: string;
  lastname: string;
  username: string;
  class: StudentClass;
}

export interface AdminStudentsResponse {
  success: boolean;
  message: string;
  data: Student[];
}
