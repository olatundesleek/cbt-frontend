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

export type TestType = 'EXAM' | 'TEST' | string;
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
  totalCourses: number;
  totalTests: number;
  testsCompleted: number;
  averageScore: number;
}

export interface StudentResultCoursesResponse {
  student: StudentInfo;
  courses: CourseResults[];
  overallStats: OverallStats;
}
