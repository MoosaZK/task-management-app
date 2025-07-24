'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { Task } from '@/types';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/utils/constants';
import { cn } from '@/utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  className?: string;
}

export function TaskCard({ task, onEdit, onDelete, className }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete?.(task.id);
    }
  };

  const priorityColor = PRIORITY_COLORS[task.priority || 'medium'];
  const statusColor = STATUS_COLORS[task.status];
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md group',
        isOverdue && 'border-l-4 border-l-red-500',
        className
      )}
      onClick={handleEdit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-5 flex-1 pr-2">
          {task.title}
        </h3>
        {isHovered && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 flex-shrink-0"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Priority Badge */}
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            priorityColor
          )}>
            {task.priority || 'medium'}
          </span>

          {/* Status Badge */}
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            statusColor
          )}>
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {/* Due Date */}
        {task.due_date && (
          <span className={cn(
            'text-xs',
            isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
          )}>
            {format(new Date(task.due_date), 'MMM d')}
          </span>
        )}
      </div>

      {/* Overdue Indicator */}
      {isOverdue && (
        <div className="mt-2 flex items-center text-red-600 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Overdue
        </div>
      )}
    </div>
  );
} 