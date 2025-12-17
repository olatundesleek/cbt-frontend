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
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phoneNumber: string;
  class: StudentClass;
  createdAt: Date;
}

export interface AdminStudentsResponse {
  success: boolean;
  message: string;
  data: {
    data: Student[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}


export interface AssignToClassResponse {
  success: true;
  message: string;
  data: Student;
}