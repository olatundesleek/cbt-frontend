import { Question } from './../store/useTestAttemptStore';
import { TestType } from '@/lib/constants';
import { IconType } from 'react-icons/lib';

export type EditorAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'math'
  | 'color'
  | 'background'
  | 'text'
  | 'strike';

export interface EditorIcons {
  label: string;
  icon: IconType;
  action: EditorAction;
}

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
  totalCourses?: number;
  totalTests: number;
  testsCompleted: number;
  averageScore: number | string;
}

export interface RecentResult {
  course: CourseInfo;
  test: {
    id: number;
    title: string;
    type: TestType;
  };
  session: {
    id: number;
    score: number;
    status: string;
    startedAt: string;
    endedAt: string;
  };
}

export interface RecentResults {
  student: Student;
  results: RecentResult[];
  overallStats: OverallStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
  activeSessionCount: number;
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
  createdAt: Date;
  email: string;
  username: string;
  phoneNumber: string;
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
// Question Resource Types
export type ResourceType = 'diagram' | 'comprehension';

export interface DiagramResource {
  type: 'diagram';
  url: string;
  alt?: string;
  caption?: string;
}

export interface ComprehensionResource {
  type: 'comprehension';
  text: string;
  title?: string;
}

export type QuestionResource = DiagramResource | ComprehensionResource;

export interface QuestionWithResource extends QuestionsInBank {
  resource?: QuestionResource;
}

// Question bank image resources
export interface QuestionBankImage {
  id: number;
  url: string;
  questionBankId: number;
  description?: string;
}

export interface UploadQuestionBankImagesResponse {
  success: boolean;
  message: string;
  data: QuestionBankImage[];
}

export interface UpdateQuestionBankImageResponse {
  success: boolean;
  message: string;
  data: QuestionBankImage;
}

export interface DeleteQuestionBankImageResponse {
  success: boolean;
  message: string;
}

// Question bank comprehension resources
export interface QuestionBankComprehension {
  id: number;
  title: string;
  content: string;
  questionBankId: number;
}

export interface CreateComprehensionResponse {
  success: boolean;
  message: string;
  data: QuestionBankComprehension;
}

export interface UpdateComprehensionResponse {
  success: boolean;
  message: string;
  data: QuestionBankComprehension;
}

export interface DeleteComprehensionResponse {
  success: boolean;
  message: string;
}

export interface QuestionBankResources {
  comprehensions: QuestionBankComprehension[];
  images: QuestionBankImage[];
}

export interface GetQuestionBankResourcesResponse {
  success: boolean;
  message: string;
  data: QuestionBankResources;
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
  imageUrl?: string | null;
  comprehensionText?: string | null;
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
  totalObtainableMarks: number;
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
export interface QuestionBankDetailsResponse {
  success: boolean;
  message: string;
  data: AllQuestionBank;
}
