import { supabase } from './supabase';
import type { User, Board, List, Task, CreateBoardData, CreateListData, CreateTaskData } from '@/types';

// User operations
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
};

// Board operations
export const getBoards = async (userId: string): Promise<Board[]> => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching boards:', error);
    return [];
  }

  return data || [];
};

export const getBoardById = async (boardId: string): Promise<Board | null> => {
  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      lists:lists(
        *,
        tasks:tasks(*)
      )
    `)
    .eq('id', boardId)
    .single();

  if (error) {
    console.error('Error fetching board:', error);
    return null;
  }

  // Sort lists by position and tasks by position within each list
  if (data.lists) {
    data.lists.sort((a: List, b: List) => a.position - b.position);
    data.lists.forEach((list: List) => {
      if (list.tasks) {
        list.tasks.sort((a: Task, b: Task) => a.position - b.position);
      }
    });
  }

  return data;
};

export const createBoard = async (boardData: CreateBoardData, userId: string): Promise<Board | null> => {
  const { data, error } = await supabase
    .from('boards')
    .insert({
      ...boardData,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating board:', error);
    return null;
  }

  return data;
};

export const updateBoard = async (boardId: string, updates: Partial<Board>): Promise<Board | null> => {
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .select()
    .single();

  if (error) {
    console.error('Error updating board:', error);
    return null;
  }

  return data;
};

export const deleteBoard = async (boardId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId);

  if (error) {
    console.error('Error deleting board:', error);
    return false;
  }

  return true;
};

// List operations
export const getListsByBoard = async (boardId: string): Promise<List[]> => {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('board_id', boardId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching lists:', error);
    return [];
  }

  return data || [];
};

export const createList = async (listData: CreateListData): Promise<List | null> => {
  // Get the current highest position for this board
  const { data: existingLists } = await supabase
    .from('lists')
    .select('position')
    .eq('board_id', listData.board_id)
    .order('position', { ascending: false })
    .limit(1);

  const newPosition = existingLists && existingLists.length > 0 
    ? existingLists[0].position + 1 
    : 0;

  const { data, error } = await supabase
    .from('lists')
    .insert({
      ...listData,
      position: newPosition
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating list:', error);
    return null;
  }

  return data;
};

export const updateList = async (listId: string, updates: Partial<List>): Promise<List | null> => {
  const { data, error } = await supabase
    .from('lists')
    .update(updates)
    .eq('id', listId)
    .select()
    .single();

  if (error) {
    console.error('Error updating list:', error);
    return null;
  }

  return data;
};

export const deleteList = async (listId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);

  if (error) {
    console.error('Error deleting list:', error);
    return false;
  }

  return true;
};

export const reorderLists = async (boardId: string, listIds: string[]): Promise<boolean> => {
  try {
    const updates = listIds.map((listId, index) => ({
      id: listId,
      position: index
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('lists')
        .update({ position: update.position })
        .eq('id', update.id)
        .eq('board_id', boardId);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error reordering lists:', error);
    return false;
  }
};

// Task operations
export const getTasksByList = async (listId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('list_id', listId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data || [];
};

export const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
  // Get the current highest position for this list
  const { data: existingTasks } = await supabase
    .from('tasks')
    .select('position')
    .eq('list_id', taskData.list_id)
    .order('position', { ascending: false })
    .limit(1);

  const newPosition = existingTasks && existingTasks.length > 0 
    ? existingTasks[0].position + 1 
    : 0;

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...taskData,
      position: newPosition
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  return data;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  return data;
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }

  return true;
};

export const moveTask = async (
  taskId: string, 
  newListId: string, 
  newPosition: number
): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .update({
      list_id: newListId,
      position: newPosition
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error moving task:', error);
    return false;
  }

  return true;
};

export const reorderTasks = async (listId: string, taskIds: string[]): Promise<boolean> => {
  try {
    const updates = taskIds.map((taskId, index) => ({
      id: taskId,
      position: index
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('tasks')
        .update({ position: update.position })
        .eq('id', update.id)
        .eq('list_id', listId);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return false;
  }
};

// Utility function to create sample board for new users
export const createSampleBoard = async (userId: string): Promise<Board | null> => {
  const { data, error } = await supabase.rpc('create_sample_board', {
    user_id: userId
  });

  if (error) {
    console.error('Error creating sample board:', error);
    return null;
  }

  // Return the created board
  return getBoardById(data);
}; 