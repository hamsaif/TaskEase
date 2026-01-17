// API service
// services/api.ts
const BASE_URL = "http://localhost:3000/api";

export async function apiFetch(
  url: string,
  options?: RequestInit
) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  return res.json();
}

