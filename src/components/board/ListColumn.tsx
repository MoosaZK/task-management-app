'use client';

import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/Button';
import type { List, Task } from '@/types';
import { cn } from '@/utils/cn';

interface ListColumnProps {
  list: List;
  onAddTask?: (listId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditList?: (list: List) => void;
  onDeleteList?: (listId: string) => void;
  className?: string;
}

export function ListColumn({ 
  list, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onEditList, 
  onDeleteList,
  className 
}: ListColumnProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddTask = () => {
    onAddTask?.(list.id);
  };

  const handleEditList = () => {
    onEditList?.(list);
  };

  const handleDeleteList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (list.tasks && list.tasks.length > 0) {
      if (!window.confirm(`Delete "${list.title}" and all ${list.tasks.length} tasks in it?`)) {
        return;
      }
    }
    onDeleteList?.(list.id);
  };

  const taskCount = list.tasks?.length || 0;

  return (
    <div
      className={cn(
        'bg-gray-50 rounded-lg p-4 min-h-[500px] w-80 flex-shrink-0',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* List Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 flex-1">
          <h3 
            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleEditList}
          >
            {list.title}
          </h3>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {taskCount}
          </span>
        </div>

        {/* List Actions */}
        {isHovered && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditList}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteList}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tasks Container */}
      <div className="space-y-3 mb-4 min-h-[300px]">
        {list.tasks && list.tasks.length > 0 ? (
          list.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <Button 
        variant="ghost" 
        className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-white"
        onClick={handleAddTask}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add task
      </Button>
    </div>
  );
} 