import { TestStatus } from '@/lib/constants';
import type { TestType as TestTypeConst } from '@/lib/constants';

export interface StartTestSessionRequest {
  testId: number | string;
}

export interface StartTestSessionResponse {
  success: boolean;
  message: string;
  data: {
    session: {
      id: number;
      studentId: number;
      testId: number;
      attemptNo: number;
      status: string;
      startedAt: string;
      endedAt: string | null;
      score: number | null;
    };
    questions: Array<{
      id: number;
      text: string;
      options: string; // JSON string, will need to parse
      marks: number;
      bankId: number;
      createdAt: string;
      displayNumber: number;
      selectedOption: string | null;
      imageUrl?: string | null;
      comprehensionText?: string | null;
    }>;
    progress: {
      answeredCount: number;
      total: number;
    };
    student: {
      id: number;
      username: string;
      firstname: string;
      lastname: string;
    };
    course: {
      courseTitle: string;
      testTitle: string;
    };
  };
}
/*{
    "courseTitle": "CHM100",
    "testTitle": "Chemistry Practice Test"
} */

export interface SubmitAnswerRequest {
  questionId: number | string;
  selectedOption: string;
}

// Submit multiple answers and get next questions
export interface SubmitAnswersAndGetNextRequest {
  sessionId: number | string;
  answers: Array<{
    questionId: number | string;
    selectedOption?: string; // optional when user didn't choose an answer
  }>;
}

export type SubmitAnswersAndGetNextResponse =
  | {
      success: boolean;
      message: string;
      data: {
        finished: false;
        showSubmitButton: boolean;
        nextQuestions: Array<{
          id: number;
          text: string;
          options: string; // JSON string
          marks: number;
          bankId: number;
          createdAt: string;
          displayNumber: number;
          selectedOption: null | string;
          imageUrl?: string | null;
          comprehensionText?: string | null;
        }>;
        progress: {
          answeredCount: number;
          total: number;
        };
      };
    }
  | {
      success: boolean;
      message: string;
      data: {
        finished: true;
        data: {
          id: number;
          studentId: number;
          testId: number;
          attemptNo: number;
          status: string;
          startedAt: string;
          endedAt: string;
          score: number;
          totalMarks: number;
          test: {
            id: number;
            title: string;
            type: TestTypeConst;
            testState: string;
            showResult: boolean;
            startTime: string;
            endTime: string;
            duration: number;
            attemptsAllowed: number;
            courseId: number;
            bankId: number;
            createdBy: number;
            createdAt: string;
          };
          answers: Array<{
            id: number;
            questionId: number;
            selectedOption: string;
            isCorrect: boolean;
            correctAnswer: string;
            question: {
              id: number;
              text: string;
              marks: number;
              bankId: number;
              createdAt: string;
              options: string[];
            };
          }>;
        };
      };
    }
  | {
      finished: boolean;
      data: {
        id: number;
        testId: number;
        studentId: number;
        status: TestStatus;
        startedAt: string;
        endedAt: string;
        type: TestTypeConst;
      };
    };

// Submit multiple answers and get previous questions
export interface SubmitAnswersAndGetPreviousRequest {
  sessionId: number | string;
  answers: Array<{
    questionId: number | string;
    selectedOption?: string; // optional when user didn't choose an answer
  }>;
}

export interface SubmitAnswersAndGetPreviousResponse {
  success: boolean;
  message: string;
  data: {
    finished: boolean;
    showSubmitButton: boolean;
    previousQuestions: Array<{
      id: number;
      text: string;
      options: string; // JSON string or single-quoted array string
      marks: number;
      bankId: number;
      createdAt: string;
      displayNumber: number;
      selectedOption: string | null;
      imageUrl?: string | null;
      comprehensionText?: string | null;
    }>;
    progress: {
      answeredCount: number;
      total: number;
    };
  };
}

// Use 'unknown' for now to avoid lint error
export type SubmitAnswerResponse = unknown;

// Submit test session response
export interface SubmitTestSessionResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    studentId: number;
    testId: number;
    attemptNo: number;
    status: string;
    startedAt: string;
    endedAt: string;
    score: number;
    totalMarks: number;
    test: {
      id: number;
      title: string;
      type: TestTypeConst;
      testState: string;
      showResult: boolean;
      startTime: string;
      endTime: string;
      duration: number;
      attemptsAllowed: number;
      courseId: number;
      bankId: number;
      createdBy: number;
      createdAt: string;
    };
    answers: Array<{
      id: number;
      questionId: number;
      selectedOption: string;
      isCorrect: boolean;
      correctAnswer: string;
      question: {
        id: number;
        text: string;
        marks: number;
        bankId: number;
        createdAt: string;
        options: string[];
      };
    }>;
  };
}
export interface TestCourse {
  title: string;
}

export interface TestBank {
  _count: {
    questions: number;
  };
}

export interface Test {
  id: number;
  title: string;
  type: TestTypeConst;
  startTime: string;
  endTime: string;
  duration: string;
  attemptsAllowed: number;
  courseId: number;
  createdAt: string;
  course: TestCourse;
  bank: TestBank;
  testState: 'active' | 'scheduled' | 'completed';
  progress?: 'not-started' | 'in-progress' | null;
  sessionId: number | null;
}

export interface TestsResponse {
  success: boolean;
  message: string;
  data: {
    data: Test[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Fetch questions by question number (pair containing that question)
export interface FetchQuestionsByNumberRequest {
  sessionId: number | string;
  questionNumber: number;
}

export interface FetchQuestionsByNumberResponse {
  success: boolean;
  message: string;
  data: {
    nextQuestions: Array<{
      id: number;
      text: string;
      options: string; // may be JSON string or single-quoted array string
      marks: number;
      bankId: number;
      createdAt: string;
      selectedOption: null | string;
      displayNumber: number;
      imageUrl?: string | null;
      comprehensionText?: string | null;
    }>;
    progress: {
      answeredCount: number;
      total: number;
    };

    finished: boolean;
    showSubmitButton: boolean;
  };
}

// Registered Courses
export interface CourseTeacher {
  id: number;
  firstname: string;
  lastname: string;
}

export interface RegisteredCourse {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  createdAt: string;
  teacher: CourseTeacher;
}

// API returns direct array, not wrapped in success/message/data
export type RegisteredCoursesResponse = {
  data: RegisteredCourse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export interface AdminTestsResponse {
  success: boolean;
  message: string;
  data: {
    data: {
      id: number;
      title: string;
      type: string;
      testState: string;
      showResult: boolean;
      startTime: string | null;
      endTime: string | null;
      duration: number;
      attemptsAllowed: number;
      passMark: number;
      courseId: number;
      bankId: number;
      createdBy: {
        id: number;
        firstname: string;
        lastname: string;
        username: string;
      };
      createdAt: string;
      course: {
        title: string;
        classes: {
          id: number;
          className: string;
          teacherId: number;
          createdAt: string;
        }[];
      };
      bank: {
        _count: {
          questions: number;
        };
      };
      _count: {
        sessions: number;
      };
    }[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Create Test request payload
export interface CreateTestRequest {
  title: string;
  type: TestTypeConst;
  testState: 'active' | 'scheduled' | 'completed' | string;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  courseId: number;
  bankId: number;
  attemptsAllowed: number;
  passMark: number;
}

export interface CreateTestResponse {
  success: boolean;
  message: string;
  data: AdminTestsResponse['data']['data'][number];
}
