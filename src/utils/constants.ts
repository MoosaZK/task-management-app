// Task priorities
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

// Task statuses
export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

// Priority colors for UI
export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
} as const;

// Status colors for UI
export const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
} as const;

// App routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  BOARD: '/dashboard/board',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup'
} as const; 