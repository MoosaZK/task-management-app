'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createList } from '@/lib/database';
import type { List } from '@/types';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  onListCreated?: (list: List) => void;
}

export function CreateListModal({ isOpen, onClose, boardId, onListCreated }: CreateListModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const list = await createList({
        title: title.trim(),
        board_id: boardId
      });

      if (list) {
        onListCreated?.(list);
        handleClose();
      } else {
        setError('Failed to create list');
      }
    } catch (err) {
      setError('An error occurred while creating the list');
      console.error('Error creating list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New List"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="List Title"
          placeholder="e.g., To Do, In Progress, Done"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          autoFocus
        />

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
            {loading ? 'Creating...' : 'Create List'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 