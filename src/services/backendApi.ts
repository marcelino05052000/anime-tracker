import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const backendApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isLoggedOut = false;
let isRefreshing = false;

export function markLoggedOut() {
  isLoggedOut = true;
}

export function markLoggedIn() {
  isLoggedOut = false;
}
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(undefined);
    }
  });
  failedQueue = [];
}

backendApi.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Don't retry after logout, refresh, or login/register requests
    if (isLoggedOut || originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => backendApi.request(originalRequest));
    }

    isRefreshing = true;

    try {
      await backendApi.post('/auth/refresh');
      processQueue(null);
      return backendApi.request(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
