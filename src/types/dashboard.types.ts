export interface Course {
  subject: string;
  score: string;
  date: string;
  status: 'passed' | 'failed';
}

export interface CourseInfo {
  id: number;
  title: string;
  description: string;
}

export interface CourseStats {
  totalTests: number;
  completedTests: number;
  averageScore: number;
}

export interface TestSession {
  score: number | 'unrealesed';
  startedAt: string;
  endedAt: string;
  status: 'failed' | 'passed' | 'null';
}

export interface CourseTest {
  id: number;
  title: string;
  description: string;
  session: TestSession;
  type: 'EXAM' | 'TEST';
}

export interface CourseWithTests {
  course: CourseInfo;
  stats: CourseStats;
  tests: CourseTest[];
}

export interface ActiveTestCourse {
  title: string;
}

export interface ActiveTest {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  course: ActiveTestCourse;
  attemptsAllowed?: number;
  duration?: number;
  totalQuestions?: number;
  status?: 'active' | 'scheduled' | 'completed';
  progress?: 'not-started' | 'in-progress';
}

export interface StudentClass {
  id: number;
  className: string;
}

export interface Student {
  id: number;
  name: string;
  class: StudentClass;
}

export interface OverallStats {
  totalCourses: number;
  totalTests: number;
  testsCompleted: number;
  averageScore: number;
}

export interface RecentResults {
  student: Student;
  courses: CourseWithTests[];
  overallStats: OverallStats;
}

export interface TotalScore {
  _sum: {
    score: number | null;
  };
}

export interface Notification {
  id: number;
  message: string;
  time: string;
}

export interface DashboardData {
  className: string;
  totalTests: number;
  activeTests: ActiveTest[];
  recentResults: RecentResults;
  studentName: string;
  completedTests: number;
  inProgressTests: number;
  totalScore: TotalScore;
  notifications?: Notification[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
