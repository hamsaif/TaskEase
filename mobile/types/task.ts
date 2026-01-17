// types/task.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  category?: {
    id: number;
    name: string;
  };
}
