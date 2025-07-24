'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { createBoard } from '@/lib/database';
import type { Board } from '@/types';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardCreated?: (board: Board) => void;
}

export function CreateBoardModal({ isOpen, onClose, onBoardCreated }: CreateBoardModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const board = await createBoard(
        { title: title.trim(), description: description.trim() || undefined },
        user.id
      );

      if (board) {
        onBoardCreated?.(board);
        handleClose();
      } else {
        setError('Failed to create board');
      }
    } catch (err) {
      setError('An error occurred while creating the board');
      console.error('Error creating board:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Board"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Board Title"
          placeholder="e.g., My Project Board"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          autoFocus
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            placeholder="What's this board for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!title.trim()}
          >
            {loading ? 'Creating...' : 'Create Board'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 