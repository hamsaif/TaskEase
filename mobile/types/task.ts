export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
    color?: string | null;
  };
  subtasks?: Subtask[];
}

export interface Subtask {
  id: number;
  name: string;
  isCompleted: boolean;
  taskId: number;
  createdAt: string;
}