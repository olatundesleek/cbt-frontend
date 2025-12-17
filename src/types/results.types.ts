export interface StudentClassInfo {
  id: number;
  className: string;
}

export interface StudentInfo {
  id: number;
  name: string;
  class: StudentClassInfo;
}

export interface CourseInfo {
  id: number;
  title: string;
  description: string;
}

export interface CourseStats {
  totalTests: number;
  completedTests: number;
  averageScore: number; // raw average (backend-provided)
}

import type { TestType as TestTypeConst } from '@/lib/constants';

export type TestType = TestTypeConst;
export type TestSessionStatus = 'PASSED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING' | string;

export interface TestSessionSummary {
  score: number | null;
  status: TestSessionStatus;
  startedAt: string; // ISO
  endedAt: string; // ISO
}

export interface TestSummary {
  id: number;
  title: string;
  type: TestType;
  session: TestSessionSummary;
}

export interface CourseResults {
  course: CourseInfo;
  stats: CourseStats;
  tests: TestSummary[];
}

export interface OverallStats {
  totalTests: number;
  testsCompleted: number;
  averageScore: number | string;
}

export interface StudentResultCoursesResponse {
  student: StudentInfo;
  /**
   * New backend shape: a flat list of results
   * Each entry contains course, test and a specific session summary
   */
  results: Array<{
    course: CourseInfo;
    test: {
      id: number;
      title: string;
      type: TestType;
    };
    session: {
      id: number;
      score: number;
      status: TestSessionStatus;
      startedAt: string;
      endedAt: string;
    };
  }>;
  overallStats: OverallStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export interface StudentResultDownloadResponse {
  success: boolean;
  message: string;
  details: string | null;
}

export interface ResultEntry {
  course: {
    id: number;
    title: string;
    description: string;
    teacherId: number;
    createdAt: string;
  };
  stats: {
    totalTests: number;
    completedTests: number;
    averageScore: number;
    highestScore: number;
  };
  tests: Array<{
    id: number;
    title: string;
    type: TestType;
    session: {
      id: number;
      score: number;
      status: string;
      startedAt: string;
      endedAt: string;
    };
    student: {
      id: number;
      firstname: string;
      lastname: string;
      class: {
        id: number;
        className: string;
        teacherId: number;
        createdAt: string;
      };
    };
    course: {
      id: number;
      title: string;
      description: string;
      teacherId: number;
      createdAt: string;
    };
  }>;
}

export interface getAllResultAdminResponse {
  success: boolean;
  message: string;
  data: {
    courses: ResultEntry[];
    overallStats: {
      totalCourses: number;
      totalTests: number;
      testsCompleted: number;
      averageScore: number;
      highestScore: number;
      lowestScore: number;
    };

    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface TestSessionDetail {
  id: number;
  startedAt: string;
  endedAt: string;
  score: number | null;
  status: string;
}

export interface SingleResultStudent {
  id: number;
  firstname?: string;
  lastname?: string;
  name?: string;
  class?: {
    id: number;
    className: string;
    teacherId?: number;
    createdAt?: string;
  };
}

export interface SingleResultTest {
  id: number;
  title: string;
  type: TestType;
  showResult?: boolean;
}

export interface AdminSingleResultResponse {
  success: boolean;
  message: string;
  data: {
    session: TestSessionDetail;
    student: SingleResultStudent;
    test: SingleResultTest;
  answers?: Array<Record<string, unknown>>;
    canViewAnswers?: boolean;
  };
}