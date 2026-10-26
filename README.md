# CBT Frontend

The CBT Frontend is a Next.js 16 application for a computer-based testing
platform. It provides separate experiences for students, administrators, and
teachers:

- Students can sign in, view available tests and registered courses, take timed
  exams, review corrections, inspect results, and manage their profile.
- Administrators can manage classes, courses, questions, tests, students,
  teachers, results, notifications, login sessions, system settings, and their
  profile.
- Teachers receive a smaller management workspace focused on tests, students,
  results, the question bank, and their profile.

This repository contains the frontend only. It communicates with the CBT API
over HTTP and uses Socket.IO for live exam-session events such as timer updates
and time-up notifications.

## Contents

- [Technology](#technology)
- [Getting started](#getting-started)login-sessions/ directory
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Application structure](#application-structure)
- [Routes](#routes)
- [Authentication and route protection](#authentication-and-route-protection)
- [Exam attempt flow](#exam-attempt-flow)
- [Data fetching and state](#data-fetching-and-state)
- [Backend integration](#backend-integration)
- [Pagination](#pagination)
- [Styling and UI conventions](#styling-and-ui-conventions)
- [Production build](#production-build)
- [Troubleshooting](#troubleshooting)
- [Known limitations](#known-limitations)

## Technology

- **Next.js 16** with the App Router and React Server Components
- **React 19** and TypeScript in strict mode
- **Tailwind CSS 4** through the PostCSS integration
- **TanStack React Query** for server-state fetching and caching
- **Zustand** for lightweight client-side state
- **Axios** for API requests
- **Socket.IO Client** for real-time exam-session events
- **React Hook Form** and Yup/resolvers for forms and validation
- **Recharts** for dashboard visualizations
- **React Quill** and **KaTeX** for rich-text and mathematical content
- **react-hot-toast** for user feedback

## Getting started

### Prerequisites

- Node.js compatible with the Next.js 16 toolchain
- npm
- A running CBT API service
- A running Socket.IO service for live exam sessions

### Installation

```bash
git clone <repository-url>
cd cbt-frontend
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present in your checkout, create `.env.local`
manually using the variables in [Environment variables](#environment-variables).

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The development command uses the Webpack bundler:

```text
next dev --webpack
```

## Environment variables

The frontend reads the following public variables:

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for HTTP API requests and server-side system-settings requests | `http://localhost:4000/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Recommended | Socket.IO server URL used for live exam sessions | `http://localhost:4000` |

Example:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

`NEXT_PUBLIC_*` values are exposed to browser bundles. Do not put private API
keys, database credentials, or other secrets in these variables.

The root layout requests `/system-settings` without caching on every relevant
render. Those settings provide dynamic metadata and hydrate application-wide
configuration such as the institution name, login banner, theme values, and
maintenance status.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Webpack development server |
| `npm run build` | Create a production Next.js build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript without emitting files |
| `npm run upgrade` | Run the Next.js upgrade command |

Before opening a pull request, run:

```bash
npm run lint
npm run type-check
npm run build
```

## Application structure

```text
.
├── public/
│   └── images/                    # Login and static image assets
├── src/
│   ├── app/                      # App Router routes, layouts, and API routes
│   ├── components/               # Shared UI, layout, feedback, and editor components
│   ├── context/                  # React contexts, including Socket.IO
│   ├── features/                 # Feature-specific pages, components, hooks, and queries
│   ├── hooks/                    # Shared client hooks
│   ├── lib/                      # Axios, Socket.IO, constants, and internal API helpers
│   ├── middleware.ts             # Cookie and role-based navigation rules
│   ├── providers/                # React Query and toast providers
│   ├── services/                 # Typed API service modules
│   ├── store/                    # Zustand stores
│   ├── types/                    # Shared TypeScript API/domain types
│   └── utils/                    # Error and pagination helpers
├── docs/                         # Pagination documentation
├── next.config.ts
├── package.json
└── tsconfig.json
```

The code uses the `@/*` TypeScript alias for imports from `src`. Feature code
is colocated under `src/features`, while cross-feature primitives live under
`src/components`, `src/hooks`, `src/services`, and `src/types`.

## Routes

### Public and student routes

| Route | Purpose |
| --- | --- |
| `/` | Student login |
| `/dashboard` | Student dashboard and recent activity |
| `/tests` | Available tests and registered courses |
| `/tests/[id]` | Test instructions/start view |
| `/tests/[id]/summary` | Summary for a test attempt |
| `/tests/ended` | Ended-test state |
| `/attempt/[sessionId]` | Active exam session |
| `/corrections` | Review answers/corrections |
| `/results` | Student results and performance |
| `/profile` | Student profile and password management |

### Admin and teacher routes

Admin and teacher users use the `/admin` route hierarchy. The server layout
selects the appropriate shell from the `role` cookie:

| Route | Admin | Teacher | Purpose |
| --- | :---: | :---: | --- |
| `/admin/login` | Yes | Yes | Admin/teacher sign-in screen |
| `/admin/dashboard` | Yes | Yes | Management dashboard |
| `/admin/classes` | Yes | No | Class management |
| `/admin/classes/[id]` | Yes | No | Class details |
| `/admin/courses` | Yes | No | Course management |
| `/admin/questions` | Yes | Yes | Question bank |
| `/admin/questions/[id]` | Yes | Yes | Question editing/creation |
| `/admin/tests` | Yes | Yes | Test management |
| `/admin/exam` | Yes | No | Exam administration |
| `/admin/students` | Yes | Yes | Student management |
| `/admin/teachers` | Yes | No | Teacher management |
| `/admin/results` | Yes | Yes | Results management |
| `/admin/notifications` | Yes | No | Notifications |
| `/admin/login-sessions` | Yes | No | Login-session monitoring |
| `/admin/settings` | Yes | No | System settings |
| `/admin/profile` | Yes | Yes | Staff profile |

### Internal frontend API routes

These are Next.js route handlers used by the frontend for cookie/session
operations:

- `POST /api/auth/set-auth-cookie` — sets the `httpOnly` `token` and `role`
  cookies after authentication.
- `GET /api/auth/status` — checks authentication status.
- `POST /api/auth/client-logout` — clears the local authentication session.

## Authentication and route protection

Authentication is represented in cookies:

- `token` stores the authentication token and is marked `httpOnly`.
- `role` stores the normalized role (`student`, `admin`, or `teacher`) and is
  also marked `httpOnly`.

The middleware in `src/middleware.ts` applies these rules:

1. Unauthenticated users may access `/`; other protected pages redirect to `/`.
2. `/admin/*` is restricted to `admin` and `teacher` roles.
3. Logged-in students visiting `/` are redirected to `/dashboard`.
4. Logged-in administrators and teachers visiting `/` are redirected to
   `/admin/dashboard`.
5. Administrators and teachers attempting to use non-admin paths are redirected
   into the `/admin` hierarchy.

The admin dashboard layout performs a second server-side role check with
`next/headers` cookies before rendering either `AdminShell` or `TeacherShell`.
This keeps role-specific navigation in separate shells rather than rendering
student/admin variants inside a shared student route.

When the Axios client receives a 401 response, it requests the local logout
route and redirects the browser to `/` when necessary.

## Exam attempt flow

The student test flow is split into an instruction/list view and a dedicated
attempt route:

1. A student opens `/tests` and selects an available test.
2. The client starts a session through `POST /sessions/start/:testId`.
3. The active session is rendered at `/attempt/:sessionId`.
4. Questions are fetched by question number.
5. Answers can be submitted individually or while navigating to the next or
   previous question.
6. The session can be finished through `POST /sessions/:sessionId/finish`.
7. The result and correction views display the completed attempt.

The Socket.IO exam-session hook manages:

- Connecting and joining a session room.
- Rejoining after a reconnect.
- `test_started` events.
- `time_left` events, converting milliseconds to displayed seconds.
- `time_up` events and timeout/submitted/force reasons.
- Leaving or explicitly finishing a session.

The frontend expects the Socket.IO server to emit the event payloads described
by `src/features/tests/hooks/useExamSessionSocket.ts`.

## Data fetching and state

### API services

Typed service modules under `src/services` keep request details out of UI
components:

- `authService.ts` — authentication
- `dashboardService.ts` — dashboard data
- `notificationService.ts` — notifications
- `profileService.ts` — profile updates
- `resultsService.ts` — results and downloads
- `settingsService.ts` — system settings
- `studentsService.ts` — student management
- `testsService.ts` — tests, sessions, questions, and answers

All services use the shared Axios client in `src/lib/axios.ts`, which applies
the configured API base URL, credentials, and common error handling.

### React Query

`QueryProvider` creates the shared TanStack Query client with:

- A one-minute default query `staleTime`.
- Window-focus refetching disabled.
- React Query Devtools available during development.

### Zustand stores

The stores cover focused client state:

- `useUserStore` — current display name and role used by management shells.
- `useSystemSettingsStore` — hydrated system configuration and maintenance
  status.
- `useTestStore` — test-list and test-management state.
- `useTestAttemptStore` — active attempt state.
- `useTestResultStore` — result and correction state.

### Providers

The root layout renders the toast provider and system-settings hydrator.
Dashboard and authentication surfaces wrap their content with
`GlobalProviders`, which supplies React Query and Socket.IO context.

## Backend integration

The frontend currently calls endpoints including:

```text
GET    /system-settings
POST   /sessions/start/:testId
GET    /sessions/:sessionId/questions/:questionNumber
POST   /sessions/:sessionId/questions/:questionId/submit
POST   /sessions/questions-next/answer
POST   /sessions/questions-previous/answer
POST   /sessions/:sessionId/finish
POST   /sessions/end-all-sessions
GET    /tests
POST   /tests
PATCH  /tests/:testId
DELETE /tests/:testId
GET    /courses
```

The complete request and response contracts are defined in
`src/types/*.types.ts`. If an API contract changes, update the corresponding
type, service, hook, and affected UI together.

## Pagination

The application supports both client-side and server-side pagination through
shared hooks and types:

- `useClientPagination` for already-loaded collections.
- `useServerPagination` for API-backed lists.
- `src/types/pagination.types.ts` for request/response types.
- `src/utils/pagination.ts` for shared pagination helpers.

More detailed guidance is available in:

- [`docs/PAGINATION.md`](docs/PAGINATION.md)
- [`docs/PAGINATION_QUICKSTART.md`](docs/PAGINATION_QUICKSTART.md)
- [`docs/PAGINATION_MIGRATION.md`](docs/PAGINATION_MIGRATION.md)
- [`PAGINATION_SUMMARY.md`](PAGINATION_SUMMARY.md)

## Styling and UI conventions

- Tailwind utility classes are the primary styling mechanism.
- Shared primitives are in `src/components/ui`.
- Inter is loaded with `next/font/google`.
- Theme and system color values are applied through global styles and hydrated
  settings.
- Login and dashboard layouts are responsive; large-screen login pages display
  an image panel while smaller screens use the form alone.
- KaTeX is loaded for mathematical content and React Quill styles are loaded
  globally for rich-text editing.

When adding a component, prefer a server component unless it needs browser
interactivity, hooks, or client-only state. Keep feature-specific components
under the relevant feature directory and extract reusable primitives only when
they are used across features.

## Production build

Build and run the production application:

```bash
npm run build
npm run start
```

The current Next configuration:

- Enables the React Compiler.
- Disables Next image optimization (`images.unoptimized: true`), so deployment
  does not require the Next image optimization service.
- Uses dynamic/no-store behavior in the root layout because system settings and
  metadata are fetched from the API.

Ensure the production API and Socket.IO URLs are configured before building.
Because the values are public environment variables, they are embedded into
the client bundle at build time; rebuild after changing them.

## Troubleshooting

### The app redirects to `/`

Check that the `token` cookie exists and that its `role` value is one of
`student`, `admin`, or `teacher`. Also verify that the API login flow calls
`/api/auth/set-auth-cookie` successfully.

### System settings fail during startup

Verify `NEXT_PUBLIC_API_URL` and confirm that the API exposes
`GET /system-settings`. The root layout requests this endpoint before rendering
the application.

### Exam timers do not update

Verify `NEXT_PUBLIC_SOCKET_URL`, Socket.IO CORS/credential configuration, and
that the client can join the session room. Inspect browser logs for connection
or reconnect errors.

### API requests fail with a network error

Confirm the API is running, the base URL does not contain an incorrect path or
trailing route, and that the API allows credentialed requests from the frontend
origin.

## Known limitations

- The admin/teacher login page currently displays a sign-in form but its submit
  handler only shows a success toast; it does not yet call the authentication
  hook/service used by the student login.
- The root layout depends on the system-settings endpoint being available
  during rendering.
- There is no automated test script in `package.json`; validation currently
  relies on linting, type-checking, and the production build.
- The frontend assumes the API and Socket.IO event contracts documented by the
  service modules and exam-session hook.

## Contribution guidelines

1. Create a focused branch for the change.
2. Keep route-specific code in the appropriate App Router or feature folder.
3. Add or update TypeScript types when API data changes.
4. Preserve the student, admin, and teacher route boundaries.
5. Run linting, type-checking, and a production build before submitting a
   change.
6. Update this README or the relevant `docs/` page when setup, routes, or
   developer workflows change.
