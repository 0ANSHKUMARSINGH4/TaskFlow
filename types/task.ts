export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  URGENT = 'urgent',
  OTHER = 'other',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
}

export interface ActivityItem {
  id: string;
  taskId: string;
  taskTitle: string;
  action: 'created' | 'updated' | 'completed' | 'deleted';
  timestamp: Date;
}