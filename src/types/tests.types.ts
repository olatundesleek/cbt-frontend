import { TestStatus } from '@/lib/constants';

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
          test: {
            id: number;
            title: string;
            type: 'TEST';
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
            question: {
              id: number;
              text: string;
              marks: number;
              bankId: number;
              createdAt: string;
              options: string[];
              correctAnswer: string;
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
        type: 'EXAM';
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
    test: {
      id: number;
      title: string;
      type: 'TEST' | 'EXAM';
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
      question: {
        id: number;
        text: string;
        marks: number;
        bankId: number;
        createdAt: string;
        options: string[];
        correctAnswer: string;
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
  type: string;
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
  data: Test[];
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
export type RegisteredCoursesResponse = RegisteredCourse[];
