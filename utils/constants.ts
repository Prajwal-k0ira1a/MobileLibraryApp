const env = (key: string, fallback?: string) =>
  (process.env?.[key] as string | undefined) ?? fallback ?? "";

// API Configuration
export const BACKEND_BASE_URL = env(
  "EXPO_PUBLIC_API_BASE_URL"
);
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;
export const API_VERSION = env("EXPO_PUBLIC_API_VERSION", "v1");

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: env("EXPO_PUBLIC_API_AUTH_LOGIN", "/auth/login"),
  },
  USERS: {
    ME: env("EXPO_PUBLIC_API_USERS_ME", "/users/me"),
  },
  BOOKS: {
    GET_ALL: env("EXPO_PUBLIC_API_BOOKS_GET_ALL", "/books/getAll"),
    GET_BY_ID: env("EXPO_PUBLIC_API_BOOKS_GET_BY_ID", "/books/getBookById"),
    BORROW: env("EXPO_PUBLIC_API_BOOKS_BORROW", "/books/borrow"),
    RETURN: env("EXPO_PUBLIC_API_BOOKS_RETURN", "/books/return"),
    SEARCH: env("EXPO_PUBLIC_API_BOOKS_SEARCH", "/books/search"),
    GENRE: env("EXPO_PUBLIC_API_BOOKS_GENRE", "/books/genre"),
  },
};

// App Configuration
export const APP_CONFIG = {
  NAME: env("EXPO_PUBLIC_APP_NAME", "Library Management System"),
  VERSION: env("EXPO_PUBLIC_APP_VERSION", "1.0.0"),
};

// API Timeout
export const API_TIMEOUT = parseInt(env("EXPO_PUBLIC_API_TIMEOUT", "10000"));

// Legacy exports for backward compatibility
export const API_AUTH_URL = `${API_BASE_URL}/auth`;
export const API_BOOKS_URL = `${API_BASE_URL}/books`;
export const API_USERS_URL = `${API_BASE_URL}/users`;
export const API_BORROW_URL = `${API_BASE_URL}/borrow`;
