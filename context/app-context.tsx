"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { generateMockTasks } from '@/lib/mock-data';

interface AppContextType {
  tasks: Task[];
  isAddTaskDialogOpen: boolean;
  openAddTaskDialog: () => void;
  closeAddTaskDialog: () => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => void;
  bulkDeleteTasks: (taskIds: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data for demonstration
    const mockTasks = generateMockTasks(25);
    setTasks(mockTasks);
  }, []);

  const openAddTaskDialog = () => setIsAddTaskDialogOpen(true);
  const closeAddTaskDialog = () => setIsAddTaskDialogOpen(false);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    toast({
      title: "Task created",
      description: "Your task has been successfully created.",
    });
  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task))
    );
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Your task has been successfully deleted.",
    });
  };

  const bulkUpdateTasks = (taskIds: string[], updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (taskIds.includes(task.id) ? { ...task, ...updates } : task))
    );
    toast({
      title: "Tasks updated",
      description: `${taskIds.length} tasks have been updated.`,
    });
  };

  const bulkDeleteTasks = (taskIds: string[]) => {
    setTasks((prev) => prev.filter((task) => !taskIds.includes(task.id)));
    toast({
      title: "Tasks deleted",
      description: `${taskIds.length} tasks have been deleted.`,
    });
  };

  const contextValue: AppContextType = {
    tasks,
    isAddTaskDialogOpen,
    openAddTaskDialog,
    closeAddTaskDialog,
    addTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks,
    bulkDeleteTasks,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};