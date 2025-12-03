export type TestStatus = 'active' | 'scheduled' | 'completed';
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

// export const TEST_STATUS = {
//   ACTIVE: 'active' as TestStatus,
//   UPCOMING: 'upcoming' as TestStatus,
// };

// export const PROGRESS_STATUS = {
//   NOT_STARTED: 'not-started' as ProgressStatus,
//   IN_PROGRESS: 'in-progress' as ProgressStatus,
//   COMPLETED: 'completed' as ProgressStatus,
// };

// Centralized TestType union so the value can be reused throughout the app.
export type TestType = 'TEST' | 'EXAM' | 'PRACTICE';

export const TEST_TYPE = {
	TEST: 'TEST' as TestType,
	EXAM: 'EXAM' as TestType,
	PRACTICE: 'PRACTICE' as TestType,
};
