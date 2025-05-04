"use client";

import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/app-context';
import { formatDate, getDaysUntil, getTaskCategoryColor, getTaskPriorityBgColor, getTaskStatusBgColor, isOverdue } from '@/lib/utils';
import { TaskDialog } from './task-dialog';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleStatusChange = (status: TaskStatus) => {
    const updates: Partial<Task> = { status };
    if (status === TaskStatus.COMPLETED) {
      updates.progress = 100;
    } else if (status === TaskStatus.IN_PROGRESS && task.progress === 0) {
      updates.progress = 10;
    }
    updateTask(task.id, updates);
  };

  const isTaskOverdue = isOverdue(new Date(task.dueDate));
  const daysUntil = getDaysUntil(new Date(task.dueDate));
  
  return (
    <>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-medium line-clamp-2">{task.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {task.status !== TaskStatus.COMPLETED && (
                  <DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.COMPLETED)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Complete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className={getTaskStatusBgColor(task.status)}>
              {task.status.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className={getTaskPriorityBgColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={getTaskCategoryColor(task.category)}>
              {task.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Due: {formatDate(new Date(task.dueDate))}</span>
            {isTaskOverdue && task.status !== TaskStatus.COMPLETED && (
              <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex w-full justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            {task.status !== TaskStatus.COMPLETED ? (
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs"
                onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Complete
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              >
                <Clock className="mr-1 h-3 w-3" />
                Reopen
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {isEditDialogOpen && (
        <TaskDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          task={task}
          mode="edit"
        />
      )}
    </>
  );
}