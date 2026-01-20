
import { apiFetch } from "./api";


export const TaskService = {
  getAll() {
    return apiFetch("/tasks");
  },

  getById(id: number) {
    return apiFetch(`/tasks/${id}`);
  },

  create(data: any) {
    return apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  update(id: number, data: any) {
    return apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  delete(id: number) {
    return apiFetch(`/tasks/${id}`, {
      method: "DELETE"
    });
  }
};