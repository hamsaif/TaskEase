// API service

const BASE_URL = "http://10.0.2.2:3000/api";

export async function apiFetch(
  url: string,
  options?: RequestInit
) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  return res.json();
}
