import { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';

const randomEnum = <T>(enumObj: { [s: string]: T }): T => {
  const values = Object.values(enumObj);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const taskTitles = [
  'Complete project proposal',
  'Review analytics dashboard',
  'Prepare presentation slides',
  'Update documentation',
  'Research new technologies',
  'Fix bugs in application',
  'Implement new feature',
  'Meet with client',
  'Plan marketing strategy',
  'Optimize database queries',
  'Design new UI components',
  'Conduct user interviews',
  'Setup deployment pipeline',
  'Refactor legacy code',
  'Create weekly report',
  'Respond to customer emails',
  'Attend team meeting',
  'Debug performance issues',
  'Write unit tests',
  'Update dependencies',
];

const taskDescriptions = [
  'Need to complete this task by collaborating with the team.',
  'This is a high priority task that requires immediate attention.',
  'Follow up with stakeholders after completing this task.',
  'Requires research and planning before implementation.',
  'Document all findings and share with the team.',
  'Schedule a follow-up meeting to discuss the results.',
  'Coordinate with external vendors for this task.',
  'This is part of the quarterly objectives.',
  'Requires approval from management.',
  'Create a detailed plan before starting.',
];

export const generateMockTasks = (count: number): Task[] => {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - 30);
  
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 30);

  return Array.from({ length: count }).map((_, index) => {
    const createdAt = randomDate(pastDate, now);
    const updatedAt = randomDate(createdAt, now);
    const dueDate = randomDate(now, futureDate);
    
    const status = randomEnum(TaskStatus);
    const progress = status === TaskStatus.COMPLETED 
      ? 100 
      : status === TaskStatus.IN_PROGRESS 
        ? randomInt(10, 90) 
        : 0;

    return {
      id: `task-${index + 1}`,
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      description: taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)],
      dueDate,
      category: randomEnum(TaskCategory),
      priority: randomEnum(TaskPriority),
      status,
      progress,
      createdAt,
      updatedAt,
    };
  });
};

export const generateMockActivities = (tasks: Task[], count: number) => {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - 7);

  const actions = ['created', 'updated', 'completed', 'deleted'] as const;

  return Array.from({ length: count }).map((_, index) => {
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    return {
      id: `activity-${index + 1}`,
      taskId: task.id,
      taskTitle: task.title,
      action: actions[Math.floor(Math.random() * actions.length)],
      timestamp: randomDate(pastDate, now),
    };
  });
};