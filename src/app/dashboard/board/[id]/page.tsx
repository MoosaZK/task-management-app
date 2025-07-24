'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BoardHeader } from '@/components/board/BoardHeader';
import { ListColumn } from '@/components/board/ListColumn';
import { CreateListModal } from '@/components/modals/CreateListModal';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { useAuth } from '@/contexts/AuthContext';
import { getBoardById, deleteBoard, deleteList, deleteTask } from '@/lib/database';
import { ROUTES } from '@/utils/constants';
import type { Board, List, Task } from '@/types';

interface BoardPageProps {
  params: { id: string };
}

export default function BoardPage({ params }: BoardPageProps) {
  return (
    <ProtectedRoute>
      <BoardContent boardId={params.id} />
    </ProtectedRoute>
  );
}

function BoardContent({ boardId }: { boardId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Load board data
  useEffect(() => {
    const loadBoard = async () => {
      if (!user) return;

      try {
        const boardData = await getBoardById(boardId);
        if (boardData) {
          setBoard(boardData);
        } else {
          setError('Board not found');
        }
      } catch (err) {
        setError('Failed to load board');
        console.error('Error loading board:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, [boardId, user]);

  // Handlers
  const handleEditBoard = (board: Board) => {
    // TODO: Open edit board modal
    console.log('Edit board:', board);
  };

  const handleDeleteBoard = async (boardId: string) => {
    const success = await deleteBoard(boardId);
    if (success) {
      router.push(ROUTES.DASHBOARD);
    }
  };

  const handleAddList = () => {
    setShowCreateListModal(true);
  };

  const handleListCreated = (newList: List) => {
    if (board) {
      setBoard({
        ...board,
        lists: [...(board.lists || []), { ...newList, tasks: [] }]
      });
    }
  };

  const handleEditList = (list: List) => {
    // TODO: Open edit list modal
    console.log('Edit list:', list);
  };

  const handleDeleteList = async (listId: string) => {
    const success = await deleteList(listId);
    if (success && board) {
      // Update board state by removing the deleted list
      setBoard({
        ...board,
        lists: board.lists?.filter(list => list.id !== listId) || []
      });
    }
  };

  const handleAddTask = (listId: string) => {
    setSelectedListId(listId);
    setSelectedTask(null);
    setShowCreateTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedListId(null);
    setShowCreateTaskModal(true);
  };

  const handleTaskCreated = (newTask: Task) => {
    if (board && selectedListId) {
      setBoard({
        ...board,
        lists: board.lists?.map(list => 
          list.id === selectedListId 
            ? { ...list, tasks: [...(list.tasks || []), newTask] }
            : list
        ) || []
      });
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    if (board) {
      setBoard({
        ...board,
        lists: board.lists?.map(list => ({
          ...list,
          tasks: list.tasks?.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          ) || []
        })) || []
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const success = await deleteTask(taskId);
    if (success && board) {
      // Update board state by removing the deleted task
      setBoard({
        ...board,
        lists: board.lists?.map(list => ({
          ...list,
          tasks: list.tasks?.filter(task => task.id !== taskId) || []
        })) || []
      });
    }
  };

  const closeModals = () => {
    setShowCreateListModal(false);
    setShowCreateTaskModal(false);
    setSelectedListId(null);
    setSelectedTask(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Board not found'}
          </h3>
          <p className="text-gray-600 mb-6">
            The board you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Board Header */}
      <BoardHeader
        board={board}
        onEditBoard={handleEditBoard}
        onDeleteBoard={handleDeleteBoard}
        onAddList={handleAddList}
      />

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto">
        <div className="p-6">
          {board.lists && board.lists.length > 0 ? (
            <div className="flex space-x-6 pb-6">
              {board.lists.map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onEditList={handleEditList}
                  onDeleteList={handleDeleteList}
                />
              ))}
              
              {/* Add List Button */}
              <div className="w-80 flex-shrink-0">
                <button
                  onClick={handleAddList}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                >
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="font-medium">Add another list</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            // Empty board state
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No lists yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first list to organize tasks
              </p>
              <button
                onClick={handleAddList}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateListModal
        isOpen={showCreateListModal}
        onClose={closeModals}
        boardId={boardId}
        onListCreated={handleListCreated}
      />

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={closeModals}
        listId={selectedListId || undefined}
        task={selectedTask || undefined}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  );
} 