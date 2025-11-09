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
    }>;
    progress: {
      answeredCount: number;
      total: number;
    };
  };
}

export interface SubmitAnswerRequest {
  questionId: number | string;
  selectedOption: string;
}

// Submit multiple answers and get next questions
export interface SubmitAnswersAndGetNextRequest {
  sessionId: number | string;
  answers: Array<{
    questionId: number | string;
    selectedOption: string;
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
      };
    };

// Submit multiple answers and get previous questions
export interface SubmitAnswersAndGetPreviousRequest {
  sessionId: number | string;
  answers: Array<{
    questionId: number | string;
    selectedOption: string;
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
  testState: string;
  startTime: string;
  endTime: string;
  duration: string;
  attemptsAllowed: number;
  courseId: number;
  createdAt: string;
  course: TestCourse;
  bank: TestBank;
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
    questions: Array<{
      id: number;
      text: string;
      options: string; // may be JSON string or single-quoted array string
      marks: number;
      bankId: number;
      createdAt: string;
    }>;
    index: number; // 1-based index of the first question in the pair
    total: number;
    answered: Array<{
      questionId: number;
      questionNumber: number;
      isAnswered: boolean;
      previousAnswer?: string;
      answeredAt?: string;
    }>;
    finished: boolean;
    showSubmitButton: boolean;
  };
}
