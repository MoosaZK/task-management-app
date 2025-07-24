'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { Board } from '@/types';
import { ROUTES } from '@/utils/constants';

interface BoardHeaderProps {
  board: Board;
  onEditBoard?: (board: Board) => void;
  onDeleteBoard?: (boardId: string) => void;
  onAddList?: () => void;
}

export function BoardHeader({ board, onEditBoard, onDeleteBoard, onAddList }: BoardHeaderProps) {
  const [showActions, setShowActions] = useState(false);

  const handleEditBoard = () => {
    onEditBoard?.(board);
  };

  const handleDeleteBoard = () => {
    if (window.confirm(`Are you sure you want to delete "${board.title}"? This will delete all lists and tasks.`)) {
      onDeleteBoard?.(board.id);
    }
  };

  const listCount = board.lists?.length || 0;
  const taskCount = board.lists?.reduce((acc, list) => acc + (list.tasks?.length || 0), 0) || 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Board Info */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <Link
            href={ROUTES.DASHBOARD}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Board Title and Description */}
          <div>
            <div className="flex items-center space-x-3">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleEditBoard}
              >
                {board.title}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{listCount} lists</span>
                <span>•</span>
                <span>{taskCount} tasks</span>
              </div>
            </div>
            {board.description && (
              <p 
                className="text-gray-600 mt-1 cursor-pointer hover:text-gray-800 transition-colors"
                onClick={handleEditBoard}
              >
                {board.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          <Button onClick={onAddList}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add List
          </Button>

          {/* Board Options */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowActions(!showActions)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleEditBoard}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Board
                  </button>
                  <button
                    onClick={handleDeleteBoard}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Board
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
} 