"use client";

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useAppContext } from '@/context/app-context';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from '@/components/task/task-card';
import { TaskDialog } from '@/components/task/task-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BoardPage() {
  const { tasks, updateTask } = useAppContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const tasksByStatus = {
    [TaskStatus.PENDING]: tasks.filter(task => task.status === TaskStatus.PENDING),
    [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.COMPLETED]: tasks.filter(task => task.status === TaskStatus.COMPLETED),
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the task that was dragged
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Update the task status based on the destination droppableId
    const newStatus = destination.droppableId as TaskStatus;
    
    // Update the progress based on the new status
    let progress = task.progress;
    if (newStatus === TaskStatus.COMPLETED) {
      progress = 100;
    } else if (newStatus === TaskStatus.IN_PROGRESS && task.status === TaskStatus.PENDING) {
      progress = 10; // Start progress at 10% when moved to in-progress
    } else if (newStatus === TaskStatus.PENDING && task.status !== TaskStatus.PENDING) {
      progress = 0; // Reset progress when moved back to pending
    }

    // Update the task
    updateTask(task.id, { 
      status: newStatus,
      progress 
    });
  };

  const getColumnTitle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "To Do";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.COMPLETED:
        return "Completed";
      default:
        return status;
    }
  };

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "bg-yellow-50 dark:bg-yellow-950";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-50 dark:bg-blue-950";
      case TaskStatus.COMPLETED:
        return "bg-green-50 dark:bg-green-950";
      default:
        return "";
    }
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">
            Drag and drop tasks to update their status.
          </p>
        </div>
        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="flex flex-col rounded-lg border h-full">
              <div className={`p-3 ${getColumnColor(status as TaskStatus)} rounded-t-lg border-b`}>
                <h3 className="font-medium">
                  {getColumnTitle(status as TaskStatus)} ({statusTasks.length})
                </h3>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-3 p-3 flex-1 overflow-y-auto min-h-[500px]"
                  >
                    {statusTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {statusTasks.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground border-2 border-dashed rounded-md h-24 flex items-center justify-center">
                        No tasks in this column
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        mode="add"
      />
    </div>
  );
}