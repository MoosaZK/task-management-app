// Database entity types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  lists?: List[];
}

export interface List {
  id: string;
  title: string;
  board_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  list_id: string;
  position: number;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Form types
export interface CreateBoardData {
  title: string;
  description?: string;
}

export interface CreateListData {
  title: string;
  board_id: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  list_id: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
}

// UI state types
export interface DragItem {
  id: string;
  type: 'task' | 'list';
  sourceId: string;
  destinationId?: string;
}

export interface ModalState {
  isOpen: boolean;
  type: 'create-board' | 'create-list' | 'create-task' | 'edit-task' | null;
  data?: any;
} 