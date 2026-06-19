import axios from "axios";
import { useAuthStore } from "../features/auth/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/v1";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  }
};

// Initialize from storage
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("access_token");
}

http.interceptors.request.use((config) => {
  // Get token from store (fallback to local accessToken var)
  const storeToken = useAuthStore.getState().token;
  const tokenToUse = storeToken || accessToken;
  if (tokenToUse) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${tokenToUse}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error?.config;
    const isLoginPage = window.location.pathname === "/login";

    // Handle Subscription/Paywall
    if (error?.response?.status === 402) {
      const path = location.pathname;
      if (path !== "/app/billing" && path !== "/app/billing/processing") {
        try {
          const msg =
            error?.response?.data?.errorMessage || "Subscription required";
          localStorage.setItem("paywall_reason", msg);
        } catch {}
        location.assign("/app/billing");
      }
      return Promise.reject(error);
    }

    // Handle Token Refresh (401)
    if (
      error?.response?.status === 401 &&
      original &&
      !original.__isRetryRequest &&
      !isLoginPage
    ) {
      try {
        if (!refreshing) {
          refreshing = (async () => {
            const { data } = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            );
            const newToken = data?.token as string | undefined;
            if (newToken) {
              setAccessToken(newToken);
              useAuthStore.getState().token = newToken;
            }
            return newToken || null;
          })().finally(() => (refreshing = null));
        }

        const newTok = await refreshing;
        if (newTok) {
          original.__isRetryRequest = true;
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newTok}`;
          return http(original);
        }
      } catch (refreshErr) {
        // Refresh failed, fall through to logout
      }
    }

    // FINAL FALLBACK: If we reach here, session is dead.
    // We only redirect if we aren't already on the login page to prevent infinite reloads.
    try {
      setAccessToken(null);
      useAuthStore.getState().token = null;
      useAuthStore.getState().user = null;
      useAuthStore.getState().hydrated = true;
      if (!isLoginPage) {
        setTimeout(() => {
          window.location.assign("/login");
        }, 50);
      }
    } catch {}

    return Promise.reject(error);
  }
);
