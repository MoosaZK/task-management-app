'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { CreateBoardModal } from '@/components/modals/CreateBoardModal';
import { getBoards } from '@/lib/database';
import type { Board } from '@/types';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, userProfile, signOut } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      if (user) {
        const userBoards = await getBoards(user.id);
        setBoards(userBoards);
      }
      setLoading(false);
    };

    loadBoards();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleBoardCreated = (newBoard: Board) => {
    setBoards(prev => [newBoard, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Task<span className="text-blue-600">Board</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {userProfile?.full_name || user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Your Boards</h2>
              <p className="mt-2 text-gray-600">
                Organize your projects and manage your tasks
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              + Create Board
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : boards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/dashboard/board/${board.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {board.title}
                  </h3>
                  {board.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {board.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Created {new Date(board.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 font-medium group-hover:text-blue-700">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Create Board Card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Create New Board
                </h3>
                <p className="text-gray-600 text-sm">
                  Start a new project and organize your tasks
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No boards yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first project board
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Board
            </Button>
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onBoardCreated={handleBoardCreated}
      />
    </div>
  );
} 