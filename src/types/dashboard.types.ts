import { TestType } from '@/lib/constants';

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
  type: TestType;
  startTime: string;
  endTime: string;
  course: ActiveTestCourse;
  attemptsAllowed?: number;
  duration?: number;
  totalQuestions?: number;
  testState?: 'active' | 'scheduled' | 'completed';
  progress?: 'not-started' | 'in-progress' | null;
  sessionId: number | null;
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

export interface DashboardData {
  className: string;
  totalTests: number;
  activeTests: ActiveTest[];
  recentResults: RecentResults;
  studentName: string;
  completedTests: number;
  inProgressTests: number;
  totalScore: TotalScore;
  // notifications?: Notification[];

  // for admins
  classCount: number;
  courseCount: number;
  studentCount: number;
  teacherCount: number;
  testCount: number;
  adminName: {
    firstname: string;
    lastname: string;
  };
}

export interface AdminDashboardData {
  adminName: {
    firstname: string;
    lastname: string;
  };
  studentCount: number;
  teacherCount: number;
  testCount: number;
  classCount: number;
  courseCount: number;
  adminCount: number;
}

export interface TeacherDashboardData {
  teacherName: {
    firstname: string;
    lastname: string;
  };
  classCount: number;
  studentCount: number;
  testCount: number;
  courseCount: number;
}

export type DashboardResponse<T = DashboardData> = {
  success: boolean;
  message: string;
  data: T;
};

interface Courses {
  createdAt: string;
  description: string;
  id: number;
  teacherId: number;
  title: string;
}
export interface AllClasses {
  teacherId: number;
  createdAt: string;
  id: number;
  className: string;
  teacher: {
    firstname: string;
    id: number;
    lastname: string;
  };
  courses: Courses[];
}

export interface AllClassesResponse {
  data: AllClasses[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AllTeachers {
  firstname: string;
  id: number;
  lastname: string;
  courses: Courses[];
  teacherOf: { id: number; className: string }[];
}

export interface AllTeachersResponse {
  success: boolean;
  message: string;
  data: {
    data: AllTeachers[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface AllCourses {
  id: 1;
  title: string;
  createdAt: string;
  teacherId: number;
  description: string;
  teacher: Pick<AllTeachers, 'firstname' | 'lastname' | 'id'>;
}

export interface AllCoursesResponse {
  success: boolean;
  message: string;
  data: AllCourses[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface QuestionsInBank {
  answer: string;
  bankId: number;
  createdAt: string;
  id: number;
  marks: number;
  options: string[];
  text: string;
}

export interface AllQuestionBank {
  course: { title: string };
  courseId: number;
  createdAt: string;
  createdBy: number;
  description: string;
  id: number;
  questionBankName: string;
  questions: QuestionsInBank[];
  teacher: Pick<AllTeachers, 'firstname' | 'lastname'>;
  _count: { questions: number };
}

export interface AllQuestionBankResponse {
  success: boolean;
  message: string;
  data: {
    data: AllQuestionBank[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}