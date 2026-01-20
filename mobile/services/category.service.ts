import { apiFetch } from "./api";

export const CategoryService = {
  getAll() {
    return apiFetch("/category");
  },

  getById(id: number) {
    return apiFetch(`/category/${id}`);
  },

  create(data: any) {
    return apiFetch("/category", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  update(id: number, data: any) {
    return apiFetch(`/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  delete(id: number) {
    return apiFetch(`/category/${id}`, {
      method: "DELETE"
    });
  }
};