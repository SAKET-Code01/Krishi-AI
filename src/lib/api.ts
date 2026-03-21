const trimTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredBaseUrl
  ? trimTrailingSlashes(configuredBaseUrl)
  : "https://krishi-ai-tasn.onrender.com";

export const getApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
