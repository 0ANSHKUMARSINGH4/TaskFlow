"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskDialog } from '@/components/task/task-dialog';
import { Progress } from '@/components/ui/progress';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { formatDate, getTaskCategoryColor, getTaskPriorityBgColor, getTaskStatusBgColor, isOverdue } from '@/lib/utils';

type SortField = 'title' | 'dueDate' | 'priority' | 'status' | 'progress' | 'category' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function ListPage() {
  const { tasks, deleteTask, updateTask, bulkUpdateTasks, bulkDeleteTasks } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority': {
        const priorityOrder = { [TaskPriority.LOW]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.HIGH]: 2 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case 'status': {
        const statusOrder = { [TaskStatus.PENDING]: 0, [TaskStatus.IN_PROGRESS]: 1, [TaskStatus.COMPLETED]: 2 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      }
      case 'progress':
        comparison = a.progress - b.progress;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSelectAll = () => {
    if (selectedTasks.length === sortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(sortedTasks.map(task => task.id));
    }
  };

  const handleSelectTask = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleBulkComplete = () => {
    bulkUpdateTasks(selectedTasks, { status: TaskStatus.COMPLETED, progress: 100 });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    bulkDeleteTasks(selectedTasks);
    setSelectedTasks([]);
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4" /> : 
      <ArrowDown className="ml-1 h-4 w-4" />;
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task List</h1>
          <p className="text-muted-foreground">
            View and manage all your tasks in a list format.
          </p>
        </div>
        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
              <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value={TaskCategory.WORK}>Work</SelectItem>
              <SelectItem value={TaskCategory.PERSONAL}>Personal</SelectItem>
              <SelectItem value={TaskCategory.URGENT}>Urgent</SelectItem>
              <SelectItem value={TaskCategory.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedTasks.length > 0 && (
        <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">{selectedTasks.length} tasks selected</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkComplete}>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Mark Complete
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedTasks.length === sortedTasks.length && sortedTasks.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all tasks"
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                <div className="flex items-center">
                  Title
                  <SortIndicator field="title" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center">
                  Due Date
                  <SortIndicator field="dueDate" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                <div className="flex items-center">
                  Category
                  <SortIndicator field="category" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                <div className="flex items-center">
                  Priority
                  <SortIndicator field="priority" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center">
                  Status
                  <SortIndicator field="status" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('progress')}>
                <div className="flex items-center">
                  Progress
                  <SortIndicator field="progress" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => handleSelectTask(task.id)}
                      aria-label={`Select ${task.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatDate(new Date(task.dueDate))}
                      {isOverdue(new Date(task.dueDate)) && task.status !== TaskStatus.COMPLETED && (
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTaskCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTaskPriorityBgColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTaskStatusBgColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-[90px]">
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditTask(task)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {task.status !== TaskStatus.COMPLETED && (
                          <DropdownMenuItem onClick={() => updateTask(task.id, { status: TaskStatus.COMPLETED, progress: 100 })}>
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        mode="add"
      />

      {editTask && (
        <TaskDialog
          open={!!editTask}
          onOpenChange={() => setEditTask(null)}
          task={editTask}
          mode="edit"
        />
      )}
    </div>
  );
}