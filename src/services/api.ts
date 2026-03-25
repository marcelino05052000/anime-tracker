import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Retry automático no rate limit (429) — Jikan: 3 req/s, 60 req/min
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 429 &&
      error.config
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api.request(error.config);
    }
    return Promise.reject(error);
  },
);
