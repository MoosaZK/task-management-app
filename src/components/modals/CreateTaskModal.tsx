'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createTask, updateTask } from '@/lib/database';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/constants';
import type { Task, CreateTaskData } from '@/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId?: string;
  task?: Task; // For editing existing task
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
}

export function CreateTaskModal({ 
  isOpen, 
  onClose, 
  listId, 
  task, 
  onTaskCreated, 
  onTaskUpdated 
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'completed'>('todo');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!task;

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status);
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!isEditing && !listId) {
      setError('List ID is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        ...(isEditing ? {} : { list_id: listId! })
      };

      if (isEditing && task) {
        const updatedTask = await updateTask(task.id, taskData);
        if (updatedTask) {
          onTaskUpdated?.(updatedTask);
          handleClose();
        } else {
          setError('Failed to update task');
        }
      } else {
        const newTask = await createTask(taskData as CreateTaskData);
        if (newTask) {
          onTaskCreated?.(newTask);
          handleClose();
        } else {
          setError('Failed to create task');
        }
      }
    } catch (err) {
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the task`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} task:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!isEditing) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
    }
    setError('');
    setLoading(false);
    onClose();
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as 'low' | 'medium' | 'high');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as 'todo' | 'in_progress' | 'completed');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Task Title"
          placeholder="What needs to be done?"
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
            placeholder="Add more details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={handlePriorityChange}
              disabled={loading}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={TASK_PRIORITIES.LOW}>Low</option>
              <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
              <option value={TASK_PRIORITIES.HIGH}>High</option>
            </select>
          </div>

          {isEditing && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={loading}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={TASK_STATUSES.TODO}>To Do</option>
                <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
                <option value={TASK_STATUSES.COMPLETED}>Completed</option>
              </select>
            </div>
          )}
        </div>

        <Input
          type="date"
          label="Due Date (optional)"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
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
            {loading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Task' : 'Create Task')
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
} 