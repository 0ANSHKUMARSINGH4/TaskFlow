"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskDialog } from '@/components/task/task-dialog';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { cn, getTaskPriorityBgColor } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get the days for the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Sort tasks by priority
  const sortTasksByPriority = (tasks: Task[]) => {
    const priorityOrder = {
      [TaskPriority.HIGH]: 0,
      [TaskPriority.MEDIUM]: 1,
      [TaskPriority.LOW]: 2,
    };
    
    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar View</h1>
          <p className="text-muted-foreground">
            Visualize your tasks on a monthly calendar.
          </p>
        </div>
        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="calendar-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 font-medium text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }, (_, i) => (
            <div key={`empty-start-${i}`} className="p-2 min-h-[100px] bg-muted/20 rounded-md"></div>
          ))}

          {daysInMonth.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 min-h-[100px] rounded-md border cursor-pointer overflow-hidden transition-colors",
                  isCurrentDay && "bg-primary/10 dark:bg-primary/20",
                  isSelected && "ring-2 ring-primary",
                  !isSameMonth(day, currentMonth) && "opacity-50"
                )}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "inline-block rounded-full h-6 w-6 text-center",
                    isCurrentDay && "bg-primary text-primary-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <Badge variant="outline">{dayTasks.length}</Badge>
                  )}
                </div>

                <div className="space-y-1 mt-1">
                  {sortTasksByPriority(dayTasks).slice(0, 3).map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "text-xs p-1 rounded truncate cursor-pointer",
                        getTaskPriorityBgColor(task.priority),
                        task.status === TaskStatus.COMPLETED && "opacity-70 line-through"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      + {dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {Array.from({ length: 6 - monthEnd.getDay() }, (_, i) => (
            <div key={`empty-end-${i}`} className="p-2 min-h-[100px] bg-muted/20 rounded-md"></div>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              {getTasksForDay(selectedDate).length > 0 ? (
                getTasksForDay(selectedDate).map(task => (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge className={getTaskPriorityBgColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">No tasks for this day</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsAddTaskOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <TaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        mode="add"
      />

      {selectedTask && (
        <TaskDialog
          open={!!selectedTask}
          onOpenChange={() => setSelectedTask(null)}
          task={selectedTask}
          mode="edit"
        />
      )}
    </div>
  );
}