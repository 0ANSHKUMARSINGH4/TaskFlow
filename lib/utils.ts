import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TaskCategory, TaskPriority, TaskStatus } from '@/types/task';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateWithTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isOverdue(date: Date): boolean {
  return date < new Date();
}

export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.PENDING:
      return 'text-yellow-500 dark:text-yellow-400';
    case TaskStatus.IN_PROGRESS:
      return 'text-blue-500 dark:text-blue-400';
    case TaskStatus.COMPLETED:
      return 'text-green-500 dark:text-green-400';
    default:
      return '';
  }
}

export function getTaskStatusBgColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case TaskStatus.COMPLETED:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    default:
      return '';
  }
}

export function getTaskPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return 'text-green-500 dark:text-green-400';
    case TaskPriority.MEDIUM:
      return 'text-blue-500 dark:text-blue-400';
    case TaskPriority.HIGH:
      return 'text-red-500 dark:text-red-400';
    default:
      return '';
  }
}

export function getTaskPriorityBgColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case TaskPriority.MEDIUM:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case TaskPriority.HIGH:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default:
      return '';
  }
}

export function getTaskCategoryColor(category: TaskCategory): string {
  switch (category) {
    case TaskCategory.WORK:
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
    case TaskCategory.PERSONAL:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
    case TaskCategory.URGENT:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    case TaskCategory.OTHER:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    default:
      return '';
  }
}

export function calculateTaskStats(tasks: any[]) {
  const now = new Date();
  
  const stats = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
  };

  tasks.forEach(task => {
    if (task.status === TaskStatus.COMPLETED) {
      stats.completed++;
    } else if (task.status === TaskStatus.PENDING) {
      stats.pending++;
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      stats.inProgress++;
    }

    if (new Date(task.dueDate) < now && task.status !== TaskStatus.COMPLETED) {
      stats.overdue++;
    }
  });

  return stats;
}